import Phaser from "phaser";
import { Atmosphere } from "../audio/Atmosphere";
import { GameSession } from "../state/GameSession";

export class NameEntryScene extends Phaser.Scene {
  private submitted = false;
  private nameInput?: HTMLInputElement;
  private domObject?: Phaser.GameObjects.DOMElement;
  private errorText?: Phaser.GameObjects.Text;

  constructor() {
    super("NameEntryScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#101c25");
    this.add.image(480, 270, "title-art").setDisplaySize(960, 540).setAlpha(0.22);
    this.add.rectangle(480, 270, 960, 540, 0x08131c, 0.62);

    this.add.text(480, 124, "이름을 적어 주세요", {
      fontFamily: "'Noto Serif KR', serif",
      fontSize: "34px",
      color: "#f1e5c9",
    }).setOrigin(0.5);

    this.add.text(480, 177, "이 이야기에서 당신을 부를 이름입니다.", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "16px",
      color: "#bdc7b8",
    }).setOrigin(0.5);

    this.add.rectangle(480, 274, 492, 88, 0x101d25, 0.9)
      .setStrokeStyle(2, 0xb7a47b, 0.9);
    this.add.rectangle(480, 274, 474, 70, 0x1a2b30, 0.95)
      .setStrokeStyle(1, 0x67796c, 0.85);

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 12;
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = "이름 입력";
    input.setAttribute("aria-label", "주인공 이름");
    input.className = "underfail-name-input";
    this.nameInput = input;
    this.domObject = this.add.dom(480, 274, input);
    input.focus();

    const submit = this.add.text(480, 369, "이 이름으로 시작", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "18px",
      color: "#f0dfb8",
      backgroundColor: "#2b4847",
      padding: { x: 22, y: 11 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    submit.on("pointerdown", () => this.submitName());
    input.addEventListener("keydown", this.handleInputKey);
    input.addEventListener("input", this.handleInputEdit);

    this.add.text(480, 436, "ENTER로 확정할 수 있습니다.", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#91a398",
    }).setOrigin(0.5);

    this.errorText = this.add.text(480, 470, "", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "14px",
      color: "#e6b7a2",
    }).setOrigin(0.5);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      input.removeEventListener("keydown", this.handleInputKey);
      input.removeEventListener("input", this.handleInputEdit);
      this.domObject?.destroy();
      this.nameInput = undefined;
      this.domObject = undefined;
    });
  }

  private handleInputEdit = (): void => {
    this.errorText?.setText("");
  };

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
      this.errorText?.setText("이름을 입력해 주세요.");
      this.nameInput?.focus();
      return;
    }

    this.submitted = true;
    Atmosphere.cue("paper");
    GameSession.startNew(name);
    this.scene.start("PrologueScene");
  }
}
