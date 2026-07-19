"use client";

import { useId, useState } from "react";
import type {
  EcosystemContent,
  EcosystemNodeId,
  NodeKind,
} from "@/content/ecosystem-types";
import { NODE_VIEWBOX, nodeGeometry } from "@/lib/ecosystem";
import PublicStatusControl from "@/components/ui/PublicStatusControl";
import styles from "./RedSeaNodeMap.module.css";

interface RedSeaNodeMapProps {
  nodes: EcosystemContent["nodes"];
  states: EcosystemContent["states"];
  statusLabel: string;
  evidenceLabel: string;
  platformNames: Record<string, string>;
}

/** Marker shape per node kind — kind is never conveyed by color alone. */
function NodeMarker({
  kind,
  x,
  y,
  active,
}: {
  kind: NodeKind;
  x: number;
  y: number;
  active: boolean;
}) {
  const fill = active ? "var(--color-gold)" : "var(--color-ivory)";
  const common = {
    fill,
    stroke: "var(--color-midnight)",
    strokeWidth: 2,
  } as const;
  switch (kind) {
    case "port":
      return <circle cx={x} cy={y} r={9} {...common} />;
    case "economic-zone":
      return <rect x={x - 8} y={y - 8} width={16} height={16} {...common} />;
    case "industrial-node":
      return (
        <rect
          x={x - 8}
          y={y - 8}
          width={16}
          height={16}
          transform={`rotate(45 ${x} ${y})`}
          {...common}
        />
      );
    case "production-region":
      return (
        <polygon
          points={`${x},${y - 10} ${x + 9},${y + 7} ${x - 9},${y + 7}`}
          {...common}
        />
      );
    case "logistics-node":
      return (
        <polygon
          points={`${x},${y + 10} ${x + 9},${y - 7} ${x - 9},${y - 7}`}
          {...common}
        />
      );
    case "market-access-node":
      return (
        <circle
          cx={x}
          cy={y}
          r={8}
          fill="none"
          stroke={active ? "var(--color-gold)" : "var(--color-ivory)"}
          strokeWidth={3}
        />
      );
    case "financial-node":
      return (
        <g>
          <circle cx={x} cy={y} r={9} {...common} />
          <circle cx={x} cy={y} r={3.5} fill="var(--color-midnight)" />
        </g>
      );
  }
}

/**
 * 08 — Red Sea nodes and trade-chain architecture (P0 §5, ADR-017).
 * A schematic ecosystem-architecture diagram, not a legal or technical
 * route map: no route lines are drawn as verified, no travel times,
 * volumes or capacities appear. HTML node buttons (grouped by kind)
 * drive the SVG and a textual summary; the diagram itself stays
 * decorative and LTR-locked while all information is available as text.
 */
export default function RedSeaNodeMap({
  nodes,
  states,
  statusLabel,
  evidenceLabel,
  platformNames,
}: RedSeaNodeMapProps) {
  const [selected, setSelected] = useState<EcosystemNodeId>("port-sudan");
  const summaryId = useId();

  const selectedNode = nodes.items.find((node) => node.id === selected);
  const kinds = Object.keys(nodes.kindLabels) as NodeKind[];

  return (
    <div className={styles.wrapper}>
      <div className={styles.mapColumn}>
        {/* Schematic diagram — presentation only; geography stays LTR. */}
        <div className={styles.mapFrame} dir="ltr" aria-hidden="true">
          <svg
            className={styles.svg}
            viewBox={`0 0 ${NODE_VIEWBOX.width} ${NODE_VIEWBOX.height}`}
            role="img"
            focusable="false"
          >
            <defs>
              <radialGradient id="redsea-water" cx="0.68" cy="0.5" r="0.6">
                <stop offset="0%" stopColor="rgba(49,123,131,0.32)" />
                <stop offset="100%" stopColor="rgba(49,123,131,0)" />
              </radialGradient>
            </defs>
            <rect
              width={NODE_VIEWBOX.width}
              height={NODE_VIEWBOX.height}
              fill="url(#redsea-water)"
            />
            {nodes.items.map((node) => {
              const geometry = nodeGeometry[node.id];
              const active = node.id === selected;
              return (
                <g key={node.id}>
                  {active ? (
                    <circle
                      cx={geometry.x}
                      cy={geometry.y}
                      r={20}
                      fill="none"
                      stroke="var(--color-gold)"
                      strokeOpacity={0.4}
                      className={styles.pulse}
                    />
                  ) : null}
                  <NodeMarker
                    kind={geometry.kind}
                    x={geometry.x}
                    y={geometry.y}
                    active={active}
                  />
                  <text
                    x={geometry.x}
                    y={geometry.y + 26}
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

        <p className={styles.mapLabel}>{nodes.mapLabel}</p>
        <p className={styles.disclaimer}>{nodes.disclaimer}</p>

        <ul className={styles.legend}>
          {kinds.map((kind) => (
            <li key={kind} className={styles.legendItem}>
              <svg
                viewBox="0 0 28 28"
                className={styles.legendSwatch}
                aria-hidden="true"
                focusable="false"
              >
                <NodeMarker kind={kind} x={14} y={14} active={false} />
              </svg>
              <span>{nodes.kindLabels[kind]}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.panel}>
        <h3 className={styles.panelTitle}>{nodes.listTitle}</h3>
        <p className={styles.prompt}>{nodes.selectPrompt}</p>
        <ul className={styles.nodeList} role="list">
          {nodes.items.map((node) => (
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
                <span className={styles.nodeMeta}>
                  {node.country} · {nodes.kindLabels[node.kind]}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div
          id={summaryId}
          className={styles.summary}
          role="region"
          aria-live="polite"
          aria-label={nodes.listTitle}
        >
          {selectedNode ? (
            <>
              <h4 className={styles.summaryName}>
                {selectedNode.name}
                <span className={styles.summaryRole}>
                  {" "}
                  — {selectedNode.role}
                </span>
              </h4>
              <p className={styles.summaryText}>{selectedNode.publicSummary}</p>
              {selectedNode.platformIds.length > 0 ? (
                <p className={styles.summaryPlatforms}>
                  {selectedNode.platformIds
                    .map((id) => platformNames[id])
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              ) : null}
              <PublicStatusControl
                onDark
                entries={[
                  {
                    term: statusLabel,
                    value: states.publicStatus[selectedNode.publicStatus],
                    tone: "status",
                  },
                  {
                    term: evidenceLabel,
                    value: states.evidenceState[selectedNode.evidenceState],
                    tone: "evidence",
                  },
                ]}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
