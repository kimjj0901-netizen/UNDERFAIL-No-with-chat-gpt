import Phaser from "phaser";
import { GameSession } from "../state/GameSession";

type Mode = "intro" | "menu" | "dodge" | "rescue";

type Glyph = {
  object: Phaser.GameObjects.Arc;
  vx: number;
  vy: number;
};

export class BullyBattleScene extends Phaser.Scene {
  private mode: Mode = "intro";
  private menuIndex = 0;
  private glyphs: Glyph[] = [];
  private player?: Phaser.GameObjects.Text;
  private enemy?: Phaser.GameObjects.Container;
  private panel?: Phaser.GameObjects.Rectangle;
  private message?: Phaser.GameObjects.Text;
  private hint?: Phaser.GameObjects.Text;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private dodgeTime = 0;
  private spawnTime = 0;
  private patternIndex = 0;
  private actCount = 0;
  private rescued = false;

  constructor() {
    super("BullyBattleScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#090e11");
    this.keys = this.makeKeys();
    this.drawArena();
    this.showIntro();
  }

  update(_time: number, delta: number): void {
    if (this.mode === "dodge") this.updateDodge(delta);
    if (this.mode === "menu") this.updateMenu();
  }

  private makeKeys(): Record<string, Phaser.Input.Keyboard.Key> {
    const k = this.input.keyboard;
    if (!k) throw new Error("Keyboard input unavailable.");
    return {
      up: k.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: k.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left: k.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: k.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      w: k.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      s: k.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      a: k.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      d: k.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      enter: k.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
      space: k.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      esc: k.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    };
  }

  private drawArena(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x111a1d, 0x111a1d, 0x241c23, 0x15191b, 1);
    g.fillRect(0, 0, 960, 540);

    for (let i = 0; i < 22; i += 1) {
      const x = 35 + i * 43;
      g.lineStyle(1, 0x6e6152, 0.16);
      g.lineBetween(x, 70, x + 160, 500);
    }

    g.fillStyle(0x0b1113, 0.9).fillRect(48, 70, 864, 386);
    g.lineStyle(2, 0xb8a878, 0.9).strokeRect(48, 70, 864, 386);
    g.lineStyle(1, 0x56645f, 0.8).strokeRect(58, 80, 844, 366);

