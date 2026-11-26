import Phaser from "phaser";
import { GameInput } from "../input/GameInput";
import { Atmosphere } from "../audio/Atmosphere";

export class TitleScene extends Phaser.Scene {
  private controls!: GameInput;
  private launch?: () => void;

  constructor() {
    super("TitleScene");
  }

  create(): void {
    this.controls = new GameInput(this);
    const { width, height } = this.scale;
    const backdrop = this.add.image(width / 2, height / 2, "title-art").setDisplaySize(width, height);
    backdrop.setAlpha(0.96);

    this.add.rectangle(width / 2, 270, width, height, 0x07131b, 0.15);
    this.add.text(width / 2, 151, "A STORY ABOUT CHOOSING YOUR OWN WAY", {
      fontFamily: "Georgia, serif",
      fontSize: "13px",
      color: "#d5c7a5",
      letterSpacing: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, 231, "UNDERFAIL", {
      fontFamily: "Georgia, serif",
      fontSize: "70px",
      color: "#f1e5c9",
      fontStyle: "bold",
      letterSpacing: 8,
      shadow: { offsetX: 0, offsetY: 4, color: "#0a1115", blur: 16, fill: true },
    }).setOrigin(0.5);

    this.add.text(width / 2, 288, "언더페일", {
      fontFamily: "'Noto Serif KR', serif",
      fontSize: "27px",
      color: "#e0c99a",
      letterSpacing: 10,
    }).setOrigin(0.5);

    const rule = this.add.rectangle(width / 2, 347, 265, 1, 0xc5b184, 0.72).setDepth(4);
    const startPlate = this.add.rectangle(width / 2, 390, 430, 58, 0x12262d, 0.92)
      .setStrokeStyle(2, 0xc5b184, 0.86)
      .setDepth(5)
      .setInteractive({ useHandCursor: true });
    const startMarker = this.add.text(width / 2 - 184, 390, "›", {
      fontFamily: "Georgia, serif",
      fontSize: "32px",
      color: "#e2c98e",
    }).setOrigin(0.5).setDepth(6);
    const startLabel = this.add.text(width / 2 + 8, 390, "새로운 이야기를 시작한다", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "18px",
      color: "#f0dfb8",
      padding: { x: 12, y: 8 },
    }).setOrigin(0.5).setDepth(6).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: [startLabel, startPlate, startMarker, rule],
      alpha: { from: 0.76, to: 1 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });

    this.add.text(width / 2, 454, "Z  ·  ENTER  ·  SPACE  ·  CLICK", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#c1b89f",
      letterSpacing: 2,
    }).setOrigin(0.5);

    this.add.text(width / 2, 497, "모든 길은 선택에서 시작된다", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "12px",
      color: "#a1a999",
      letterSpacing: 1,
    }).setOrigin(0.5);

    let started = false;
    const start = (): void => {
      if (started) return;
      started = true;
      Atmosphere.unlock();
      Atmosphere.setMood("memory");
      Atmosphere.cue("confirm");
      this.cameras.main.fadeOut(300, 5, 10, 14);
      this.time.delayedCall(320, () => this.scene.start("NameEntryScene"));
    };

    this.launch = start;
    startPlate.on("pointerdown", start);
    startLabel.on("pointerdown", start);
    startMarker.setInteractive({ useHandCursor: true }).on("pointerdown", start);
  }

  update(): void {
    if (this.controls.justPressed("CONFIRM")) this.launch?.();
  }
}
