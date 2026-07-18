"use client";

import { useId, useRef, useState } from "react";
import type { SiteContent } from "@/content/types";
import styles from "./ValueChains.module.css";

interface ValueChainsProps {
  chains: SiteContent["chains"];
  sectionLabel: string;
  number?: string;
}

/**
 * Accessible value-chain tabs: roving tabindex, arrow-key navigation
 * (direction-aware for RTL), progressive stage reveal per activation.
 */
export default function ValueChains({
  chains,
  sectionLabel,
  number = "07",
}: ValueChainsProps) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const onKeyDown = (event: React.KeyboardEvent) => {
    const count = chains.chains.length;
    const rtl = document.documentElement.dir === "rtl";
    let next: number | null = null;
    switch (event.key) {
      case "ArrowRight":
        next = (active + (rtl ? -1 : 1) + count) % count;
        break;
      case "ArrowLeft":
        next = (active + (rtl ? 1 : -1) + count) % count;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = count - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const chain = chains.chains[active]!;

  return (
    <section id="chains" className={styles.section}>
      <div className="container">
        <div className={styles.intro}>
          <p className={styles.eyebrow}>
            <span className={styles.number}>
              <span className="visually-hidden">{sectionLabel} </span>
              {number}
            </span>
            <span aria-hidden="true" className={styles.rule} />
            {chains.eyebrow}
          </p>
          <h2 className={styles.title}>{chains.title}</h2>
          <p className={styles.lead}>{chains.lead}</p>
        </div>

        <div className={styles.shell}>
          <div
            role="tablist"
            aria-label={chains.tabListLabel}
            className={styles.tabs}
            onKeyDown={onKeyDown}
          >
            {chains.chains.map((item, index) => (
              <button
                key={item.name}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-selected={index === active}
                aria-controls={`${baseId}-panel-${index}`}
                tabIndex={index === active ? 0 : -1}
                className={index === active ? styles.tabActive : styles.tab}
                onClick={() => setActive(index)}
              >
                <span className={styles.tabIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.name}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel-${active}`}
            aria-labelledby={`${baseId}-tab-${active}`}
            className={styles.panel}
          >
            <div className={styles.panelIntro}>
              <h3 className={styles.chainName}>{chain.name}</h3>
              <p className={styles.chainSummary}>{chain.summary}</p>
              <p className={styles.outcome}>
                <span className={styles.outcomeLabel}>{chains.outcomeLabel}</span>
                {chain.outcome}
              </p>
            </div>

            <ol
              className={styles.stages}
              aria-label={chains.stageFlowLabel}
              key={active}
            >
              {chain.stages.map((stage, index) => (
                <li
                  key={stage.title}
                  className={styles.stage}
                  style={{ "--stage-delay": `${index * 90}ms` } as React.CSSProperties}
                >
                  <span className={styles.stageIndex} aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className={styles.stageTitle}>{stage.title}</h4>
                    <p className={styles.stageText}>{stage.text}</p>
                  </div>
                  {index < chain.stages.length - 1 ? (
                    <span className={styles.stageLink} aria-hidden="true" />
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