    this.enemy = this.drawEnemy();
    this.add.text(84, 92, "BULLY / 첫 번째 조우", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#a5b0a6",
    });
  }

  private drawEnemy(): Phaser.GameObjects.Container {
    const c = this.add.container(480, 188);
    const g = this.add.graphics();
    g.fillStyle(0x4b3b43, 1).fillRoundedRect(-52, -4, 104, 86, 28);
    g.fillStyle(0xb4a3a4, 1).fillCircle(0, -47, 45);
    g.fillStyle(0x2b242b, 1).fillEllipse(0, -66, 84, 30);
    g.fillStyle(0x171b1c, 1).fillCircle(-14, -46, 5);
    g.fillStyle(0x171b1c, 1).fillCircle(14, -46, 5);
    g.lineStyle(3, 0x6d4850, 0.9).lineBetween(-15, -26, 15, -26);

    const seal = this.add.graphics();
    seal.lineStyle(2, 0xb77a87, 0.45).strokeCircle(0, 16, 72);
    seal.lineStyle(1, 0xe5c798, 0.2).strokeCircle(0, 16, 90);
    c.add([seal, g]);
    return c;
  }

  private showIntro(): void {
    this.mode = "intro";
    this.message = this.add.text(84, 332,
      "불리는 친근한 척 손을 내민다.\n" +
      "그 손끝에서 이상한 상징들이 번뜩인다.\n" +
      "좋은 것이라고 말하지만, 당신은 본능적으로 거리를 둔다.",
      {
        fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
        fontSize: "17px",
        color: "#efe5cf",
        lineSpacing: 10,
      },
    );
    this.hint = this.add.text(84, 430, "ENTER  —  전투 규칙을 확인한다", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#d2be88",
    });

    this.input.keyboard?.once("keydown-ENTER", () => this.openMenu());
    this.input.keyboard?.once("keydown-SPACE", () => this.openMenu());
  }

  private openMenu(): void {
    this.message?.destroy();
    this.hint?.destroy();
    this.mode = "menu";
    this.renderMenu();
  }

  private renderMenu(): void {
    this.clearMenu();
    const options = ["FIGHT", "ACT", "ITEM", "MERCY"];
    options.forEach((label, index) => {
      const selected = index === this.menuIndex;
      const t = this.add.text(120 + index * 220, 474, (selected ? "▶ " : "  ") + label, {
        fontFamily: "Georgia, serif",
        fontSize: "22px",
        color: selected ? "#f2d58f" : "#bfc7bf",
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      t.on("pointerdown", () => {
        this.menuIndex = index;
        this.confirmMenu();
      });
      this.menuObjects.push(t);
    });

    this.message = this.add.text(84, 330, this.getMenuDescription(), {
      fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
      fontSize: "16px",
      color: "#d9d5c4",
      wordWrap: { width: 790 },
    });
  }

  private menuObjects: Phaser.GameObjects.Text[] = [];

  private clearMenu(): void {
    for (const o of this.menuObjects) o.destroy();
    this.menuObjects = [];
  }

  private updateMenu(): void {
    if (Phaser.Input.Keyboard.JustDown(this.keys.left) || Phaser.Input.Keyboard.JustDown(this.keys.a)) {
      this.menuIndex = (this.menuIndex + 3) % 4;
      this.renderMenu();
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.right) || Phaser.Input.Keyboard.JustDown(this.keys.d)) {
      this.menuIndex = (this.menuIndex + 1) % 4;
      this.renderMenu();
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.enter) || Phaser.Input.Keyboard.JustDown(this.keys.space)) {
      this.confirmMenu();
    }
  }

  private getMenuDescription(): string {
    if (this.menuIndex === 0) return "FIGHT — 정면으로 밀어붙인다. 이 전투의 튜토리얼에서는 실제 위해 대신 추상적인 의지의 충돌로 표현된다.";
    if (this.menuIndex === 1) return "ACT — 불리의 기만을 살피고, 이상한 상징을 거부한다고 말한다.";
    if (this.menuIndex === 2) return "ITEM — 아직 사용할 아이템이 없다.";
    return "MERCY — 아직은 불리가 물러설 이유가 없다.";
  }

  private confirmMenu(): void {
    if (this.menuIndex === 2) {
      this.message?.setText("가방은 비어 있다.\n지금은 다른 행동을 선택해야 한다.");
      return;
    }

    if (this.menuIndex === 3) {
      this.message?.setText("불리는 웃으며 고개를 젓는다.\n그는 당신이 경계하기를 기다렸던 것 같다.");
      this.beginDodge();
      return;
    }

    if (this.menuIndex === 0) {
      this.message?.setText("당신은 한 걸음 물러서지 않는다.\n그러자 불리의 표식이 더 빠르게 번뜩인다.");
      this.beginDodge();
      return;
    }

    this.actCount += 1;
    this.message?.setText(
      this.actCount === 1
        ? "당신은 그가 내미는 것을 받지 않겠다고 분명히 말했다."
        : "당신은 다시 한 번 스스로 선택하겠다고 말했다.\n불리의 표정이 잠깐 굳는다.",
    );
    this.beginDodge();
  }

  private beginDodge(): void {
    this.mode = "dodge";
    this.clearMenu();
    this.message?.destroy();
    this.message = undefined;

    const arena = this.add.graphics().setDepth(30);
    arena.fillStyle(0x070b0d, 0.98).fillRect(276, 218, 408, 196);
    arena.lineStyle(2, 0xc0ad7c, 1).strokeRect(276, 218, 408, 196);
    arena.lineStyle(1, 0x5b6962, 0.8).strokeRect(286, 228, 388, 176);
    this.uiObjects.push(arena);

    this.player = this.add.text(480, 315, "♥", {
      fontFamily: "serif",
      fontSize: "25px",
      color: "#f0d18c",
    }).setOrigin(0.5).setDepth(35);

    this.dodgeTime = 0;
    this.spawnTime = 0;
    this.patternIndex = 0;

    this.hint?.destroy();
    this.hint = this.add.text(480, 434, "WASD / 방향키로 회피 · ENTER로 다시 메뉴", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#aab3a8",
    }).setOrigin(0.5).setDepth(35);
  }

  private uiObjects: Phaser.GameObjects.GameObject[] = [];

  private updateDodge(delta: number): void {
    this.dodgeTime += delta;
    this.spawnTime += delta;

    let dx = 0;
    let dy = 0;
    if (this.keys.left.isDown || this.keys.a.isDown) dx -= 1;
    if (this.keys.right.isDown || this.keys.d.isDown) dx += 1;
    if (this.keys.up.isDown || this.keys.w.isDown) dy -= 1;
    if (this.keys.down.isDown || this.keys.s.isDown) dy += 1;

    if (dx || dy) {
      const len = Math.hypot(dx, dy) || 1;
      this.player?.setPosition(
        Phaser.Math.Clamp((this.player?.x ?? 480) + (dx / len) * 220 * (delta / 1000), 296, 664),
        Phaser.Math.Clamp((this.player?.y ?? 315) + (dy / len) * 220 * (delta / 1000), 238, 394),
      );
    }

    if (this.spawnTime > 480) {
      this.spawnTime = 0;
      this.spawnGlyph();
    }

    const next: Glyph[] = [];
    for (const glyph of this.glyphs) {
      glyph.object.x += glyph.vx * (delta / 1000);
      glyph.object.y += glyph.vy * (delta / 1000);
      const px = this.player?.x ?? 480;
      const py = this.player?.y ?? 315;
      if (Math.hypot(px - glyph.object.x, py - glyph.object.y) < 18) {
        glyph.object.destroy();
        GameSession.get().bullyHits += 1;
      } else if (glyph.object.x > 270 && glyph.object.x < 690 && glyph.object.y > 220 && glyph.object.y < 410) {
        next.push(glyph);
      } else {
        glyph.object.destroy();
      }
    }
    this.glyphs = next;

    if (this.dodgeTime > 2800) this.finishDodge();
  }

  private spawnGlyph(): void {
    const side = this.patternIndex % 2 === 0 ? 0 : 1;
    const y = 250 + (this.patternIndex % 5) * 29;
    const x = side === 0 ? 290 : 670;
    const vx = side === 0 ? 135 : -135;
    const vy = this.patternIndex % 3 === 0 ? 16 : -12;
    const glyph = this.add.circle(x, y, 9, 0xa85c72, 0.88)
      .setStrokeStyle(2, 0xe4c38d, 0.5)
      .setDepth(34);
    this.glyphs.push({ object: glyph, vx, vy });
    this.patternIndex += 1;
  }

  private finishDodge(): void {
    this.clearBullets();
    for (const o of this.uiObjects) o.destroy();
    this.uiObjects = [];
    this.player?.destroy();
    this.player = undefined;
    this.mode = "menu";

    if (this.actCount >= 2) {
      this.rescued = true;
      this.showRescue();
      return;
    }

    this.renderMenu();
  }

  private showRescue(): void {
    this.mode = "rescue";
    this.clearMenu();
    this.enemy?.setAlpha(0.35);

    const burst = this.add.graphics().setDepth(40);
    burst.lineStyle(5, 0xe0d0a2, 0.8);
    burst.strokeCircle(480, 185, 55);
    burst.lineStyle(2, 0x8db3a4, 0.8);
    burst.strokeCircle(480, 185, 90);

    this.message = this.add.text(84, 320,
      "불리가 다시 손을 뻗는 순간, 다른 힘이 사이를 가른다.\n" +
      "도미토리엘이 나타나 불리의 표식을 밀어내고 당신 앞에 선다.\n\n" +
      "불리: "...이 정도로까지 할 줄은 몰랐네."\n" +
      "도미토리엘: "그 아이에게 손대지 마."",
      {
        fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
        fontSize: "17px",
        color: "#f1ead7",
        lineSpacing: 8,
      },
    ).setDepth(41);

    this.hint = this.add.text(480, 455, "ENTER  —  교육복지반으로 이동", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#e0cb8f",
    }).setOrigin(0.5).setDepth(41);

    this.input.keyboard?.once("keydown-ENTER", this.enterWelfare);
    this.input.keyboard?.once("keydown-SPACE", this.enterWelfare);
  }

  private enterWelfare = (): void => {
    GameSession.get().bullyRescued = true;
    this.scene.start("RoomScene");
  };

  private clearBullets(): void {
    for (const glyph of this.glyphs) glyph.object.destroy();
    this.glyphs = [];
  }
}
