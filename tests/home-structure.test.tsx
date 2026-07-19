import { beforeAll, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import {
  ValueSummary,
  ForumSummary,
  TrustAboutSummary,
  ReceptionCta,
} from "@/components/sections/home/HomeSummaries";
import GatewayStatus from "@/components/sections/home/GatewayStatus";
import AudienceEntryMatrix from "@/components/sections/home/AudienceEntryMatrix";
import EcosystemValueFlow from "@/components/sections/home/EcosystemValueFlow";
import WhyRedSea from "@/components/sections/home/WhyRedSea";
import PortfolioSection from "@/components/sections/home/PortfolioSection";
import NodesSection from "@/components/sections/home/NodesSection";
import TechnologyOperatingLayer from "@/components/sections/home/TechnologyOperatingLayer";
import SpecialistReviewProcess from "@/components/sections/home/SpecialistReviewProcess";
import type { PlatformId } from "@/content/ecosystem-types";
import { en } from "@/content/en/site";
import { enExperience } from "@/content/en/experience";
import { enReception } from "@/content/en/reception";
import { enEcosystem } from "@/content/en/ecosystem";

beforeAll(() => {
  // jsdom lacks IntersectionObserver used by the Reveal primitive.
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }));
});

const platformNames = Object.fromEntries(
  enEcosystem.platforms.items.map((p) => [p.id, p.name]),
) as Record<PlatformId, string>;

function renderHomeSections() {
  return render(
    <>
      <WhyRedSea
        locale="en"
        content={enEcosystem.whyRedSea}
        sectionLabel={en.ui.sectionLabel}
      />
      <EcosystemValueFlow
        content={enEcosystem.valueFlow}
        sectionLabel={en.ui.sectionLabel}
      />
      <AudienceEntryMatrix
        locale="en"
        audiences={enEcosystem.audiences}
        platformNames={platformNames}
        requestTypes={enReception.requestTypes}
        sectionLabel={en.ui.sectionLabel}
      />
      <PortfolioSection
        locale="en"
        ecosystem={enEcosystem}
        sectionLabel={en.ui.sectionLabel}
      />
      <ValueSummary locale="en" experience={enExperience} site={en} />
      <NodesSection ecosystem={enEcosystem} sectionLabel={en.ui.sectionLabel} />
      <TechnologyOperatingLayer
        technology={enEcosystem.technology}
        states={enEcosystem.states}
        sectionLabel={en.ui.sectionLabel}
      />
      <ForumSummary locale="en" experience={enExperience} site={en} />
      <SpecialistReviewProcess
        review={enEcosystem.review}
        sectionLabel={en.ui.sectionLabel}
      />
      <ReceptionCta locale="en" experience={enExperience} />
      <GatewayStatus status={enExperience.status} claims={enEcosystem.claims} />
      <TrustAboutSummary locale="en" experience={enExperience} site={en} />
    </>,
  );
}

describe("homepage structure", () => {
  it("preserves every legacy anchor target", () => {
    const { container } = renderHomeSections();
    for (const id of [
      "status",
      "entry",
      "why",
      "morocco",
      "sudan",
      "operating",
      "corridor",
      "chains",
      "forum",
      "trust",
      "about",
      "contact",
    ]) {
      expect(
        container.querySelector(`#${id}`),
        `missing legacy anchor #${id}`,
      ).toBeTruthy();
    }
  });

  it("renders all seven audience entry paths with reception preselection", () => {
    const { container } = renderHomeSections();
    for (const path of enEcosystem.audiences.paths) {
      const link = container.querySelector(
        `a[href="/en/reception?type=${path.defaultRequestType}&audience=${path.id}"]`,
      );
      expect(link, `missing entry link for ${path.id}`).toBeTruthy();
    }
    expect(enEcosystem.audiences.paths).toHaveLength(7);
  });

  it("shows Why the Red Sea before the status matrix", () => {
    const { container } = renderHomeSections();
    const why = container.querySelector("#why-red-sea");
    const status = container.querySelector("#status");
    expect(why).toBeTruthy();
    expect(status).toBeTruthy();
    expect(
      why!.compareDocumentPosition(status!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("renders the four platform cards with textual states", () => {
    const { container } = renderHomeSections();
    const platforms = container.querySelectorAll("[data-platform]");
    expect(platforms).toHaveLength(4);
    const ibriz = container.querySelector('[data-platform="ibriz-gaas"]');
    expect(ibriz?.textContent).toContain(
      enEcosystem.platforms.items.find((p) => p.id === "ibriz-gaas")!
        .regulatoryNote!.slice(0, 40),
    );
  });

  it("shows textual status labels, never percentages or bare colors", () => {
    const { container } = renderHomeSections();
    const status = container.querySelector("#status");
    expect(status?.textContent).toContain("Human-reviewed");
    expect(status?.textContent).not.toMatch(/\d+\s*%/);
  });

  it("labels every technology capability with its state", () => {
    const { container } = renderHomeSections();
    const states = container.querySelectorAll("[data-state]");
    expect(states.length).toBeGreaterThanOrEqual(
      enEcosystem.technology.capabilities.length,
    );
  });

  it("links the direct channels in the reception call", () => {
    const { container } = renderHomeSections();
    expect(
      container.querySelector('a[href="mailto:akanil.consulting@proton.me"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('a[href="tel:+212663177864"]'),
    ).toBeTruthy();
  });
});
