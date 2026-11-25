import Phaser from "phaser";
import { Atmosphere } from "../audio/Atmosphere";
import { GameSession } from "../state/GameSession";

type Mode = "intro" | "menu" | "response" | "dodge" | "rescue";

type Glyph = {
  object: Phaser.GameObjects.Image;
  vx: number;
  vy: number;
};

export class BullyBattleScene extends Phaser.Scene {
  private mode: Mode = "intro";
  private menuIndex = 0;
  private glyphs: Glyph[] = [];
  private player?: Phaser.GameObjects.Image;
  private enemy?: Phaser.GameObjects.Container;
  private panel?: Phaser.GameObjects.Rectangle;
  private message?: Phaser.GameObjects.Text;
  private hint?: Phaser.GameObjects.Text;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private dodgeTime = 0;
  private spawnTime = 0;
  private patternIndex = 0;
  // [제안/PROTOTYPE] This encounter-only count is not a route-wide canon rule.
  private actCount = 0;
  private lastHitAt = -1000;

  constructor() {
    super("BullyBattleScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#090e11");
    this.keys = this.makeKeys();
    this.lastHitAt = -1000;
    this.drawArena();
    this.showIntro();
  }

  update(_time: number, delta: number): void {
    if (this.mode === "dodge") this.updateDodge(delta);
    if (this.mode === "menu") this.updateMenu();
    if (this.mode === "response" &&
        (Phaser.Input.Keyboard.JustDown(this.keys.enter) || Phaser.Input.Keyboard.JustDown(this.keys.space))) {
      this.beginDodge();
    }
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
    this.add.image(480, 270, "opening-flower-field")
      .setDisplaySize(960, 540)
      .setAlpha(0.72);
    this.add.rectangle(480, 270, 960, 540, 0x07121b, 0.48);
    const g = this.add.graphics();

    for (let i = 0; i < 22; i += 1) {
      const x = 35 + i * 43;
      g.lineStyle(1, 0x6e6152, 0.16);
      g.lineBetween(x, 70, x + 160, 500);
    }

    g.fillStyle(0x0b1113, 0.9).fillRect(48, 70, 864, 386);
    g.lineStyle(2, 0xb8a878, 0.9).strokeRect(48, 70, 864, 386);
    g.lineStyle(1, 0x56645f, 0.8).strokeRect(58, 80, 844, 366);

    this.enemy = this.drawEnemy();
    this.add.text(84, 92, "첫 번째 조우   /   꽃밭", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "12px",
      color: "#d8c9a7",
      backgroundColor: "#17272a",
      padding: { x: 9, y: 5 },
    }).setDepth(10);
  }

  private drawEnemy(): Phaser.GameObjects.Container {
    const c = this.add.container(480, 188);
    const aura = this.add.graphics();
    aura.lineStyle(2, 0xc58d8d, 0.3).strokeCircle(0, 8, 82);
    aura.lineStyle(1, 0xe5d1a9, 0.23).strokeCircle(0, 8, 98);
    const portrait = this.add.image(0, 0, "character-bully").setDisplaySize(94, 126);
    c.add([aura, portrait]);
    return c;
  }

  private showIntro(): void {
    this.mode = "intro";
    Atmosphere.setMood("uneasy");
    const panel = this.add.rectangle(480, 383, 864, 148, 0x0c1820, 0.94)
      .setStrokeStyle(2, 0xb6a47d, 0.92)
      .setDepth(25);
    this.message = this.add.text(82, 334,
      "불리는 친근한 척 손을 내민다.\n" +
      "그 손끝에서 이상한 상징들이 번뜩인다.\n" +
      "좋은 것이라고 말하지만, 당신은 본능적으로 거리를 둔다.",
      {
        fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
        fontSize: "17px",
        color: "#efe5cf",
        lineSpacing: 10,
      },
    ).setDepth(26);
    this.hint = this.add.text(878, 438, "ENTER  —  계속", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#d2be88",
    }).setOrigin(1, 0.5).setDepth(26);
    this.uiObjects.push(panel);

    this.input.keyboard?.once("keydown-ENTER", () => this.openMenu());
    this.input.keyboard?.once("keydown-SPACE", () => this.openMenu());
    this.input.once("pointerdown", () => this.openMenu());
  }

  private openMenu(): void {
    this.message?.destroy();
    this.hint?.destroy();
    this.mode = "menu";
    this.renderMenu();
  }

  private renderMenu(): void {
    this.message?.destroy();
    this.message = undefined;
    this.clearMenu();
    const menuPanel = this.add.rectangle(480, 414, 874, 158, 0x0b171e, 0.96)
      .setStrokeStyle(2, 0xb6a47d, 0.94)
      .setDepth(28);
    const options = ["FIGHT", "ACT", "ITEM", "MERCY"];
    const descriptions = ["밀어내기", "상황 살피기", "소지품", "물러나기"];
    options.forEach((label, index) => {
      const x = 150 + index * 220;
      const selected = index === this.menuIndex;
      const card = this.add.rectangle(x, 460, 186, 58,
        selected ? 0x3c5148 : 0x17262b, selected ? 0.98 : 0.88)
        .setStrokeStyle(selected ? 2 : 1, selected ? 0xe1c68d : 0x64746a, selected ? 1 : 0.75)
        .setDepth(29)
        .setInteractive({ useHandCursor: true });
      const title = this.add.text(x, 449, label, {
        fontFamily: "Georgia, serif",
        fontSize: "17px",
        fontStyle: "bold",
        color: selected ? "#f4e5bf" : "#c5c7ba",
        letterSpacing: 1,
      }).setOrigin(0.5).setDepth(30);
      const subtitle = this.add.text(x, 472, descriptions[index] ?? "", {
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: "10px",
        color: selected ? "#e0d2b4" : "#96a398",
      }).setOrigin(0.5).setDepth(30);
      card.on("pointerdown", () => {
        this.menuIndex = index;
        this.confirmMenu();
      });
      this.menuObjects.push(card, title, subtitle);
    });
    this.menuObjects.push(menuPanel);

    this.message = this.add.text(84, 330, this.getMenuDescription(), {
      fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
      fontSize: "16px",
      color: "#e7dfcc",
      wordWrap: { width: 790 },
      lineSpacing: 7,
    }).setDepth(30);
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
      this.showResponse("불리는 웃으며 고개를 젓는다.\n그는 당신이 경계하기를 기다렸던 것 같다.");
      return;
    }

    if (this.menuIndex === 0) {
      this.showResponse("당신은 한 걸음 물러서지 않는다.\n그러자 불리의 표식이 더 빠르게 번뜩인다.");
      return;
    }

    this.actCount += 1;
    this.showResponse(
      this.actCount === 1
        ? "당신은 그가 내미는 것을 받지 않겠다고 분명히 말했다."
        : "당신은 다시 한 번 스스로 선택하겠다고 말했다.\n불리의 표정이 잠깐 굳는다.",
    );
  }

  private showResponse(text: string): void {
    this.mode = "response";
    this.clearMenu();
    this.message?.destroy();
    this.message = this.add.text(480, 362, text, {
      fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
      fontSize: "17px",
      color: "#f1e6d0",
      backgroundColor: "#0c1820",
      padding: { x: 22, y: 15 },
      align: "center",
      wordWrap: { width: 760 },
      lineSpacing: 8,
    }).setOrigin(0.5).setDepth(32);
    this.hint?.destroy();
    this.hint = this.add.text(878, 438, "ENTER  —  회피 구간으로", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#d7c493",
    }).setOrigin(1, 0.5).setDepth(32);
  }

  private beginDodge(): void {
    this.mode = "dodge";
    this.clearMenu();
    this.message?.destroy();
    this.message = undefined;
    this.hint?.destroy();
    this.hint = undefined;

    const arena = this.add.graphics().setDepth(30);
    arena.fillStyle(0x070b0d, 0.98).fillRect(276, 218, 408, 196);
    arena.lineStyle(2, 0xc0ad7c, 1).strokeRect(276, 218, 408, 196);
    arena.lineStyle(1, 0x5b6962, 0.8).strokeRect(286, 228, 388, 176);
    this.uiObjects.push(arena);

    this.player = this.add.image(480, 315, "battle-marker")
      .setDisplaySize(24, 24)
      .setDepth(35);

    this.dodgeTime = 0;
    this.spawnTime = 0;
    this.patternIndex = 0;

    this.hint?.destroy();
    this.hint = this.add.text(480, 434, "방향키 / WASD로 이동해 빛무늬를 피하자", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#aab3a8",
    }).setOrigin(0.5).setDepth(35);
  }

  private uiObjects: Phaser.GameObjects.GameObject[] = [];

  private updateDodge(delta: number): void {
    this.dodgeTime += delta;
    this.spawnTime += delta;
    const frameSeconds = Math.min(delta, 40) / 1000;

    let dx = 0;
    let dy = 0;
    if (this.keys.left.isDown || this.keys.a.isDown) dx -= 1;
    if (this.keys.right.isDown || this.keys.d.isDown) dx += 1;
    if (this.keys.up.isDown || this.keys.w.isDown) dy -= 1;
    if (this.keys.down.isDown || this.keys.s.isDown) dy += 1;

    if (dx || dy) {
      const len = Math.hypot(dx, dy) || 1;
      this.player?.setPosition(
        Phaser.Math.Clamp((this.player?.x ?? 480) + (dx / len) * 220 * frameSeconds, 296, 664),
        Phaser.Math.Clamp((this.player?.y ?? 315) + (dy / len) * 220 * frameSeconds, 238, 394),
      );
    }

    if (this.spawnTime > 480) {
      this.spawnTime = 0;
      this.spawnGlyph();
    }

    const next: Glyph[] = [];
    for (const glyph of this.glyphs) {
      glyph.object.x += glyph.vx * frameSeconds;
      glyph.object.y += glyph.vy * frameSeconds;
      glyph.object.rotation += (delta / 1000) * (glyph.vx > 0 ? 1.8 : -1.8);
      const px = this.player?.x ?? 480;
      const py = this.player?.y ?? 315;
      if (Math.hypot(px - glyph.object.x, py - glyph.object.y) < 20) {
        glyph.object.destroy();
        if (this.time.now - this.lastHitAt > 700) {
          this.lastHitAt = this.time.now;
          GameSession.get().bullyHits += 1;
          this.player?.setAlpha(0.42);
          if (this.player) {
            this.tweens.add({ targets: this.player, alpha: 1, duration: 360, ease: "Sine.InOut" });
          }
        }
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
    const glyph = this.add.image(x, y, "promise-petal")
      .setDisplaySize(20, 20)
      .setAlpha(0.92)
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
      this.showRescue();
      return;
    }

    this.renderMenu();
  }

  private showRescue(): void {
    this.mode = "rescue";
    this.clearMenu();
    this.message?.destroy();
    this.message = undefined;
    this.enemy?.setAlpha(0.35);

    const arc = this.add.image(480, 236, "rescue-arc")
      .setDisplaySize(820, 290)
      .setDepth(39)
      .setAlpha(0);
    this.tweens.add({ targets: arc, alpha: 0.95, duration: 650, ease: "Sine.Out" });
    const teacher = this.add.image(152, 195, "character-domitoriell")
      .setDisplaySize(96, 132)
      .setDepth(40)
      .setAlpha(0);
    this.tweens.add({ targets: teacher, alpha: 1, x: 190, duration: 720, ease: "Cubic.Out" });
    this.tweens.add({ targets: this.enemy, x: 760, alpha: 0.24, duration: 720, delay: 180, ease: "Cubic.In" });
    Atmosphere.setMood("rescue");
    Atmosphere.cue("barrier");

    this.add.rectangle(480, 407, 874, 174, 0x0b1720, 0.97)
      .setStrokeStyle(2, 0xbfae86, 0.96)
      .setDepth(41);
    this.add.text(76, 345, "도미토리엘", {
      fontFamily: "'Noto Serif KR', serif",
      fontSize: "15px",
      color: "#e9d09a",
    }).setDepth(42);
    this.message = this.add.text(76, 378,
      "불리가 다시 손을 뻗는 순간, 다른 힘이 사이를 가른다.\n" +
      "도미토리엘이 나타나 불리의 표식을 밀어내고 당신 앞에 선다.\n\n" +
      "불리: “...이 정도로까지 할 줄은 몰랐네.”\n" +
      "도미토리엘: “그 아이에게 손대지 마.”",
      {
        fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
        fontSize: "16px",
        color: "#f1ead7",
        lineSpacing: 7,
      },
    ).setDepth(42);

    this.hint = this.add.text(878, 476, "ENTER  —  교육복지반으로", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#e0cb8f",
    }).setOrigin(1, 0.5).setDepth(42);

    this.input.keyboard?.once("keydown-ENTER", this.enterWelfare);
    this.input.keyboard?.once("keydown-SPACE", this.enterWelfare);
    this.input.once("pointerdown", this.enterWelfare);
  }

  private enterWelfare = (): void => {
    GameSession.completeOpeningRescue();
    Atmosphere.setMood("warm");
    this.scene.start("RoomScene");
  };

  private clearBullets(): void {
    for (const glyph of this.glyphs) glyph.object.destroy();
    this.glyphs = [];
  }
}
