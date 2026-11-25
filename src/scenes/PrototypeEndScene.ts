import Phaser from "phaser";
import { GameSession } from "../state/GameSession";

export class PrototypeEndScene extends Phaser.Scene {
  constructor() {
    super("PrototypeEndScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#10171b");
    const g = this.add.graphics();
    g.fillStyle(0x1e2c30, 1).fillRect(54, 48, 852, 444);
    g.lineStyle(2, 0xb6a77a, 0.95).strokeRect(54, 48, 852, 444);
    g.lineStyle(1, 0x60746c, 0.8).strokeRect(66, 60, 828, 420);
    g.fillStyle(0xd2bd8c, 0.16).fillCircle(480, 175, 90);

    this.add.text(480, 126, "첫 번째 문을 지나왔다", {
      fontFamily: "serif",
      fontSize: "34px",
      color: "#f1ead7",
    }).setOrigin(0.5);

    this.add.text(480, 184, GameSession.get().playerName + "의 첫 선택이 기록되었다.", {
      fontFamily: "serif",
      fontSize: "22px",
      color: "#d4c69f",
    }).setOrigin(0.5);

    this.add.text(480, 274, "도미토리엘은 걱정스러운 눈으로 당신을 바라보다가,\n천천히 문 옆으로 비켜섰다.", {
      fontFamily: "sans-serif",
      fontSize: "18px",
      color: "#bdc8bd",
      align: "center",
      lineSpacing: 10,
    }).setOrigin(0.5);

    this.add.text(480, 364, "이후의 이야기는 다음 제작 단계에서 이어집니다.", {
      fontFamily: "sans-serif",
      fontSize: "16px",
      color: "#91a39a",
    }).setOrigin(0.5);

    const restart = this.add.text(480, 430, "[ R 키로 타이틀로 돌아가기 ]", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#e3c77f",
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    restart.on("pointerdown", () => this.scene.start("TitleScene"));
    this.input.keyboard?.once("keydown-R", () => this.scene.start("TitleScene"));

    this.add.text(480, 476, "PROTOTYPE END · 임시 종료 지점 / 정식 엔딩 아님", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#7f9288",
    }).setOrigin(0.5);
  }
}
