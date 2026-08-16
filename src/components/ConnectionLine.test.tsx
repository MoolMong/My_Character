import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConnectionLine } from "./ConnectionLine";

describe("ConnectionLine", () => {
  it("uses a subtle two-unit marker and preserves the requested endpoint", () => {
    const { container } = render(<ConnectionLine start={{ x: 14, y: 32 }} end={{ x: 0, y: 32 }} />);
    const marker = container.querySelector(".anchor-dot");
    const line = container.querySelector(".connection-line.connection-side");

    expect(marker).toHaveAttribute("x", "13");
    expect(marker).toHaveAttribute("y", "31");
    expect(marker).toHaveAttribute("width", "2");
    expect(marker).toHaveAttribute("height", "2");
    expect(line).toHaveAttribute("points", expect.stringMatching(/0,32$/));
  });
});
