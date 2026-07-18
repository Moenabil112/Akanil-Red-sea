"use client";

import { useId, useState } from "react";
import type { SiteContent, CorridorNodeId } from "@/content/types";
import {
  VIEWBOX,
  nodePositions,
  routePath,
  stateStroke,
  routesForNode,
} from "@/lib/corridor";
import styles from "./CorridorMap.module.css";

interface CorridorMapProps {
  corridor: SiteContent["corridor"];
}

const stateColor: Record<string, string> = {
  conceptual: "var(--color-sand)",
  "under-study": "var(--color-nile)",
  "pilot-qualified": "var(--color-green)",
  verified: "var(--color-gold)",
  constrained: "var(--color-copper)",
  alternative: "var(--color-nile)",
};

/**
 * Conceptual corridor experience (ADR-004): HTML node buttons drive both
 * the schematic SVG (decorative, dir-locked LTR) and a text summary that
 * lives outside the SVG. All states are labelled; nothing implies live
 * tracking or a verified operation.
 */
export default function CorridorMap({ corridor }: CorridorMapProps) {
  const [selected, setSelected] = useState<CorridorNodeId>("morocco");
  const summaryId = useId();

  const selectedNode = corridor.nodes.find((node) => node.id === selected);
  const relatedRoutes = routesForNode(corridor.routes, selected);
  const activeRouteIds = new Set(relatedRoutes.map((route) => route.id));

  return (
    <div className={styles.wrapper}>
      <div className={styles.mapColumn}>
        {/* Schematic diagram — presentation only; geography stays LTR. */}
        <div className={styles.mapFrame} dir="ltr" aria-hidden="true">
          <svg
            className={styles.svg}
            viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
            role="img"
            focusable="false"
          >
            <defs>
              <radialGradient id="corridor-sea" cx="0.72" cy="0.55" r="0.55">
                <stop offset="0%" stopColor="rgba(49,123,131,0.3)" />
                <stop offset="100%" stopColor="rgba(49,123,131,0)" />
              </radialGradient>
            </defs>

            <rect
              width={VIEWBOX.width}
              height={VIEWBOX.height}
              fill="url(#corridor-sea)"
            />

            {corridor.routes.map((route) => {
              const active = activeRouteIds.has(route.id);
              const stroke = stateStroke[route.state];
              return (
                <path
                  key={route.id}
                  d={routePath(route)}
                  fill="none"
                  stroke={stateColor[route.state] ?? "var(--color-sand)"}
                  strokeWidth={active ? stroke.width + 1 : stroke.width}
                  strokeDasharray={stroke.dash}
                  strokeLinecap="round"
                  className={active ? styles.routeActive : styles.route}
                />
              );
            })}

            {corridor.nodes.map((node) => {
              const position = nodePositions[node.id];
              const active = node.id === selected;
              const isSea = node.id === "red-sea";
              return (
                <g key={node.id}>
                  {active ? (
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r={22}
                      fill="none"
                      stroke="var(--color-gold)"
                      strokeOpacity={0.4}
                      className={styles.pulse}
                    />
                  ) : null}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={isSea ? 7 : 9}
                    fill={active ? "var(--color-gold)" : "var(--color-ivory)"}
                    fillOpacity={isSea ? 0.55 : 0.95}
                    stroke="var(--color-midnight)"
                    strokeWidth={2}
                  />
                  <text
                    x={position.x}
                    y={position.y + (node.id === "egypt" ? -18 : 30)}
                    textAnchor="middle"
                    className={active ? styles.labelActive : styles.label}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <p className={styles.disclaimer}>{corridor.disclaimer}</p>

        <div className={styles.legend}>
          <h4 className={styles.legendTitle}>{corridor.legendTitle}</h4>
          <ul className={styles.legendList}>
            {(Object.keys(corridor.states) as (keyof typeof corridor.states)[]).map(
              (state) => (
                <li key={state} className={styles.legendItem}>
                  <svg
                    className={styles.legendSwatch}
                    viewBox="0 0 44 8"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <line
                      x1="2"
                      y1="4"
                      x2="42"
                      y2="4"
                      stroke={stateColor[state] ?? "var(--color-sand)"}
                      strokeWidth={stateStroke[state].width}
                      strokeDasharray={stateStroke[state].dash}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={styles.legendLabel}>
                    <strong>{corridor.states[state].label}</strong>{" "}
                    <span>{corridor.states[state].description}</span>
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>

      <div className={styles.panel}>
        <h4 className={styles.panelTitle}>{corridor.nodeListTitle}</h4>
        <p className={styles.prompt}>{corridor.selectPrompt}</p>
        <ul className={styles.nodeList} role="list">
          {corridor.nodes.map((node) => (
            <li key={node.id}>
              <button
                type="button"
                className={
                  node.id === selected ? styles.nodeActive : styles.nodeButton
                }
                aria-pressed={node.id === selected}
                aria-describedby={summaryId}
                onClick={() => setSelected(node.id)}
              >
                <span className={styles.nodeName}>{node.name}</span>
                <span className={styles.nodeRole}>{node.role}</span>
              </button>
            </li>
          ))}
        </ul>

        <div
          id={summaryId}
          className={styles.summary}
          role="region"
          aria-live="polite"
          aria-label={corridor.summaryTitle}
        >
          {selectedNode ? (
            <>
              <h5 className={styles.summaryName}>
                {selectedNode.name}
                <span className={styles.summaryRole}> — {selectedNode.role}</span>
              </h5>
              <p className={styles.summaryText}>{selectedNode.description}</p>
              <ul className={styles.routeList}>
                {relatedRoutes.map((route) => (
                  <li key={route.id} className={styles.routeItem}>
                    <span className={styles.routeHead}>
                      <code className={`latin-run ${styles.routeId}`}>
                        {route.id}
                      </code>
                      <strong className={styles.routeLabel}>{route.label}</strong>
                      <span
                        className={styles.routeState}
                        data-state={route.state}
                      >
                        {corridor.states[route.state].label}
                      </span>
                    </span>
                    <span className={styles.routeSummary}>{route.summary}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <p className={styles.principle}>{corridor.principle}</p>
      </div>
    </div>
  );
}
