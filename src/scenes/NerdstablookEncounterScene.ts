import Phaser from "phaser";
import { GameInput } from "../input/GameInput";
import { NERDSTABLOOK_CONTENT } from "../data/welfareEncounterContent";
import { GameSession } from "../state/GameSession";

type Mode = "intro" | "main" | "act" | "response" | "dodge" | "ending";
type Bullet = { object: Phaser.GameObjects.Arc; vx: number; vy: number };
const OPTIONS = ["FIGHT", "ACT", "ITEM", "MERCY"];

export class NerdstablookEncounterScene extends Phaser.Scene {
  private mode: Mode = "intro";
  private controls!: GameInput;
  private menuIndex = 0;
  private actIndex = 0;
  private positiveActs = 0;
  private negativeActs = 0;
  private fightCount = 0;
  private bullets: Bullet[] = [];
  private menuObjects: Phaser.GameObjects.GameObject[] = [];
  private student!: Phaser.GameObjects.Image;
  private player?: Phaser.GameObjects.Image;
  private message?: Phaser.GameObjects.Text;
  private hint?: Phaser.GameObjects.Text;
  private status?: Phaser.GameObjects.Text;
  private waveElapsed = 0;
  private spawnElapsed = 0;
  private patternIndex = 0;
  private pendingDodge = false;
  private finishing = false;
  private lastHitAt = 0;

  constructor() {
    super("NerdstablookEncounterScene");
  }

