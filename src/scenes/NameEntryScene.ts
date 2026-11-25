import Phaser from "phaser";
import { GameSession } from "../state/GameSession";

export class NameEntryScene extends Phaser.Scene {
  private submitted = false;
  private nameInput?: HTMLInputElement;
  private domObject?: Phaser.GameObjects.DOMElement;

  constructor() {
    super("NameEntryScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#10151b");
    this.add.text(480, 156, "주인공의 이름", {
      fontFamily: "serif",
      fontSize: "34px",
      color: "#f1ead7",
    }).setOrigin(0.5);

    this.add.text(480, 212, "이름은 이 여정에서 당신을 부르는 방식이 됩니다.", {
      fontFamily: "sans-serif",
      fontSize: "17px",
      color: "#aab8ad",
    }).setOrigin(0.5);

    this.add.graphics()
      .lineStyle(2, 0xb6a77a, 1)
      .strokeRect(250, 258, 460, 72);

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 12;
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = "이름 입력";
    input.setAttribute("aria-label", "주인공 이름");
    input.className = "underfail-name-input";
    this.nameInput = input;
    this.domObject = this.add.dom(480, 294, input);
    input.focus();

    const submit = this.add.text(480, 370, "[ 이름 결정 ]", {
      fontFamily: "monospace",
      fontSize: "22px",
      color: "#e3c77f",
      padding: { x: 16, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    submit.on("pointerdown", () => this.submitName());
    input.addEventListener("keydown", this.handleInputKey);

    this.add.text(480, 424, "ENTER를 누르거나 이름 결정 항목을 선택하세요.", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#82918d",
    }).setOrigin(0.5);

    this.add.text(480, 460, "", {
      fontFamily: "sans-serif",
      fontSize: "15px",
      color: "#e59b85",
    }).setOrigin(0.5);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      input.removeEventListener("keydown", this.handleInputKey);
      this.domObject?.destroy();
      this.nameInput = undefined;
      this.domObject = undefined;
    });
  }

  private handleInputKey = (event: KeyboardEvent): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      this.submitName();
    }
  };

  private submitName(): void {
    if (this.submitted) return;
    const name = this.nameInput?.value.trim() ?? "";
    if (!name) {
      this.nameInput?.focus();
      return;
    }

    this.submitted = true;
    GameSession.startNew(name);
    this.scene.start("PrologueScene");
  }
}
