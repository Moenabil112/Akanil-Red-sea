import { describe, expect, it } from "vitest";
import {
  canonicalize,
  computeEventHash,
  verifyChain,
  type ChainRow,
  type HashPayload,
} from "@/lib/internal/audit-chain";
import { redactFields } from "@/lib/internal/audit";

/**
 * P4-B audit hash-chain unit tests (§12/§30). Deterministic serialization and
 * hashing, chain verification, and tamper detection. No database required.
 */

function payload(seq: number, prev: string | null, over: Partial<HashPayload> = {}): HashPayload {
  return {
    sequenceNumber: seq,
    actorEmployeeId: "emp1",
    action: "TEST_ACTION",
    entityType: "Case",
    entityId: "case1",
    caseId: "case1",
    summary: `event ${seq}`,
    changedFields: null,
    createdAt: new Date(1700000000000 + seq * 1000).toISOString(),
    previousEventHash: prev,
    hashVersion: 1,
    ...over,
  };
}

function buildChain(n: number): ChainRow[] {
  const rows: ChainRow[] = [];
  let prev: string | null = null;
  for (let i = 1; i <= n; i++) {
    const p = payload(i, prev);
    const eventHash = computeEventHash(p);
    rows.push({
      id: `id${i}`,
      sequenceNumber: i,
      actorEmployeeId: p.actorEmployeeId,
      action: p.action,
      entityType: p.entityType,
      entityId: p.entityId,
      caseId: p.caseId,
      summary: p.summary,
      changedFields: p.changedFields,
      createdAt: new Date(p.createdAt),
      previousEventHash: prev,
      eventHash,
      hashVersion: 1,
    });
    prev = eventHash;
  }
  return rows;
}

describe("canonical serialization", () => {
  it("sorts object keys deterministically", () => {
    expect(canonicalize({ b: 1, a: 2 })).toBe(canonicalize({ a: 2, b: 1 }));
    expect(canonicalize({ a: 2, b: 1 })).toBe('{"a":2,"b":1}');
  });
  it("recurses into nested objects and arrays", () => {
    const x = canonicalize({ z: [{ b: 1, a: 2 }] });
    const y = canonicalize({ z: [{ a: 2, b: 1 }] });
    expect(x).toBe(y);
  });
});

describe("event hash", () => {
  it("is deterministic for identical payloads", () => {
    expect(computeEventHash(payload(1, null))).toBe(computeEventHash(payload(1, null)));
  });
  it("changes when any committed field changes", () => {
    const base = computeEventHash(payload(1, null));
    expect(computeEventHash(payload(1, null, { summary: "changed" }))).not.toBe(base);
    expect(computeEventHash(payload(1, "prevhash"))).not.toBe(base);
    expect(computeEventHash(payload(2, null))).not.toBe(base);
  });
});

describe("chain verification", () => {
  it("verifies a valid chain from genesis", () => {
    const rows = buildChain(5);
    const verdict = verifyChain(rows);
    expect(verdict.ok).toBe(true);
    if (verdict.ok) expect(verdict.verified).toBe(5);
  });

  it("detects an altered event (hash mismatch)", () => {
    const rows = buildChain(5);
    rows[2]!.summary = "tampered summary"; // content changed, hash not recomputed
    const verdict = verifyChain(rows);
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) expect(verdict.brokenSequence).toBe(3);
  });

  it("detects a deleted event (sequence gap)", () => {
    const rows = buildChain(5);
    rows.splice(2, 1); // remove sequence 3
    const verdict = verifyChain(rows);
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) expect(verdict.brokenSequence).toBe(4);
  });

  it("detects a broken previous-hash link", () => {
    const rows = buildChain(5);
    rows[3]!.previousEventHash = "wronghash";
    const verdict = verifyChain(rows);
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) expect(verdict.brokenSequence).toBe(4);
  });

  it("flags unsequenced (un-backfilled) rows", () => {
    const rows = buildChain(2);
    rows[1]!.sequenceNumber = null;
    const verdict = verifyChain(rows);
    expect(verdict.ok).toBe(false);
  });
});

describe("hash payload excludes secrets", () => {
  it("redacts password/token/secret/body before they can be hashed", () => {
    const redacted = redactFields({
      password: "hunter2",
      token: "abc",
      secret: "s",
      body: "confidential note",
      role: "CASE_MANAGER",
    });
    expect(redacted).toEqual({
      password: "[redacted]",
      token: "[redacted]",
      secret: "[redacted]",
      body: "[redacted]",
      role: "CASE_MANAGER",
    });
    // Hashing the redacted object never contains the secret material.
    const serialized = canonicalize(redacted);
    expect(serialized).not.toContain("hunter2");
    expect(serialized).not.toContain("confidential note");
  });
});
