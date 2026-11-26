import Phaser from "phaser";
import { GameInput } from "../input/GameInput";
import { drawEncounterCommandRow, drawEncounterChoiceList } from "../ui/EncounterMenu";
import {
  WELFARE_REGULAR_ENCOUNTERS,
  type WelfareRegularEnemyId,
  type WelfareEncounterOutcome,
} from "../data/welfareEncounterContent";
import { GameSession } from "../state/GameSession";

type Mode = "intro" | "main" | "act" | "response" | "dodge" | "ending";
type Bullet = {
  object: Phaser.GameObjects.Arc;
  velocityX: number;
  velocityY: number;
};
type SceneInput = { enemyId: WelfareRegularEnemyId; withCompanion?: boolean };

const MAIN_OPTIONS = ["FIGHT", "ACT", "ITEM", "MERCY"];

export class RegularEncounterScene extends Phaser.Scene {
  private enemyId: WelfareRegularEnemyId = "timidPeer";
  private withCompanion = false;
  private mode: Mode = "intro";
  private controls!: GameInput;
  private menuIndex = 0;
  private actIndex = 0;
  private actProgress = 0;
  private seenActs = new Set<string>();
  private fightCount = 0;
  private hitCount = 0;
  private bullets: Bullet[] = [];
  private player?: Phaser.GameObjects.Image;
  private enemy?: Phaser.GameObjects.Image;
  private message?: Phaser.GameObjects.Text;
  private hint?: Phaser.GameObjects.Text;
  private status?: Phaser.GameObjects.Text;
  private menuObjects: Phaser.GameObjects.GameObject[] = [];
  private waveElapsed = 0;
  private spawnElapsed = 0;
  private bulletIndex = 0;
  private lastHitAt = 0;
  private intensity = 1;
  private ending = false;

  constructor() {
    super("RegularEncounterScene");
  }

  init(data: SceneInput): void {
    this.enemyId = data?.enemyId ?? "timidPeer";
    this.withCompanion = Boolean(data?.withCompanion);
    this.mode = "intro";
    this.menuIndex = 0;
    this.actIndex = 0;
    this.actProgress = 0;
    this.seenActs.clear();
    this.fightCount = 0;
    this.hitCount = 0;
    this.intensity = this.withCompanion ? 1.25 : 1;
    this.ending = false;
  }

