import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CharacterStage } from "./CharacterStage";

describe("CharacterStage", () => {
  it("opens, switches, and toggles equipment details with native buttons", async () => {
    const user = userEvent.setup();
    render(<CharacterStage />);
    const spear = screen.getByRole("button", { name: /컨테이너 수호창/ });
    const shield = screen.getByRole("button", { name: /구름 기사의 방패/ });

    expect(spear).toHaveAttribute("aria-expanded", "false");
    await user.click(spear);
    expect(spear).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: /컨테이너 수호창/ })).toBeVisible();

    await user.click(shield);
    expect(spear).toHaveAttribute("aria-expanded", "false");
    expect(shield).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("AWS")).toBeVisible();

    await user.click(shield);
    expect(shield).toHaveAttribute("aria-expanded", "false");
  });

  it("closes pinned details with Escape and restores trigger focus", async () => {
    const user = userEvent.setup();
    render(<CharacterStage />);
    const boots = screen.getByRole("button", { name: /리눅스 여행 부츠/ });
    await user.click(boots);
    await user.keyboard("{Escape}");
    expect(boots).toHaveFocus();
    expect(boots).toHaveAttribute("aria-expanded", "false");
  });

  it("closes pinned details on an outside pointer action", async () => {
    const user = userEvent.setup();
    render(<><CharacterStage /><button>outside</button></>);
    const armor = screen.getByRole("button", { name: /프라이빗 철갑/ });
    await user.click(armor);
    await user.click(screen.getByRole("button", { name: "outside" }));
    expect(armor).toHaveAttribute("aria-expanded", "false");
  });
});
