import Phaser from "phaser";
import { GameSession } from "../state/GameSession";

type Beat = {
  kind: "memory" | "document" | "present";
  title: string;
  body: string;
};

const BEATS: Beat[] = [
  {
    kind: "memory",
    title: "먼 옛날",
    body: "꿈을 향해 나아가는 학생들이 있었다.\n그리고 그 꿈을 함께 바라보던 학교가 있었다.",
  },
  {
    kind: "memory",
    title: "합주곡 혼합고등학교",
    body: "인문계와 예체능이 한 교정에서 만났다.\n시험지 옆에는 악보가, 교과서 옆에는 스케치북이 놓여 있었다.",
  },
  {
    kind: "document",
    title: "그러나",
    body: "성적 부진으로 인한 폐교 확인서.\n도장 하나가 찍히고, 단체사진 위로 조용히 눈물이 떨어진다.",
  },
  {
    kind: "present",
    title: "시간이 흐른 뒤",
    body: "배정 통지서의 목적지는 풍화양상 고등학교.\n사람들은 그곳을 열등생을 바꾸는 곳이라고 말했다.",
  },
];

export class PrologueScene extends Phaser.Scene {
  private beatIndex = 0;
  private advanceKey?: Phaser.Input.Keyboard.Key;
  private layer?: Phaser.GameObjects.Graphics;
  private titleText?: Phaser.GameObjects.Text;
  private bodyText?: Phaser.GameObjects.Text;
  private hintText?: Phaser.GameObjects.Text;