  create(): void {
    const enemy = WELFARE_REGULAR_ENCOUNTERS[this.enemyId];
    this.add.image(480, 270, "welfare-corridor").setDisplaySize(960, 540).setAlpha(0.58);
    this.add.rectangle(480, 270, 960, 540, 0x07151c, 0.6);

    this.add.text(48, 28, "교육복지반 · 일반 조우", {
      fontFamily: "'Noto Serif KR', serif",
      fontSize: "17px",
      color: "#e4d4b1",
    }).setDepth(20);

    this.enemy = this.add.image(this.withCompanion ? 430 : 480, 166, enemy.textureKey)
      .setDisplaySize(this.withCompanion ? 118 : 124, this.withCompanion ? 96 : 124)
      .setDepth(18);

    if (this.withCompanion) {
      this.add.image(548, 168, enemy.textureKey).setDisplaySize(82, 82).setAlpha(0.7).setDepth(17);
      this.add.text(480, 249, "함께 나타났다", {
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: "11px",
        color: "#d5c7a7",
      }).setOrigin(0.5).setDepth(19);
    }

    this.add.rectangle(480, 305, 360, 150, 0x0a171e, 0.78)
      .setStrokeStyle(2, 0x9ca88f, 0.88)
      .setDepth(25);
    this.add.rectangle(480, 305, 344, 134, 0x182c32, 0.46)
      .setStrokeStyle(1, 0x60756c, 0.72)
      .setDepth(25);

    this.add.text(480, 46, enemy.name, {
      fontFamily: "'Noto Serif KR', serif",
      fontSize: "19px",
      color: "#f0e2c2",
      stroke: "#162b32",
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(21);

    this.message = this.add.text(480, 383, enemy.intro.join("\n"), {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "15px",
      color: "#f0ead9",
      align: "center",
      wordWrap: { width: 760 },
      lineSpacing: 8,
    }).setOrigin(0.5).setDepth(31);

    this.hint = this.add.text(878, 486, "Z / ENTER  —  계속", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#dfc994",
    }).setOrigin(1, 0.5).setDepth(31);

    this.status = this.add.text(40, 486, "행동을 살피고 상대의 태도를 이해해 보자.", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "11px",
      color: "#9dac9e",
    }).setDepth(31);

    this.controls = new GameInput(this);

    this.input.on("pointerdown", this.handlePointerAdvance, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off("pointerdown", this.handlePointerAdvance, this);
      this.clearBullets();
      this.clearMenu();
      this.message?.destroy();
      this.hint?.destroy();
    });
    this.cameras.main.fadeIn(220, 0, 0, 0);
  }

  update(_time: number, delta: number): void {
    if (this.ending) return;
    if (this.mode === "dodge") {
      this.updateDodge(delta);
      return;
    }

    if (this.mode === "intro" || this.mode === "response") {
      if (this.justConfirm()) {
        if (this.mode === "intro") {
          this.drawMainMenu();
        } else if (this.withdrawAfterResponse) {
          this.returnToCorridor();
        } else if (this.pendingDodge) {
          this.beginDodge();
        } else {
          this.drawMainMenu();
        }
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
      if (this.mode === "main") this.menuIndex = (this.menuIndex + MAIN_OPTIONS.length - 1) % MAIN_OPTIONS.length;
      else this.actIndex = (this.actIndex + this.currentActOptions().length - 1) % this.currentActOptions().length;
      this.mode === "main" ? this.drawMainMenu() : this.drawActMenu();
    } else if (down) {
      if (this.mode === "main") this.menuIndex = (this.menuIndex + 1) % MAIN_OPTIONS.length;
      else this.actIndex = (this.actIndex + 1) % this.currentActOptions().length;
      this.mode === "main" ? this.drawMainMenu() : this.drawActMenu();
    } else if (this.justConfirm()) {
      this.confirmSelection();
    }
  }

  private justConfirm(): boolean {
    return this.controls.justPressed("CONFIRM");
  }

  private handlePointerAdvance(): void {
    if (this.ending) return;
    if (this.mode === "intro") {
      this.drawMainMenu();
    } else if (this.mode === "response") {
      if (this.withdrawAfterResponse) this.returnToCorridor();
      else if (this.pendingDodge) this.beginDodge();
      else this.drawMainMenu();
    }
  }

  private currentActOptions() {
    return WELFARE_REGULAR_ENCOUNTERS[this.enemyId].actOptions;
  }

  private drawMainMenu(): void {
    this.mode = "main";
    this.clearMenu();
    this.message?.destroy();
    const enemy = WELFARE_REGULAR_ENCOUNTERS[this.enemyId];
    const labels = ["대응하기", "상황 살피기", "소지품", this.actProgress >= enemy.resolveAt ? "MERCY · 가능" : "MERCY · 아직"];
    const items = MAIN_OPTIONS.map((command, index) => ({
      label: command,
      subtitle: labels[index] ?? "",
      muted: index === 3 && this.actProgress < enemy.resolveAt,
    }));
    this.menuObjects.push(...drawEncounterCommandRow(
      this,
      items,
      this.menuIndex,
      (index) => {
        this.menuIndex = index;
        this.confirmSelection();
      },
      { centerX: 465, centerY: 449, cardWidth: 184, cardHeight: 60, gap: 34, depth: 34 },
    ));
    this.message = this.add.text(480, 300, "이 조우는 상대의 태도에 맞는 행동으로 해결할 수 있다.", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "14px",
      color: "#e6dfcb",
      align: "center",
      wordWrap: { width: 760 },
    }).setOrigin(0.5).setDepth(31);
    this.hint?.setText("↑↓ 선택 · Z / ENTER 확정 · ACT에서 X / SHIFT 취소");
  }

  private drawActMenu(): void {
    this.mode = "act";
    this.clearMenu();
    this.message?.destroy();
    this.message = this.add.text(480, 300, "상대의 태도에 맞는 행동을 골라 보자.", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "14px",
      color: "#e8dfcb",
      align: "center",
      wordWrap: { width: 760 },
    }).setOrigin(0.5).setDepth(31);

    this.menuObjects.push(...drawEncounterChoiceList(
      this,
      this.currentActOptions().map((option) => option.label),
      this.actIndex,
      (index) => {
        this.actIndex = index;
        this.confirmSelection();
      },
      { left: 80, top: 375, width: 800, rowHeight: 28, fontSize: "14px", depth: 35 },
    ));
    this.hint?.setText("↑↓ 선택 · Z / ENTER 확정 · ESC 돌아가기");
  }

  private confirmSelection(): void {
    if (this.mode === "act") {
      const choice = this.currentActOptions()[this.actIndex];
      if (!choice) return;
      const alreadySeen = this.seenActs.has(choice.id);
      this.seenActs.add(choice.id);
      if (!alreadySeen && choice.advances) this.actProgress += 1;
      const response = alreadySeen ? choice.repeatResponse : choice.response;
      const enemy = WELFARE_REGULAR_ENCOUNTERS[this.enemyId];
      if (this.actProgress >= enemy.resolveAt) {
        this.showResponse(response + "\n\n" + enemy.mercyReady, false);
      } else {
        this.showResponse(response, true);
      }
      return;
    }

    switch (MAIN_OPTIONS[this.menuIndex]) {
      case "FIGHT":
        this.fightCount += 1;
        this.intensity = Math.min(1.65, 1 + this.fightCount * 0.16);
        this.showResponse(
          WELFARE_REGULAR_ENCOUNTERS[this.enemyId].fightResponses[
            Math.min(this.fightCount - 1, WELFARE_REGULAR_ENCOUNTERS[this.enemyId].fightResponses.length - 1)
          ] ?? "상대는 거리를 둔다.",
          true,
        );
        if (this.fightCount >= 3) this.status?.setText("상대가 더는 대화를 이어가기 어려워한다.");
        break;
      case "ACT":
        this.actIndex = 0;
        this.drawActMenu();
        break;
      case "ITEM":
        this.useItem();
        break;
      case "MERCY":
        this.resolveMercy();
        break;
    }
  }

  private useItem(): void {
    const session = GameSession.get();
    if (session.hasWarmTea && GameSession.useWarmTea()) {
      this.showResponse("따뜻한 차를 마셨다. 숨을 고르고 다시 주변을 살핀다.", true);
    } else {
      this.showResponse("지금 사용할 수 있는 물건은 없다.", false);
    }
  }

  private showResponse(text: string, launchDodge: boolean): void {
    this.mode = "response";
    this.clearMenu();
    this.message?.destroy();
    this.message = this.add.text(480, 300, text, {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "15px",
      color: "#f0e8d6",
      align: "center",
      wordWrap: { width: 780 },
      lineSpacing: 8,
    }).setOrigin(0.5).setDepth(31);
    if (launchDodge) {
      this.hint?.setText("Z / ENTER  —  상대의 다음 반응을 살핀다");
      this.pendingDodge = true;
    } else {
      this.hint?.setText("Z / ENTER  —  메뉴로 돌아가기");
      this.pendingDodge = false;
    }
  }

  private pendingDodge = false;

  private beginDodge(): void {
    this.mode = "dodge";
    this.pendingDodge = false;
    this.clearMenu();
    this.message?.destroy();
    this.hint?.setText("방향키 / WASD로 움직이자. 부딪혀도 진행은 계속된다.");
    this.status?.setText(WELFARE_REGULAR_ENCOUNTERS[this.enemyId].attackHint);
    this.waveElapsed = 0;
    this.spawnElapsed = 0;
    this.bulletIndex = 0;
    this.clearBullets();

    const arena = this.add.rectangle(480, 305, 340, 148, 0x08151d, 0.98)
      .setStrokeStyle(2, 0xb3a27e, 0.92)
      .setDepth(36);
    this.menuObjects.push(arena);
    this.player = this.add.image(480, 305, "battle-marker")
      .setDisplaySize(24, 24)
      .setDepth(38);
  }

  private updateDodge(delta: number): void {
    const enemy = WELFARE_REGULAR_ENCOUNTERS[this.enemyId];
    const dt = Math.min(delta, 40) / 1000;
    this.waveElapsed += delta;
    this.spawnElapsed += delta;

    let dx = 0;
    let dy = 0;
    if (this.controls.isDown("LEFT")) dx -= 1;
    if (this.controls.isDown("RIGHT")) dx += 1;
    if (this.controls.isDown("UP")) dy -= 1;
    if (this.controls.isDown("DOWN")) dy += 1;
    if (this.player && (dx || dy)) {
      const length = Math.hypot(dx, dy) || 1;
      this.player.x = Phaser.Math.Clamp(this.player.x + (dx / length) * 205 * dt, 326, 634);
      this.player.y = Phaser.Math.Clamp(this.player.y + (dy / length) * 190 * dt, 244, 366);
    }

    if (this.spawnElapsed >= enemy.patternIntervalMs / this.intensity) {
      this.spawnElapsed = 0;
      this.spawnPattern(enemy.pattern);
    }

    const remaining: Bullet[] = [];
    for (const bullet of this.bullets) {
      bullet.object.x += bullet.velocityX * dt;
      bullet.object.y += bullet.velocityY * dt;
      bullet.object.rotation += dt * (bullet.velocityX >= 0 ? 0.65 : -0.65);
      if (this.player && Phaser.Math.Distance.Between(this.player.x, this.player.y, bullet.object.x, bullet.object.y) < 20 &&
          this.time.now - this.lastHitAt > 650) {
        this.lastHitAt = this.time.now;
        this.hitCount += 1;
        bullet.object.destroy();
        this.player.setAlpha(0.4);
        this.tweens.add({ targets: this.player, alpha: 1, duration: 330, ease: "Sine.InOut" });
        this.status?.setText("리듬에 잠깐 휩쓸렸다. 다시 움직일 수 있다.");
      } else if (bullet.object.x > 300 && bullet.object.x < 660 && bullet.object.y > 220 && bullet.object.y < 390) {
        remaining.push(bullet);
      } else {
        bullet.object.destroy();
      }
    }
    this.bullets = remaining;

    if (this.waveElapsed >= enemy.patternDurationMs) {
      this.finishDodge();
    }
  }

  private spawnPattern(pattern: string): void {
    const center = 480;
    const index = this.bulletIndex++;
    if (pattern === "drift") {
      const y = 250 + (index % 4) * 34;
      this.spawnGlyph(654, y, -115 - this.intensity * 20, index % 2 === 0 ? 12 : -12, 0xc4b48b, 7);
      if (index % 2 === 0) this.spawnGlyph(306, y + 18, 105, -9, 0x8ba69b, 6);
    } else if (pattern === "rhythm") {
      const x = 350 + (index % 4) * 82;
      const direction = index % 2 === 0 ? 1 : -1;
      this.spawnGlyph(x, direction > 0 ? 230 : 382, 0, direction * 115, 0xb4a4c6, 7);
    } else if (pattern === "sweep") {
      const y = 245 + (index % 3) * 43;
      const fromLeft = index % 2 === 0;
      this.spawnGlyph(fromLeft ? 302 : 658, y, fromLeft ? 155 : -155, 0, 0x9db6ad, 8);
    } else if (pattern === "fall") {
      const x = 350 + (index % 5) * 65;
      this.spawnGlyph(x, 226, (index % 2 === 0 ? 1 : -1) * 22, 118 + this.intensity * 14, 0xc3c987, 7);
    } else {
      const fromLeft = index % 2 === 0;
      const x = fromLeft ? 302 : 658;
      this.spawnGlyph(x, 270 + (index % 3) * 30, fromLeft ? 145 : -145, 18, 0xb9c1aa, 7);
      this.spawnGlyph(fromLeft ? 658 : 302, 300 - (index % 3) * 24, fromLeft ? -145 : 145, -16, 0x9cabb3, 7);
    }
    if (this.withCompanion && pattern === "echo" && index % 2 === 0) {
      this.spawnGlyph(center, 236, 0, 138, 0xe1c995, 5);
    }
  }

  private spawnGlyph(x: number, y: number, vx: number, vy: number, color: number, radius: number): void {
    const object = this.add.circle(x, y, radius, color, 0.88)
      .setStrokeStyle(1, 0xf0e4c4, 0.62)
      .setDepth(37);
    this.bullets.push({ object, velocityX: vx, velocityY: vy });
  }

  private finishDodge(): void {
    this.clearBullets();
    this.player?.destroy();
    this.player = undefined;
    this.menuObjects.forEach((object) => object.destroy());
    this.menuObjects = [];
    const enemy = WELFARE_REGULAR_ENCOUNTERS[this.enemyId];

    if (this.fightCount >= 3) {
      this.message?.destroy();
      this.message = this.add.text(480, 300, enemy.withdrewExit.join("\n"), {
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: "15px",
        color: "#f0e8d6",
        align: "center",
        wordWrap: { width: 780 },
        lineSpacing: 8,
      }).setOrigin(0.5).setDepth(31);
      this.status?.setText("상대는 더 이야기하지 않고 통로 가장자리로 물러났다.");
      this.hint?.setText("Z / ENTER  —  복도로 돌아가기");
      this.mode = "response";
      this.pendingDodge = false;
      this.withdrawAfterResponse = true;
      return;
    }

    this.mode = "response";
    this.pendingDodge = false;
    this.withdrawAfterResponse = false;
    this.message?.destroy();
    this.message = this.add.text(480, 300,
      this.hitCount > 0 ? "상대의 반응이 잦아들었다. 조금 전의 행동을 다시 생각해 보자." : "모든 빛무늬가 지나갔다. 이제 다시 선택할 수 있다.",
      {
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: "15px",
        color: "#f0e8d6",
        align: "center",
        wordWrap: { width: 780 },
      },
    ).setOrigin(0.5).setDepth(31);
    this.hint?.setText("Z / ENTER  —  메뉴로 돌아가기");
  }

  private withdrawAfterResponse = false;

  private resolveMercy(): void {
    const enemy = WELFARE_REGULAR_ENCOUNTERS[this.enemyId];
    if (this.actProgress < enemy.resolveAt) {
      this.showResponse("아직 상대가 마음을 놓지 않았다. 다른 행동을 살펴보자.", false);
      return;
    }
    this.finish("peaceful", enemy.peacefulExit);
  }

  private finish(outcome: WelfareEncounterOutcome, lines: readonly string[]): void {
    if (this.ending) return;
    this.ending = true;
    this.mode = "ending";
    this.clearMenu();
    this.message?.destroy();
    this.message = this.add.text(480, 300, lines.join("\n"), {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "15px",
      color: "#f1ead8",
      align: "center",
      wordWrap: { width: 780 },
      lineSpacing: 8,
    }).setOrigin(0.5).setDepth(31);
    this.hint?.setText("Z / ENTER  —  복도로 돌아가기");
    this.input.keyboard?.once("keydown-Z", () => this.returnToCorridor(outcome));
    this.input.keyboard?.once("keydown-ENTER", () => this.returnToCorridor(outcome));
    this.input.keyboard?.once("keydown-SPACE", () => this.returnToCorridor(outcome));
    this.input.once("pointerdown", () => this.returnToCorridor(outcome));
  }

  private returnToCorridor(outcome?: WelfareEncounterOutcome): void {
    if (outcome) GameSession.recordWelfareEncounter(this.enemyId, outcome);
    else if (this.withdrawAfterResponse) GameSession.recordWelfareEncounter(this.enemyId, "withdrew");
    this.scene.start("WelfareCorridorScene");
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
