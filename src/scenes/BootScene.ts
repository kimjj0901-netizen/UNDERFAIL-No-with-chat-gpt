import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create(): void {
    this.add
      .text(480, 220, "언더페일", {
        fontFamily: "monospace",
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(480, 290, "Milestone 0 · 프로젝트 생성 완료", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);
  }
}
