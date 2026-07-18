import { describe, expect, it } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import ValueChains from "@/components/sections/ValueChains";
import { en } from "@/content/en/site";

function setup() {
  return render(
    <ValueChains chains={en.chains} sectionLabel={en.ui.sectionLabel} />,
  );
}

describe("ValueChains tabs", () => {
  it("renders one tab per chain with correct ARIA wiring", () => {
    setup();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    expect(tabs[0]!.getAttribute("aria-selected")).toBe("true");
    const panel = screen.getByRole("tabpanel");
    expect(panel.getAttribute("aria-labelledby")).toBe(tabs[0]!.id);
  });

  it("activates a chain on click and shows its stages", () => {
    setup();
    const tabs = screen.getAllByRole("tab");
    fireEvent.click(tabs[2]!);
    expect(tabs[2]!.getAttribute("aria-selected")).toBe("true");
    expect(
      screen.getByRole("heading", { name: en.chains.chains[2]!.name }),
    ).toBeTruthy();
    expect(screen.getByText(en.chains.chains[2]!.stages[0]!.title)).toBeTruthy();
  });

  it("moves with arrow keys using roving tabindex", () => {
    setup();
    const tablist = screen.getByRole("tablist");
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    const tabs = screen.getAllByRole("tab");
    expect(tabs[1]!.getAttribute("aria-selected")).toBe("true");
    expect(tabs[1]!.getAttribute("tabindex")).toBe("0");
    expect(tabs[0]!.getAttribute("tabindex")).toBe("-1");
    fireEvent.keyDown(tablist, { key: "End" });
    expect(tabs[3]!.getAttribute("aria-selected")).toBe("true");
  });
});
