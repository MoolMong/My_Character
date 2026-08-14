import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CharacterStage } from "./CharacterStage";

describe("CharacterStage", () => {
  it("starts with both single and all explanations hidden", () => {
    render(<CharacterStage />);

    expect(screen.queryByRole("region", { name: /컨테이너 수호창/ })).not.toBeInTheDocument();
    expect(document.getElementById("all-equipment-explanations")).not.toBeVisible();
    expect(screen.getByRole("button", { name: "장비 설명 모두 보기" })).toHaveAttribute("aria-pressed", "false");
  });

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
    expect(screen.getByRole("region", { name: /구름 기사의 방패/ })).toHaveTextContent("AWS");

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

  it("shows all six cards, keeps hotspot selection, and hides the list again", async () => {
    const user = userEvent.setup();
    render(<CharacterStage />);
    const spear = screen.getByRole("button", { name: /컨테이너 수호창/ });
    await user.click(spear);

    const openAll = screen.getByRole("button", { name: "장비 설명 모두 보기" });
    await user.click(openAll);
    const panel = screen.getByRole("region", { name: "장비 설명" });
    expect(panel).toBeVisible();
    expect(panel.querySelectorAll("article")).toHaveLength(6);
    expect(spear).toHaveAttribute("aria-expanded", "true");

    const closeAll = screen.getByRole("button", { name: "설명 모두 닫기" });
    expect(closeAll).toHaveAttribute("aria-pressed", "true");
    await user.click(closeAll);
    expect(panel).not.toBeVisible();
    expect(spear).toHaveAttribute("aria-expanded", "true");
  });

  it("supports keyboard selection and exposes matching control relationships", async () => {
    const user = userEvent.setup();
    render(<CharacterStage />);
    const cloak = screen.getByRole("button", { name: /설계자의 망토/ });
    cloak.focus();
    await user.keyboard("{Enter}");

    expect(cloak).toHaveAttribute("aria-expanded", "true");
    expect(cloak).toHaveAttribute("aria-controls", "equipment-detail-architect-cloak");
    expect(screen.getByRole("region", { name: /설계자의 망토/ })).toHaveAttribute("id", "equipment-detail-architect-cloak");
  });

  it("uses a bounded, single-column all-explanations panel at mobile widths", async () => {
    const user = userEvent.setup();
    window.innerWidth = 390;
    render(<CharacterStage />);
    await user.click(screen.getByRole("button", { name: "장비 설명 모두 보기" }));

    const panel = screen.getByRole("region", { name: "장비 설명" });
    expect(panel).toHaveClass("equipment-list-panel");
    expect(panel.querySelector(".equipment-list")).toBeInTheDocument();
  });
});
