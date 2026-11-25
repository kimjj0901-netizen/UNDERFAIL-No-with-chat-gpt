import Phaser from "phaser";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#10151b");

    const art = this.add.graphics();
    art.fillStyle(0x18232b, 1).fillRect(0, 0, width, height);
    art.fillStyle(0x263943, 1).fillRect(0, 0, width, 8);
    art.lineStyle(1, 0xb6a77a, 0.7).strokeRect(112, 86, 736, 370);

    for (let i = 0; i < 28; i += 1) {
      const x = 140 + ((i * 137) % 680);
      const y = 105 + ((i * 71) % 330);
      this.add.circle(x, y, i % 3 === 0 ? 2 : 1, 0xc2b58b, 0.35);
    }

    this.add.text(width / 2, 154, "PUNG HWA YANG SANG HIGH SCHOOL", {
      fontFamily: "Georgia, serif",
      fontSize: "15px",
      color: "#9bada8",
      letterSpacing: 3,
    }).setOrigin(0.5);

    this.add.text(width / 2, 238, "UNDERFAIL", {
      fontFamily: "Georgia, serif",
      fontSize: "66px",
      color: "#f1ead7",
      fontStyle: "bold",
      letterSpacing: 7,
      shadow: { offsetX: 0, offsetY: 4, color: "#000000", blur: 12, fill: true },
    }).setOrigin(0.5);

    this.add.text(width / 2, 292, "언더페일", {
      fontFamily: "serif",
      fontSize: "27px",
      color: "#d6cba9",
      letterSpacing: 8,
    }).setOrigin(0.5);

    let started = false;
    const start = (): void => {
      if (started) return;
      started = true;
      this.scene.start("NameEntryScene");
    };

    const startLabel = this.add.text(width / 2, 390, "[ 새 게임 시작 ]", {
      fontFamily: "monospace",
      fontSize: "22px",
      color: "#e3c77f",
      padding: { x: 12, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: startLabel,
      alpha: 0.55,
      duration: 820,
      yoyo: true,
      repeat: -1,
    });
    startLabel.on("pointerover", () => startLabel.setColor("#fff2c7"));
    startLabel.on("pointerout", () => startLabel.setColor("#e3c77f"));
    startLabel.on("pointerdown", start);

    this.input.keyboard?.once("keydown-ENTER", start);
    this.input.keyboard?.once("keydown-SPACE", start);

    this.add.text(24, height - 20, "PROTOTYPE BUILD · 임시 그래픽과 문구가 포함되어 있습니다.", {
      fontFamily: "monospace",
      fontSize: "10px",
      color: "#718078",
    }).setOrigin(0, 0.5);
  }
}
