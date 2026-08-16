import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CharacterStage } from "./CharacterStage";

describe("CharacterStage", () => {
  it("renders five floor-aligned frames with exactly one visible and no legacy controls", () => {
    render(<CharacterStage />);

    expect(screen.getByRole("group", { name: "인터랙티브 캐릭터" })).toBeInTheDocument();
    expect(screen.getByTestId("character-stage")).toHaveAttribute("data-config", "main-character");
    const frames = [...document.querySelectorAll<HTMLImageElement>(".character-frame")];
    expect(frames).toHaveLength(5);
    expect(frames.map((frame) => frame.dataset.frame)).toEqual(["neutral", "inhale", "peak", "exhale", "settle"]);
    expect(frames.every((frame) => frame.dataset.floorY === "87.5")).toBe(true);
    expect(frames.filter((frame) => !frame.hidden)).toHaveLength(1);
    expect(frames[0]).not.toHaveAttribute("hidden");
    expect(document.querySelectorAll(".character-motion, [data-motion-layer]")).toHaveLength(0);
    expect(screen.queryByRole("group", { name: /캐릭터 화면 선택/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /장비 보드|캐릭터 A|캐릭터 B|장비 설명 모두 보기/ })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button").filter((button) => button.classList.contains("equipment-hotspot"))).toHaveLength(4);
    expect(["spear", "shield", "gloves", "shoes"].map((id) => document.querySelector(`[data-equipment="${id}"]`))).not.toContain(null);
  });

  it("opens, switches, and toggles equipment details", async () => {
    const user = userEvent.setup();
    render(<CharacterStage />);
    const gloves = screen.getByRole("button", { name: /장갑/ });
    const shoes = screen.getByRole("button", { name: /부츠/ });

    expect(gloves).toHaveAttribute("aria-expanded", "false");
    await user.click(gloves);
    expect(gloves).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "닳고닳은 파이썬 장갑" })).toHaveTextContent("Python");

    await user.click(shoes);
    expect(gloves).toHaveAttribute("aria-expanded", "false");
    expect(shoes).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "리눅스 여행 부츠" })).toHaveTextContent("Linux");

    await user.click(shoes);
    expect(shoes).toHaveAttribute("aria-expanded", "false");
  });

  it("supports keyboard selection and matching accessible relationships", async () => {
    const user = userEvent.setup();
    render(<CharacterStage />);
    const gloves = screen.getByRole("button", { name: /장갑/ });
    gloves.focus();
    await user.keyboard("{Enter}");

    expect(gloves).toHaveAttribute("aria-expanded", "true");
    expect(gloves).toHaveAttribute("aria-controls", "equipment-detail-gloves");
    expect(screen.getByRole("region", { name: "닳고닳은 파이썬 장갑" })).toHaveAttribute("id", "equipment-detail-gloves");
  });

  it("closes pinned details with Escape and restores trigger focus", async () => {
    const user = userEvent.setup();
    render(<CharacterStage />);
    const shoes = screen.getByRole("button", { name: /부츠/ });
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
    await user.click(screen.getByRole("button", { name: "닳고닳은 파이썬 장갑 설명 닫기" }));
    expect(gloves).toHaveAttribute("aria-expanded", "false");

    await user.click(gloves);
    await user.click(screen.getByRole("button", { name: "outside" }));
    expect(gloves).toHaveAttribute("aria-expanded", "false");
  });
});
