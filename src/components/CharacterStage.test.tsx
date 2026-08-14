import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CharacterStage } from "./CharacterStage";

describe("CharacterStage", () => {
  it("renders one character experience with base and rare blink frames and no legacy controls", () => {
    render(<CharacterStage />);

    expect(screen.getByRole("group", { name: "인터랙티브 캐릭터" })).toBeInTheDocument();
    expect(screen.getByTestId("character-stage")).toHaveAttribute("data-config", "main-character");
    expect(document.querySelectorAll(".character-frame")).toHaveLength(3);
    expect(document.querySelector('[data-frame="idle"]')).toHaveAttribute("data-floor-y", "87.5");
    expect(document.querySelector('[data-frame="idle"]')).toHaveStyle({ "--floor-offset": "0%" });
    expect(document.querySelector('[data-frame="breathe"]')).toHaveStyle({ "--floor-offset": "0.065%" });
    expect(document.querySelector('[data-frame="blink"]')).toHaveStyle({ "--floor-offset": "0.195%" });
    expect(screen.queryByRole("group", { name: /캐릭터 화면 선택/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /장비 보드|캐릭터 A|캐릭터 B|장비 설명 모두 보기/ })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button").filter((button) => button.classList.contains("equipment-hotspot"))).toHaveLength(4);
  });

  it("opens, switches, and toggles all four equipment placeholder details", async () => {
    const user = userEvent.setup();
    render(<CharacterStage />);
    const gloves = screen.getByRole("button", { name: /장갑/ });
    const shoes = screen.getByRole("button", { name: /신발/ });
    const spear = screen.getByRole("button", { name: /창/ });
    const shield = screen.getByRole("button", { name: /방패/ });

    expect([spear, shield, gloves, shoes]).toHaveLength(4);

    expect(gloves).toHaveAttribute("aria-expanded", "false");
    await user.click(gloves);
    expect(gloves).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "장갑" })).toHaveTextContent("설명 준비 중 — 이 문구를 교체하세요.");

    await user.click(shoes);
    expect(gloves).toHaveAttribute("aria-expanded", "false");
    expect(shoes).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "신발" })).toHaveTextContent("편집 가능한 임시 문구");

    await user.click(spear);
    expect(screen.getByRole("region", { name: "창" })).toHaveTextContent("설명 준비 중 — 이 문구를 교체하세요.");

    await user.click(shield);
    expect(screen.getByRole("region", { name: "방패" })).toHaveTextContent("편집 가능한 임시 문구");

    await user.click(shield);
    expect(shield).toHaveAttribute("aria-expanded", "false");
  });

  it("supports keyboard selection and matching accessible relationships", async () => {
    const user = userEvent.setup();
    render(<CharacterStage />);
    const gloves = screen.getByRole("button", { name: /장갑/ });
    gloves.focus();
    await user.keyboard("{Enter}");

    expect(gloves).toHaveAttribute("aria-expanded", "true");
    expect(gloves).toHaveAttribute("aria-controls", "equipment-detail-gloves");
    expect(screen.getByRole("region", { name: "장갑" })).toHaveAttribute("id", "equipment-detail-gloves");
  });

  it("closes pinned details with Escape and restores trigger focus", async () => {
    const user = userEvent.setup();
    render(<CharacterStage />);
    const shoes = screen.getByRole("button", { name: /신발/ });
    await user.click(shoes);
    await user.keyboard("{Escape}");
    expect(shoes).toHaveFocus();
    expect(shoes).toHaveAttribute("aria-expanded", "false");
  });

  it("closes with its close button and on an outside pointer action", async () => {
    const user = userEvent.setup();
    render(<><CharacterStage /><button>outside</button></>);
    const gloves = screen.getByRole("button", { name: /장갑/ });

    await user.click(gloves);
    await user.click(screen.getByRole("button", { name: "장갑 설명 닫기" }));
    expect(gloves).toHaveAttribute("aria-expanded", "false");

    await user.click(gloves);
    await user.click(screen.getByRole("button", { name: "outside" }));
    expect(gloves).toHaveAttribute("aria-expanded", "false");
  });
});
