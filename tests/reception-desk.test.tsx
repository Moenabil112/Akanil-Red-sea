import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ReceptionDesk from "@/components/reception/ReceptionDesk";
import { en } from "@/content/en/site";
import { enExperience } from "@/content/en/experience";
import { enReception } from "@/content/en/reception";

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
      experience={enExperience}
      site={en}
    />,
  );
}

function fillValidForm() {
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
      value: "We would like to begin the qualification path for our company.",
    },
  });
  fireEvent.click(screen.getByLabelText(/Consent/));
}

describe("ReceptionDesk", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("preselects request type and audience from the entry-path query", () => {
    setup("type=qualification&audience=moroccan-company");
    const select = screen.getByLabelText(/Request type/) as HTMLSelectElement;
    expect(select.value).toBe("qualification");
    expect(screen.getByText(/Moroccan company/).textContent).toContain(
      "Moroccan company",
    );
  });

  it("ignores unknown preselection values", () => {
    setup("type=nonsense&audience=evil");
    const select = screen.getByLabelText(/Request type/) as HTMLSelectElement;
    expect(select.value).toBe("briefing");
  });

  it("blocks review until consent and required fields are provided", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Review the request/ }));
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.queryByText(enReception.review.title)).toBeNull();
  });

  it("shows a review state with the prepared mailto and no false success", () => {
    setup("type=qualification");
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /Review the request/ }));

    expect(screen.getByText(enReception.review.title)).toBeTruthy();
    const openLink = screen.getByRole("link", {
      name: enReception.review.openEmailButton,
    }) as HTMLAnchorElement;
    expect(
      openLink.href.startsWith("mailto:akanil.consulting@proton.me"),
    ).toBe(true);
    expect(openLink.href).toContain(
      encodeURIComponent("Atlas Industries"),
    );
    // No submitted/success claim anywhere in the review state.
    expect(document.body.textContent?.toLowerCase()).not.toContain(
      "submitted successfully",
    );
  });

  it("explains after opening that sending happens in the visitor's email service", () => {
    setup();
    fillValidForm();
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

  it("never touches browser storage", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    setup("type=meeting&audience=financial-partner");
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /Review the request/ }));
    expect(setItem).not.toHaveBeenCalled();
    expect(document.cookie).toBe("");
  });
});
