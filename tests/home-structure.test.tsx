import { beforeAll, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import {
  ValueSummary,
  JourneySummary,
  ChainsCorridorSummary,
  ForumSummary,
  TrustAboutSummary,
  ReceptionCta,
} from "@/components/sections/home/HomeSummaries";
import GatewayStatus from "@/components/sections/home/GatewayStatus";
import AudienceEntry from "@/components/sections/home/AudienceEntry";
import { en } from "@/content/en/site";
import { enExperience } from "@/content/en/experience";
import { enReception } from "@/content/en/reception";

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

function renderHomeSections() {
  return render(
    <>
      <GatewayStatus status={enExperience.status} />
      <AudienceEntry
        locale="en"
        audiences={enExperience.audiences}
        sectionLabel={en.ui.sectionLabel}
        requestTypeLabels={enReception.requestTypes}
      />
      <ValueSummary locale="en" experience={enExperience} site={en} />
      <JourneySummary locale="en" experience={enExperience} site={en} />
      <ChainsCorridorSummary locale="en" experience={enExperience} site={en} />
      <ForumSummary locale="en" experience={enExperience} site={en} />
      <TrustAboutSummary locale="en" experience={enExperience} site={en} />
      <ReceptionCta locale="en" experience={enExperience} />
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

  it("routes every audience card to reception with preselection", () => {
    const { container } = renderHomeSections();
    for (const path of enExperience.audiences.paths) {
      const link = container.querySelector(
        `a[href="/en/reception?type=${path.defaultRequestType}&audience=${path.id}"]`,
      );
      expect(link, `missing entry link for ${path.id}`).toBeTruthy();
    }
  });

  it("shows textual status labels, never percentages or bare colors", () => {
    const { container } = renderHomeSections();
    const status = container.querySelector("#status");
    expect(status?.textContent).toContain("Human-reviewed");
    expect(status?.textContent).not.toMatch(/\d+\s*%/);
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
