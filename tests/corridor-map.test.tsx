import { describe, expect, it } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import CorridorMap from "@/components/maps/CorridorMap";
import { en } from "@/content/en/site";

describe("CorridorMap node selection", () => {
  it("starts on Morocco and shows its text summary outside the SVG", () => {
    render(<CorridorMap corridor={en.corridor} />);
    const region = screen.getByRole("region", {
      name: en.corridor.summaryTitle,
    });
    expect(region.textContent).toContain(en.corridor.nodes[0]!.description);
  });

  it("updates summary and pressed state when another node is selected", () => {
    render(<CorridorMap corridor={en.corridor} />);
    const sudanButton = screen.getByRole("button", { name: /Sudan\b.*/ });
    fireEvent.click(sudanButton);
    expect(sudanButton.getAttribute("aria-pressed")).toBe("true");
    const region = screen.getByRole("region", {
      name: en.corridor.summaryTitle,
    });
    const sudanNode = en.corridor.nodes.find((n) => n.id === "sudan")!;
    expect(region.textContent).toContain(sudanNode.description);
    expect(region.textContent).toContain("CR-01");
  });

  it("labels each listed route with its state", () => {
    render(<CorridorMap corridor={en.corridor} />);
    const region = screen.getByRole("region", {
      name: en.corridor.summaryTitle,
    });
    expect(region.textContent).toContain(
      en.corridor.states.conceptual.label,
    );
    expect(region.textContent).toContain(
      en.corridor.states.alternative.label,
    );
  });
});