  create(): void {
    this.add.image(480, 270, "welfare-corridor").setDisplaySize(960, 540).setAlpha(0.5);
    this.add.rectangle(480, 270, 960, 540, 0x09151c, 0.62);

    this.add.text(48, 28, "교육복지반 · 길을 막은 친구", {
      fontFamily: "'Noto Serif KR', serif",
      fontSize: "17px",
      color: "#e5d5b4",
    }).setDepth(20);

    this.student = this.add.image(480, 160, "character-nerdstablook")
      .setDisplaySize(142, 181)
      .setDepth(18);

    this.add.text(480, 263, "너드스타블룩", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "13px",
      color: "#f1e3c6",
      backgroundColor: "#22383d",
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5).setDepth(20);

    this.message = this.add.text(480, 368, NERDSTABLOOK_CONTENT.intro.join("\n"), {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "15px",
      color: "#f1ead9",
      align: "center",
      wordWrap: { width: 790 },
      lineSpacing: 8,
    }).setOrigin(0.5).setDepth(31);

    this.hint = this.add.text(878, 486, "Z / ENTER  —  대화 이어가기", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#e1c995",
    }).setOrigin(1, 0.5).setDepth(31);
    this.status = this.add.text(30, 486, "그는 좋아하는 것을 누군가와 나누고 싶어 한다.", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "11px",
      color: "#aab6a5",
    }).setDepth(31);

    this.controls = new GameInput(this);

    this.input.on("pointerdown", this.handlePointer, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off("pointerdown", this.handlePointer, this);
      this.clearBullets();
      this.clearMenu();
    });
    this.cameras.main.fadeIn(280, 0, 0, 0);
  }

  update(_time: number, delta: number): void {
    if (this.finishing) return;
    if (this.mode === "dodge") {
      this.updateDodge(delta);
      return;
    }

    if (this.mode === "intro" || this.mode === "response") {
      if (this.confirmPressed()) {
        if (this.mode === "intro") this.drawMainMenu();
        else if (this.finishAfterResponse) this.finish();
        else if (this.pendingDodge) this.beginDodge();
        else this.drawMainMenu();
      }
      return;
    }

    if (this.controls.justPressed("CANCEL") && this.mode === "act") {
      this.drawMainMenu();
      return;
    }

    const upPressed = this.controls.justPressed("UP");
    const downPressed = this.controls.justPressed("DOWN");
    const leftPressed = this.controls.justPressed("LEFT");
    const rightPressed = this.controls.justPressed("RIGHT");
    const up = upPressed || leftPressed;
    const down = downPressed || rightPressed;
    if (up) {
      if (this.mode === "main") this.menuIndex = (this.menuIndex + OPTIONS.length - 1) % OPTIONS.length;
      else this.actIndex = (this.actIndex + NERDSTABLOOK_CONTENT.actOptions.length - 1) % NERDSTABLOOK_CONTENT.actOptions.length;
      this.mode === "main" ? this.drawMainMenu() : this.drawActMenu();
    } else if (down) {
      if (this.mode === "main") this.menuIndex = (this.menuIndex + 1) % OPTIONS.length;
      else this.actIndex = (this.actIndex + 1) % NERDSTABLOOK_CONTENT.actOptions.length;
      this.mode === "main" ? this.drawMainMenu() : this.drawActMenu();
    } else if (this.confirmPressed()) {
      this.confirmSelection();
    }
  }

  private confirmPressed(): boolean {
    return this.controls.justPressed("CONFIRM");
  }

  private handlePointer(): void {
    if (this.mode === "intro") this.drawMainMenu();
    else if (this.mode === "response") {
      if (this.finishAfterResponse) this.finish();
      else if (this.pendingDodge) this.beginDodge();
      else this.drawMainMenu();
    }
  }

  private drawMainMenu(): void {
    this.mode = "main";
    this.pendingDodge = false;
    this.clearMenu();
    this.message?.destroy();
    const captions = ["대응하기", "만화 이야기", "소지품", this.positiveActs >= 2 ? "MERCY · 가능" : "MERCY · 아직"];
    OPTIONS.forEach((command, index) => {
      const x = 138 + index * 218;
      const selected = index === this.menuIndex;
      const card = this.add.rectangle(x, 450, 184, 60, selected ? 0x3e514a : 0x192a31, 0.98)
        .setStrokeStyle(selected ? 2 : 1, selected ? 0xe2c78f : 0x65776f, 0.8)
        .setDepth(34)
        .setInteractive({ useHandCursor: true });
      const title = this.add.text(x, 438, command, {
        fontFamily: "Georgia, serif",
        fontSize: "16px",
        fontStyle: "bold",
        color: selected ? "#f1e4c3" : "#c0c6bc",
      }).setOrigin(0.5).setDepth(35);
      const sub = this.add.text(x, 464, captions[index] ?? "", {
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: "10px",
        color: selected ? "#e4d2ad" : "#9aa89c",
      }).setOrigin(0.5).setDepth(35);
      card.on("pointerdown", () => {
        this.menuIndex = index;
        this.confirmSelection();
      });
      this.menuObjects.push(card, title, sub);
    });
    this.message = this.add.text(480, 354, "그가 좋아하는 것을 조심스럽게 물어볼 수 있다.", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "14px",
      color: "#e9dfcc",
      align: "center",
    }).setOrigin(0.5).setDepth(31);
    this.hint?.setText("↑↓ 선택 · Z / ENTER 확정 · ACT에서 X / SHIFT 취소");
  }

  private drawActMenu(): void {
    this.mode = "act";
    this.clearMenu();
    this.message?.destroy();
    NERDSTABLOOK_CONTENT.actOptions.forEach((option, index) => {
      const y = 356 + index * 26;
      const selected = index === this.actIndex;
      const text = this.add.text(90, y, (selected ? "▶ " : "  ") + option.label, {
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: "13px",
        color: selected ? "#f0d58f" : "#c5cbbf",
      }).setDepth(35).setInteractive({ useHandCursor: true });
      text.on("pointerdown", () => {
        this.actIndex = index;
        this.confirmSelection();
      });
      this.menuObjects.push(text);
    });
    this.message = this.add.text(480, 322, "말을 고르기 전에 그의 표정을 살펴보자.", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "13px",
      color: "#e2d7c2",
      align: "center",
    }).setOrigin(0.5).setDepth(31);
    this.hint?.setText("↑↓ 선택 · Z / ENTER 확정 · ESC 돌아가기");
  }

  private confirmSelection(): void {
    if (this.mode === "act") {
      const option = NERDSTABLOOK_CONTENT.actOptions[this.actIndex];
      if (!option) return;
      if (option.positive) {
        this.positiveActs += 1;
        const line = option.response + (this.negativeActs > 0 ? "\n그는 조심스럽게 당신의 말을 다시 믿어 보려 한다." : "");
        if (this.positiveActs >= 2) {
          this.showResponse(line + "\n\n" + NERDSTABLOOK_CONTENT.positiveEnding.join("\n"), false);
          this.finishAfterResponse = true;
        } else {
          this.showResponse(line, true);
        }
      } else {
        this.negativeActs += 1;
        this.showResponse(option.response + "\n" + NERDSTABLOOK_CONTENT.negativePattern.join("\n"), true);
      }
      return;
    }

    switch (OPTIONS[this.menuIndex]) {
      case "FIGHT":
        this.fightCount += 1;
        this.student.setAngle(this.fightCount % 2 === 0 ? 3 : -3);
        if (this.fightCount >= 3) {
          this.showResponse(NERDSTABLOOK_CONTENT.fakeDurabilityEnding.join("\n"), false);
          this.finishAfterResponse = true;
          this.status?.setText("그는 더는 아픈 척하지 않고 차분히 설명한다.");
        } else {
          const response = NERDSTABLOOK_CONTENT.fightResponses[this.fightCount - 1] ?? NERDSTABLOOK_CONTENT.fightResponses[0];
          this.showResponse(response, true);
        }
        break;
      case "ACT":
        this.actIndex = 0;
        this.drawActMenu();
        break;
      case "ITEM":
        this.showResponse("지금 건넬 만한 물건은 없다. 그는 자신의 책을 품에 꼭 안고 있다.", false);
        break;
      case "MERCY":
        if (this.positiveActs >= 2) {
          this.showResponse(NERDSTABLOOK_CONTENT.positiveEnding.join("\n"), false);
          this.finishAfterResponse = true;
        } else {
          this.showResponse("그는 아직 이야기를 멈추고 싶지 않은 듯하다.", false);
        }
        break;
    }
  }

  private finishAfterResponse = false;

  private showResponse(text: string, dodge: boolean): void {
    this.mode = "response";
    this.pendingDodge = dodge;
    this.clearMenu();
    this.message?.destroy();
    this.message = this.add.text(480, 352, text, {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "14px",
      color: "#f1e8d5",
      align: "center",
      wordWrap: { width: 790 },
      lineSpacing: 7,
    }).setOrigin(0.5).setDepth(31);
    this.hint?.setText(dodge ? "Z / ENTER  —  다음 반응을 살핀다" : "Z / ENTER  —  계속");
  }

  private beginDodge(): void {
    if (this.finishAfterResponse) {
      this.finish();
      return;
    }
    this.mode = "dodge";
    this.pendingDodge = false;
    this.clearMenu();
    this.message?.destroy();
    this.player = this.add.image(480, 300, "battle-marker").setDisplaySize(24, 24).setDepth(38);
    this.add.rectangle(480, 304, 340, 132, 0x08151e, 0.98)
      .setStrokeStyle(2, 0xb9a681, 0.9)
      .setDepth(36);
    this.waveElapsed = 0;
    this.spawnElapsed = 0;
    this.patternIndex = 0;
    this.hint?.setText("방향키 / WASD로 종이 문양 사이를 움직이자.");
    this.status?.setText(this.negativeActs >= 2 ? "책장 사이의 종이 문양이 더 바빠졌다." : "종이 문양의 이동 경로를 살펴보자.");
  }

  private updateDodge(delta: number): void {
    const dt = Math.min(delta, 40) / 1000;
    this.waveElapsed += delta;
    this.spawnElapsed += delta;
    const pace = this.negativeActs >= 2 ? 1.5 : 1;
    let dx = 0;
    let dy = 0;
    if (this.controls.isDown("LEFT")) dx -= 1;
    if (this.controls.isDown("RIGHT")) dx += 1;
    if (this.controls.isDown("UP")) dy -= 1;
    if (this.controls.isDown("DOWN")) dy += 1;
    if (this.player && (dx || dy)) {
      const length = Math.hypot(dx, dy) || 1;
      this.player.x = Phaser.Math.Clamp(this.player.x + (dx / length) * 210 * dt, 324, 636);
      this.player.y = Phaser.Math.Clamp(this.player.y + (dy / length) * 190 * dt, 248, 360);
    }

    if (this.spawnElapsed >= 560 / pace) {
      this.spawnElapsed = 0;
      this.spawnPaperGlyph();
    }

    const remaining: Bullet[] = [];
    for (const bullet of this.bullets) {
      bullet.object.x += bullet.vx * dt;
      bullet.object.y += bullet.vy * dt;
      if (this.player && Phaser.Math.Distance.Between(this.player.x, this.player.y, bullet.object.x, bullet.object.y) < 19 &&
          this.time.now - this.lastHitAt > 700) {
        this.lastHitAt = this.time.now;
        bullet.object.destroy();
        this.player.setAlpha(0.42);
        this.tweens.add({ targets: this.player, alpha: 1, duration: 320, ease: "Sine.InOut" });
        this.status?.setText("종이 문양이 스쳤다. 다시 움직일 수 있다.");
      } else if (bullet.object.x > 300 && bullet.object.x < 660 && bullet.object.y > 220 && bullet.object.y < 390) {
        remaining.push(bullet);
      } else {
        bullet.object.destroy();
      }
    }
    this.bullets = remaining;

    if (this.waveElapsed >= (this.negativeActs >= 2 ? 2600 : 2100)) {
      this.clearBullets();
      this.player?.destroy();
      this.player = undefined;
      if (this.finishAfterResponse) this.finish();
      else this.drawMainMenu();
    }
  }

  private spawnPaperGlyph(): void {
    const fromLeft = this.patternIndex % 2 === 0;
    const x = fromLeft ? 310 : 650;
    const y = 250 + (this.patternIndex % 4) * 30;
    const object = this.add.circle(x, y, 7 + (this.patternIndex % 2) * 2, 0xc9b99a, 0.9)
      .setStrokeStyle(1, 0xf3e5c8, 0.65)
      .setDepth(37);
    this.bullets.push({ object, vx: fromLeft ? 155 : -155, vy: (this.patternIndex % 3 - 1) * 22 });
    this.patternIndex += 1;
  }

  private finish(): void {
    if (this.finishing) return;
    this.finishing = true;
    GameSession.resolveNerdstablook(this.positiveActs >= 2);
    this.mode = "ending";
    this.clearBullets();
    this.clearMenu();
    this.student.setAngle(0);
    this.tweens.add({
      targets: this.student,
      x: 870,
      alpha: 0.12,
      duration: 720,
      ease: "Cubic.In",
      onComplete: () => this.scene.start("WelfareCorridorScene"),
    });
  }

  private clearBullets(): void {
    this.bullets.forEach((bullet) => bullet.object.destroy());
    this.bullets = [];
  }

  private clearMenu(): void {
    this.menuObjects.forEach((object) => object.destroy());
    this.menuObjects = [];
  }
}
