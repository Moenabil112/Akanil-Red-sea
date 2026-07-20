import { isRequestTypeId, isPlatformId } from "@/lib/ecosystem";
import { isValueChainId } from "@/lib/value-chains";
import { isParticipationPathId, isSectorTrackId } from "@/lib/forum";

/**
 * P4-A validates the existing public controlled taxonomies (P4-A §9.5) but
 * never redefines them. A case may reference a request type, platform,
 * value chain, Forum participation path or sector track only if the id is
 * a known public id; unknown ids are rejected.
 */

/** Returns the value if it is a valid public id of the given kind, else null. */
export function validPublicId(
  kind: "requestType" | "platform" | "chain" | "participant" | "track",
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  const guard = {
    requestType: isRequestTypeId,
    platform: isPlatformId,
    chain: isValueChainId,
    participant: isParticipationPathId,
    track: isSectorTrackId,
  }[kind];
  return guard(value) ? value : null;
}
