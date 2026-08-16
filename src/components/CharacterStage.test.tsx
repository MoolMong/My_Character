import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CharacterStage } from "./CharacterStage";

describe("CharacterStage", () => {
  it("initially renders only one tight character frame and no interaction artwork", () => {
    render(<CharacterStage />);
    expect(screen.getByTestId("character-stage")).toHaveAttribute("data-config", "main-character");
    expect(document.querySelectorAll(".character-frame")).toHaveLength(4);
    expect(document.querySelectorAll(".character-frame[aria-hidden=false]")).toHaveLength(1);
    expect(document.querySelector(".character-board")).not.toBeInTheDocument();
    expect(document.querySelector(".equipment-outline")).not.toBeInTheDocument();
    expect(document.querySelector(".connection-layer")).not.toBeInTheDocument();
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".equipment-hotspot")).toHaveLength(6);
  });

  it.each([
    ["spear", "컨테이너 수호창", "Kubernetes"],
    ["armor", "프라이빗 철갑", "OpenStack"],
    ["shield", "구름 기사의 방패", "AWS"],
    ["gloves", "닳고닳은 파이썬 장갑", "Python"],
    ["cape", "설계자의 망토", "Terraform"],
    ["shoes", "리눅스 여행 부츠", "Linux"],
  ])("reveals silhouette, connector and bubble for %s", async (id, title, technology) => {
    const user = userEvent.setup();
    render(<CharacterStage />);
    const trigger = document.querySelector<HTMLButtonElement>(`[data-equipment="${id}"]`)!;
    await user.click(trigger);
    expect(document.querySelector(`[data-outline="${id}"]`)).toBeInTheDocument();
    expect(document.querySelector(".connection-layer")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: title })).toHaveTextContent(technology);
    expect(document.querySelector(".equipment-detail-slot")).toHaveAttribute("data-bubble-tail", id === "spear" || id === "gloves" || id === "shoes" ? "left" : "right");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("routes the portrait connector outside the character before reaching the bubble", async () => {
    const user = userEvent.setup();
    render(<CharacterStage />);
    await user.click(screen.getByRole("button", { name: /장갑/ }));
    expect(document.querySelector(".connection-portrait.connection-line")).toHaveAttribute(
      "points",
      "29,48 0,48 0,100 50,100",
    );
  });

  it("previews on hover and keeps click pinning semantics", async () => {
    const user = userEvent.setup();
    render(<CharacterStage />);
    const gloves = screen.getByRole("button", { name: /장갑/ });
    fireEvent.pointerEnter(gloves);
    expect(screen.getByRole("region", { name: /장갑/ })).toBeInTheDocument();
    fireEvent.pointerLeave(gloves);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    await user.click(gloves);
    fireEvent.pointerLeave(gloves);
    expect(screen.getByRole("region", { name: /장갑/ })).toBeInTheDocument();
  });

  it("supports Escape, close, outside-close, and focus restoration", async () => {
    const user = userEvent.setup();
    render(<><CharacterStage /><button>outside</button></>);
    const shoes = screen.getByRole("button", { name: /부츠/ });
    await user.click(shoes);
    await user.keyboard("{Escape}");
    expect(shoes).toHaveFocus();
    await user.click(shoes);
    await user.click(screen.getByRole("button", { name: /설명 닫기/ }));
    expect(shoes).toHaveFocus();
    await user.click(shoes);
    await user.click(screen.getByRole("button", { name: "outside" }));
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});
