import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ReceptionDesk from "@/components/reception/ReceptionDesk";
import { enReception } from "@/content/en/reception";
import { enEcosystem } from "@/content/en/ecosystem";

let searchParams = new URLSearchParams("");

vi.mock("next/navigation", () => ({
  useSearchParams: () => searchParams,
}));

function setup(query = "") {
  searchParams = new URLSearchParams(query);
  return render(
    <ReceptionDesk
      locale="en"
      reception={enReception}
      ecosystem={enEcosystem}
    />,
  );
}

function fillBaseFields() {
  fireEvent.change(screen.getByLabelText(/Organization name/), {
    target: { value: "Atlas Industries" },
  });
  fireEvent.change(screen.getByLabelText(/Organization country/), {
    target: { value: "Morocco" },
  });
  fireEvent.change(screen.getByLabelText(/^Sector/), {
    target: { value: "Food processing" },
  });
  fireEvent.change(screen.getByLabelText(/Contact person/), {
    target: { value: "K. Alaoui" },
  });
  fireEvent.change(screen.getByLabelText(/Professional role/), {
    target: { value: "Export director" },
  });
  fireEvent.change(screen.getByLabelText(/Professional email/), {
    target: { value: "export@atlas.example" },
  });
  fireEvent.change(screen.getByLabelText(/Concise request summary/), {
    target: {
      value: "We would like a structured market-entry review for our company.",
    },
  });
  fireEvent.click(screen.getByLabelText(/Consent/));
}

describe("ReceptionDesk (P0 dynamic schemas)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("preselects request type and audience from the entry-path query", () => {
    setup("type=market-expansion&audience=moroccan-industry-exporters");
    const select = screen.getByLabelText(/Request type/) as HTMLSelectElement;
    expect(select.value).toBe("market-expansion");
    const audience = screen.getByLabelText(/Entry path/) as HTMLSelectElement;
    expect(audience.value).toBe("moroccan-industry-exporters");
  });

  it("falls back safely for unknown or disallowed preselection values", () => {
    setup("type=nonsense&audience=evil");
    const select = screen.getByLabelText(/Request type/) as HTMLSelectElement;
    expect(select.value).toBe("institutional-cooperation");

    setup("type=port-logistics-cooperation&audience=moroccan-institutions");
    const constrained = screen.getByLabelText(
      /Request type/,
    ) as HTMLSelectElement;
    expect(constrained.value).toBe("institutional-cooperation");
  });

  it("restricts the request-type options to the selected audience", () => {
    setup("audience=red-sea-ports-economic-zones");
    const select = screen.getByLabelText(/Request type/) as HTMLSelectElement;
    const values = Array.from(select.options).map((option) => option.value);
    expect(values).toEqual([
      "port-logistics-cooperation",
      "institutional-cooperation",
    ]);
  });

  it("renders schema-specific fields for the request type", () => {
    setup("type=market-expansion&audience=moroccan-industry-exporters");
    expect(screen.getByLabelText(/Target market/)).toBeTruthy();
    expect(screen.queryByLabelText(/Project or asset name/)).toBeNull();

    setup("type=submit-project-asset&audience=sudanese-producers-asset-owners");
    expect(screen.getByLabelText(/Project or asset name/)).toBeTruthy();
    expect(screen.getByLabelText(/Asset or product type/)).toBeTruthy();
    // Evidence is a checklist, never an upload control.
    expect(screen.getByText(/Evidence available/)).toBeTruthy();
    expect(document.querySelector('input[type="file"]')).toBeNull();
  });

  it("shows the expected review output and disclaimer for controlled types", () => {
    setup("type=project-investment-review&audience=moroccan-finance-investment");
    expect(
      screen.getAllByText(/Preliminary project-fit review/).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/does not constitute investment approval/).length,
    ).toBeGreaterThan(0);
  });

  it("blocks review until consent and required fields are provided", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Review the request/ }));
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.queryByText(enReception.review.title)).toBeNull();
  });

  it("shows a review state with the prepared mailto and no false success", () => {
    setup("type=market-expansion&audience=moroccan-industry-exporters");
    fillBaseFields();
    fireEvent.change(screen.getByLabelText(/Target market/), {
      target: { value: "Sudan" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Review the request/ }));

    expect(screen.getByText(enReception.review.title)).toBeTruthy();
    const openLink = screen.getByRole("link", {
      name: enReception.review.openEmailButton,
    }) as HTMLAnchorElement;
    expect(
      openLink.href.startsWith("mailto:akanil.consulting@proton.me"),
    ).toBe(true);
    expect(openLink.href).toContain(encodeURIComponent("Atlas Industries"));
    // Copy and download actions are present; no official case number.
    expect(
      screen.getByRole("button", {
        name: enReception.review.copySubjectButton,
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: enReception.review.downloadDraftButton,
      }),
    ).toBeTruthy();
    expect(document.body.textContent?.toLowerCase()).not.toContain(
      "submitted successfully",
    );
    expect(document.body.textContent).not.toMatch(/case number/i);
  });

  it("explains after opening that sending happens in the visitor's email service", () => {
    setup("type=market-expansion&audience=moroccan-industry-exporters");
    fillBaseFields();
    fireEvent.change(screen.getByLabelText(/Target market/), {
      target: { value: "Sudan" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Review the request/ }));
    const openLink = screen.getByRole("link", {
      name: enReception.review.openEmailButton,
    });
    fireEvent.click(openLink);
    expect(screen.getByRole("status").textContent).toContain(
      enReception.afterOpen.notSentWarning,
    );
    expect(document.body.textContent?.toLowerCase()).not.toContain(
      "submitted successfully",
    );
  });

  it("announces copy actions through a live region", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    setup("type=market-expansion&audience=moroccan-industry-exporters");
    fillBaseFields();
    fireEvent.change(screen.getByLabelText(/Target market/), {
      target: { value: "Sudan" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Review the request/ }));
    fireEvent.click(
      screen.getByRole("button", { name: enReception.review.copySubjectButton }),
    );
    expect(writeText).toHaveBeenCalledOnce();
    expect(
      await screen.findByText(enReception.review.copiedAnnouncement),
    ).toBeTruthy();
  });

  it("never touches browser storage", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    setup("type=forum-qualification&audience=moroccan-institutions");
    fillBaseFields();
    fireEvent.click(screen.getByRole("button", { name: /Review the request/ }));
    expect(setItem).not.toHaveBeenCalled();
    expect(document.cookie).toBe("");
  });
});
