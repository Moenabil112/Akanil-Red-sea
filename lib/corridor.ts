import type {
  CorridorNodeId,
  CorridorRouteContent,
  RouteState,
} from "@/content/types";

/**
 * Schematic geometry for the conceptual corridor diagram (ADR-004).
 * Coordinates live in a fixed LTR viewBox; geography is never mirrored
 * in RTL. Positions are schematic west→east, not cartographic.
 */
export const VIEWBOX = { width: 900, height: 520 } as const;

export const nodePositions: Record<CorridorNodeId, { x: number; y: number }> = {
  morocco: { x: 130, y: 170 },
  egypt: { x: 555, y: 130 },
  saudi: { x: 775, y: 205 },
  "red-sea": { x: 668, y: 300 },
  sudan: { x: 590, y: 420 },
};

/**
 * Path between two nodes. Via-routes pass through the intermediate node
 * (two quadratic legs); direct routes bow north or south depending on
 * travel direction so parallel scenarios stay visually distinct.
 */
export function routePath(route: CorridorRouteContent): string {
  const from = nodePositions[route.from];
  const to = nodePositions[route.to];
  if (route.via) {
    const via = nodePositions[route.via];
    const c1x = (from.x + via.x) / 2;
    const c1y = (from.y + via.y) / 2 - 30;
    const c2x = (via.x + to.x) / 2;
    const c2y = (via.y + to.y) / 2 - 30;
    return `M ${from.x} ${from.y} Q ${c1x} ${c1y} ${via.x} ${via.y} Q ${c2x} ${c2y} ${to.x} ${to.y}`;
  }
  const bend = route.from === "morocco" ? 70 : -60;
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 + bend;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

/** Stroke pattern per route state — state is never color-only (legend + text). */
export const stateStroke: Record<RouteState, { dash: string; width: number }> = {
  conceptual: { dash: "3 7", width: 1.5 },
  "under-study": { dash: "8 6", width: 1.75 },
  "pilot-qualified": { dash: "14 4", width: 2 },
  verified: { dash: "0", width: 2.5 },
  constrained: { dash: "2 4", width: 1.5 },
  alternative: { dash: "10 4 2 4", width: 1.5 },
};

export function routesForNode(
  routes: CorridorRouteContent[],
  nodeId: CorridorNodeId,
): CorridorRouteContent[] {
  return routes.filter(
    (route) =>
      route.from === nodeId || route.to === nodeId || route.via === nodeId,
  );
}
