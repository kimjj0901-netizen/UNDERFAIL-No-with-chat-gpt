import Phaser from "phaser";
import { GameSession } from "../state/GameSession";

export class FlowerFieldScene extends Phaser.Scene {
  private prompt?: Phaser.GameObjects.Text;
  private bully?: Phaser.GameObjects.Container;
  private enter?: Phaser.Input.Keyboard.Key;
  private opened = false;

  constructor() {
    super("FlowerFieldScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#121a18");
    this.drawField();
    this.bully = this.drawBully();

    this.add.text(52, 38, "이름을 정한 뒤의 어느 순간", {
      fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
      fontSize: "13px",
      color: "#9da99c",
    });

    this.prompt = this.add.text(480, 486, "ENTER / E  —  앞의 사람에게 다가가기", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#e2cb8e",
      backgroundColor: "#0b1112",
      padding: { x: 12, y: 8 },
    }).setOrigin(0.5);

    this.enter = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.tweens.add({
      targets: this.bully,
      y: "-=4",
      duration: 950,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  update(): void {
    if (!this.enter || this.opened) return;
    if (Phaser.Input.Keyboard.JustDown(this.enter) || Phaser.Input.Keyboard.JustDown(this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E) ?? this.enter)) {
      this.opened = true;
      this.startEncounter();
    }
  }

  private startEncounter(): void {
    this.prompt?.setText("불리가 다가온다...");
    this.time.delayedCall(500, () => {
      this.scene.start("BullyBattleScene");
    });
  }

  private drawField(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x223633, 0x17201e, 0x31433a, 0x19211f, 1);
    g.fillRect(0, 0, 960, 540);

    g.fillStyle(0x24392f, 1).fillEllipse(480, 355, 820, 250);
    g.fillStyle(0x18261f, 0.7).fillEllipse(480, 410, 920, 230);

    for (let i = 0; i < 84; i += 1) {
      const x = 40 + ((i * 83) % 880);
      const y = 95 + ((i * 47) % 330);
      const r = 2 + (i % 3);
      g.lineStyle(1, i % 2 ? 0xa7a06d : 0xc8a1a1, 0.65);
      g.lineBetween(x, y + 4, x, y + 13);
      g.fillStyle(i % 3 === 0 ? 0xd0a2a6 : 0xd0c98c, 0.8).fillCircle(x, y, r);
      g.fillStyle(0x53674f, 0.55).fillCircle(x - 3, y + 5, 2);
      g.fillStyle(0x53674f, 0.55).fillCircle(x + 3, y + 6, 2);
    }

    g.fillStyle(0x0d1415, 0.6).fillRect(0, 0, 960, 70);
    g.fillStyle(0xd5c99f, 0.25).fillEllipse(770, 112, 88, 88);
    g.fillStyle(0xd5c99f, 0.08).fillEllipse(770, 112, 138, 138);

    this.add.text(480, 86, "꽃이 너무 조용하다.", {
      fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
      fontSize: "24px",
      color: "#e7dfc5",
    }).setOrigin(0.5);

    this.add.text(480, 120, "아무도 없는 것처럼 보였지만, 누군가 기다리고 있었다.", {
      fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
      fontSize: "14px",
      color: "#9eaaa0",
    }).setOrigin(0.5);
  }

  private drawBully(): Phaser.GameObjects.Container {
    const c = this.add.container(480, 284);
    const shadow = this.add.ellipse(0, 65, 92, 20, 0x0a1110, 0.45);
    const body = this.add.graphics();
    body.fillStyle(0x4a3d46, 1).fillRoundedRect(-34, -6, 68, 92, 24);
    body.fillStyle(0xb0a0a1, 1).fillCircle(0, -35, 38);
    body.fillStyle(0x29242a, 1).fillEllipse(0, -55, 72, 32);
    body.fillStyle(0x15191a, 1).fillCircle(-12, -36, 4);
    body.fillStyle(0x15191a, 1).fillCircle(12, -36, 4);
    body.lineStyle(3, 0x6b4850, 0.8).lineBetween(-12, -17, 12, -17);
    body.fillStyle(0x29252a, 1).fillRect(-45, 18, 18, 50);
    body.fillStyle(0x29252a, 1).fillRect(27, 18, 18, 50);

    const aura = this.add.graphics();
    aura.lineStyle(2, 0x9a5d69, 0.25).strokeCircle(0, -5, 66);
    aura.lineStyle(1, 0xe2b5a1, 0.18).strokeCircle(0, -5, 80);

    c.add([aura, shadow, body]);
    c.setDepth(10);

    this.add.text(480, 202, "불리", {
      fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
      fontSize: "16px",
      color: "#f0dfc7",
      backgroundColor: "#1b2222",
      padding: { x: 7, y: 4 },
    }).setOrigin(0.5).setDepth(11);

    return c;
  }
}
