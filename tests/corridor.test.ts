import { describe, expect, it } from "vitest";
import {
  nodePositions,
  routePath,
  routesForNode,
  stateStroke,
} from "@/lib/corridor";
import { en } from "@/content/en/site";
import type { RouteState } from "@/content/types";

describe("corridor geometry", () => {
  it("passes via-routes through the intermediate node", () => {
    const viaRoute = en.corridor.routes.find((r) => r.via === "egypt")!;
    const path = routePath(viaRoute);
    const egypt = nodePositions.egypt;
    expect(path).toContain(`${egypt.x} ${egypt.y}`);
  });

  it("separates opposing direct routes with different bends", () => {
    const sudanToMorocco = en.corridor.routes.find(
      (r) => r.id === "CR-01",
    )!;
    const moroccoToSudan = en.corridor.routes.find(
      (r) => r.id === "CR-05",
    )!;
    expect(routePath(sudanToMorocco)).not.toEqual(routePath(moroccoToSudan));
  });

  it("filters routes touching a node, including via", () => {
    const egyptRoutes = routesForNode(en.corridor.routes, "egypt");
    expect(egyptRoutes.map((r) => r.id)).toEqual(["CR-02"]);
    const moroccoRoutes = routesForNode(en.corridor.routes, "morocco");
    expect(moroccoRoutes).toHaveLength(4);
  });

  it("defines a distinct stroke pattern for every state", () => {
    const states: RouteState[] = [
      "conceptual",
      "under-study",
      "pilot-qualified",
      "verified",
      "constrained",
      "alternative",
    ];
    const patterns = states.map(
      (s) => `${stateStroke[s].dash}/${stateStroke[s].width}`,
    );
    expect(new Set(patterns).size).toBe(states.length);
  });

  it("has positions for every content node", () => {
    for (const node of en.corridor.nodes) {
      expect(nodePositions[node.id]).toBeDefined();
    }
  });
});