  constructor() {
    super("PrologueScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#080d10");
    this.advanceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.on("pointerdown", this.advance, this);

    this.renderBeat();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off("pointerdown", this.advance, this);
    });
  }

  update(): void {
    if (this.advanceKey && Phaser.Input.Keyboard.JustDown(this.advanceKey)) this.advance();
  }

  private advance(): void {
    this.beatIndex += 1;
    if (this.beatIndex >= BEATS.length) {
      this.scene.start("FlowerFieldScene");
      return;
    }
    this.renderBeat();
  }

  private renderBeat(): void {
    this.layer?.destroy();
    this.titleText?.destroy();
    this.bodyText?.destroy();
    this.hintText?.destroy();

    const beat = BEATS[this.beatIndex];
    const g = this.add.graphics();
    this.layer = g;

    if (beat.kind === "memory") {
      g.fillGradientStyle(0x15262b, 0x15262b, 0x2f3f3c, 0x172126, 1);
      g.fillRect(0, 0, 960, 540);
      this.drawMemorySchool(g, this.beatIndex === 1);
    } else if (beat.kind === "document") {
      g.fillStyle(0x0a0e10, 1).fillRect(0, 0, 960, 540);
      this.drawDocument(g);
    } else {
      g.fillStyle(0x12191d, 1).fillRect(0, 0, 960, 540);
      this.drawPresentSchool(g);
    }

    g.fillStyle(0x06090b, 0.72).fillRect(0, 0, 960, 540);
    g.fillStyle(0x080d10, 0.92).fillRect(52, 372, 856, 122);
    g.lineStyle(1, 0xb9a878, 0.7).strokeRect(52, 372, 856, 122);

    this.titleText = this.add.text(78, 394, beat.title, {
      fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
      fontSize: "17px",
      color: "#dfc98d",
      fontStyle: "bold",
    });

    this.bodyText = this.add.text(78, 424, beat.body, {
      fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
      fontSize: "18px",
      color: "#f1ead7",
      lineSpacing: 10,
      wordWrap: { width: 760 },
    });

    this.hintText = this.add.text(872, 470, "ENTER / 클릭  ▶", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#9caa9e",
    }).setOrigin(1, 0.5);

    this.tweens.add({
      targets: [this.titleText, this.bodyText],
      alpha: { from: 0, to: 1 },
      y: "+=5",
      duration: 360,
      ease: "Sine.easeOut",
    });
  }

  private drawMemorySchool(g: Phaser.GameObjects.Graphics, richer: boolean): void {
    g.fillStyle(0x314943, 1).fillRect(0, 325, 960, 215);
    g.fillStyle(0x202f30, 1).fillRect(110, 145, 740, 190);
    g.fillStyle(0xb5a67c, 0.2).fillRect(110, 145, 740, 190);
    g.lineStyle(2, 0xc9b987, 0.45).strokeRect(110, 145, 740, 190);

    for (let i = 0; i < 8; i += 1) {
      const x = 145 + i * 90;
      g.fillStyle(i % 2 === 0 ? 0x4c6961 : 0x5a625b, 1).fillRect(x, 175, 56, 80);
      g.fillStyle(0x10181b, 0.65).fillRect(x + 8, 184, 40, 32);
    }

    g.fillStyle(0x8b7858, 1).fillRect(430, 276, 100, 59);
    g.fillStyle(0x9d8b6a, 1).fillEllipse(480, 254, 70, 44);
    g.fillStyle(0x394b47, 1).fillRect(448, 217, 64, 36);
    g.lineStyle(2, 0xd8c79d, 0.45).lineBetween(452, 227, 508, 227);

    if (richer) {
      for (let i = 0; i < 12; i += 1) {
        const x = 140 + (i % 6) * 135;
        const y = 385 + Math.floor(i / 6) * 58;
        g.fillStyle(i % 2 === 0 ? 0x5c6c63 : 0x7a6d55, 1).fillRoundedRect(x, y, 86, 28, 7);
        g.fillStyle(0xd0c19a, 0.55).fillRect(x + 10, y + 8, 40, 3);
      }
    }
  }

  private drawDocument(g: Phaser.GameObjects.Graphics): void {
    g.fillStyle(0x151c1f, 1).fillRect(0, 0, 960, 540);
    g.fillStyle(0xd9d0b8, 1).fillRoundedRect(188, 70, 584, 382, 4);
    g.lineStyle(2, 0x8b836f, 0.7).strokeRect(188, 70, 584, 382);
    g.fillStyle(0x353d3d, 1).fillRect(240, 115, 270, 10);
    g.fillStyle(0x7c7465, 0.55).fillRect(240, 143, 420, 6);
    g.fillStyle(0x7c7465, 0.45).fillRect(240, 160, 370, 6);
    g.fillStyle(0x7c7465, 0.45).fillRect(240, 177, 400, 6);

    g.fillStyle(0x293335, 1).fillRect(242, 226, 300, 160);
    g.lineStyle(1, 0x9a9b8c, 0.4).strokeRect(242, 226, 300, 160);
    g.fillStyle(0x5b6966, 1).fillCircle(392, 295, 46);
    g.fillStyle(0x273235, 1).fillCircle(392, 295, 34);
    for (let i = 0; i < 6; i += 1) {
      g.fillStyle(0x85928a, 0.6).fillCircle(312 + i * 32, 350 - (i % 2) * 16, 9);
    }

    g.fillStyle(0x6f302f, 0.82).fillCircle(648, 320, 38);
    g.fillStyle(0x421e20, 0.9).fillCircle(648, 320, 25);
    g.fillStyle(0x25191a, 0.6).fillEllipse(648, 318, 50, 12);

    g.fillStyle(0x101415, 1).fillRoundedRect(585, 176, 100, 145, 16);
    g.fillStyle(0x202a2c, 1).fillRoundedRect(600, 186, 70, 112, 12);
    g.fillStyle(0x3f4d4a, 1).fillCircle(635, 225, 10);
    g.fillStyle(0xb7a878, 0.3).fillRect(620, 260, 30, 3);
    g.fillStyle(0x7e5a55, 0.75).fillCircle(690, 352, 4);
    g.fillStyle(0x7e5a55, 0.5).fillCircle(712, 365, 3);
  }

  private drawPresentSchool(g: Phaser.GameObjects.Graphics): void {
    g.fillStyle(0x202a2d, 1).fillRect(0, 0, 960, 540);
    g.fillStyle(0x343e3e, 1).fillRect(120, 105, 720, 315);
    g.fillStyle(0x161d20, 1).fillRect(120, 420, 720, 120);
    g.fillStyle(0x101619, 1).fillRect(174, 160, 170, 240);
    g.fillStyle(0x263136, 1).fillRect(188, 178, 142, 98);
    g.fillStyle(0x2d3a3c, 1).fillRect(390, 160, 180, 240);
    g.fillStyle(0x263136, 1).fillRect(408, 178, 144, 98);
    g.fillStyle(0x101619, 1).fillRect(616, 160, 170, 240);
    g.fillStyle(0x263136, 1).fillRect(630, 178, 142, 98);
    g.lineStyle(2, 0x927c55, 0.55).strokeRect(160, 92, 640, 336);
    for (let i = 0; i < 10; i += 1) {
      g.fillStyle(0x9c8a61, 0.25).fillRect(150 + i * 68, 430, 42, 8);
    }
  }
}
