import Phaser from "phaser";
import { GameInput } from "../input/GameInput";
import { drawEncounterCommandRow, drawEncounterChoiceList, drawEncounterPanel } from "../ui/EncounterMenu";
import { PROTOTYPE_SETTINGS } from "../data/prototypeContent";
import { GameSession } from "../state/GameSession";

type BattleMode = "main" | "act" | "item" | "dodge";

type Bullet = {
  object: Phaser.GameObjects.Arc;
  velocityX: number;
  velocityY: number;
};

const MAIN_OPTIONS = ["FIGHT", "ACT", "ITEM", "MERCY"];
const ACT_OPTIONS = [
  "내 진로는 내가 선택하고 싶어요.",
  "선생님이 걱정하는 이유를 듣고 싶어요.",
  "걱정은 고맙지만, 결정은 제가 할게요.",
];

export class BattleScene extends Phaser.Scene {
  private mode: BattleMode = "main";
  private mainIndex = 0;
  private subIndex = 0;
  private controls!: GameInput;
  private menuTexts: Phaser.GameObjects.GameObject[] = [];
  private uiObjects: Phaser.GameObjects.GameObject[] = [];
  private bullets: Bullet[] = [];
  private dodgePlayer?: Phaser.GameObjects.Text;
  private battleInfo!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private playerX = 480;
  private playerY = 316;
  private dodgeElapsed = 0;
  private spawnElapsed = 0;
  private bulletIndex = 0;
  private lastHitAt = 0;
  private ending = false;

  constructor() {
    super("BattleScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#151b20");
    this.drawBattleBackdrop();

    this.controls = new GameInput(this);

    this.add.text(480, 34, "도미토리엘 선생님과의 대립", {
      fontFamily: "serif",
      fontSize: "24px",
      color: "#f1ead7",
    }).setOrigin(0.5);

    this.add.text(480, 70, "서로의 목적이 부딪히는 대화와 경쟁 · PROTOTYPE", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#8e9f96",
    }).setOrigin(0.5);

    this.drawDomitoriellPortrait();
    drawEncounterPanel(this, { centerX: 480, centerY: 245, width: 820, height: 92, depth: 10, fillColor: 0x101e24, fillAlpha: 0.88 });
    this.battleInfo = this.add.text(480, 245, "", {
      fontFamily: "sans-serif",
      fontSize: "16px",
      color: "#d9d9c9",
      align: "center",
      wordWrap: { width: 660 },
      lineSpacing: 8,
    }).setOrigin(0.5).setDepth(11);
    this.battleInfo.setText("도미토리엘은 걱정스러운 눈으로 당신을 바라본다.\n당신이 원하는 길을 포기하길 바라지는 않지만, 쉽게 보내줄 수도 없다.");

    this.statusText = this.add.text(480, 388, "", {
      fontFamily: "sans-serif",
      fontSize: "14px",
      color: "#e3c77f",
      align: "center",
    }).setOrigin(0.5);

    this.drawMainMenu();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.clearBullets();
      this.clearUiObjects();
    });
  }

  update(_time: number, delta: number): void {
    if (this.ending) return;

    if (this.mode === "dodge") {
      this.updateDodge(delta);
      return;
    }

    if (this.controls.justPressed("CANCEL") && this.mode !== "main") {
      this.mode = "main";
      this.subIndex = 0;
      this.drawMainMenu();
      return;
    }

    const upPressed = this.controls.justPressed("UP");
    const downPressed = this.controls.justPressed("DOWN");
    const leftPressed = this.controls.justPressed("LEFT");
    const rightPressed = this.controls.justPressed("RIGHT");
    if (upPressed || leftPressed) {
      this.moveSelection(-1);
    } else if (downPressed || rightPressed) {
      this.moveSelection(1);
    } else if (this.controls.justPressed("CONFIRM")) {
      this.confirmSelection();
    }
  }

  private drawBattleBackdrop(): void {
    const g = this.add.graphics();
    g.fillStyle(0x202d31, 1).fillRect(0, 0, 960, 540);
    g.fillStyle(0x29383c, 1).fillRect(0, 0, 960, 345);
    g.lineStyle(1, 0x627269, 0.35);
    for (let x = 0; x < 960; x += 64) g.lineBetween(x, 0, x, 340);
    for (let y = 30; y < 340; y += 48) g.lineBetween(0, y, 960, y);
    g.fillStyle(0x10151b, 1).fillRect(0, 420, 960, 120);
    g.lineStyle(2, 0xb6a77a, 0.8).strokeRect(20, 432, 920, 94);
    g.fillStyle(0x11191d, 0.9).fillRect(30, 442, 900, 74);
  }

  private drawDomitoriellPortrait(): void {
    // Reuse the established character artwork instead of a one-off placeholder drawing.
    this.add.image(480, 150, "character-domitoriell")
      .setDisplaySize(112, 153)
      .setDepth(12);
  }

  private moveSelection(direction: number): void {
    if (this.mode === "main") {
      this.mainIndex = (this.mainIndex + direction + MAIN_OPTIONS.length) % MAIN_OPTIONS.length;
      this.drawMainMenu();
      return;
    }

    const length = this.mode === "act" ? ACT_OPTIONS.length : 2;
    this.subIndex = (this.subIndex + direction + length) % length;
    this.drawSubMenu();
  }

  private confirmSelection(): void {
    if (this.mode === "main") {
      switch (MAIN_OPTIONS[this.mainIndex]) {
        case "FIGHT":
          this.battleInfo.setText("당신은 물러서지 않겠다는 뜻을 보였다.\n도미토리엘은 당신의 마음을 확인하려는 듯 조용히 손을 든다.");
          this.statusText.setText("대립의 의사를 전달했다.");
          this.beginDodge();
          break;
        case "ACT":
          this.mode = "act";
          this.subIndex = 0;
          this.drawSubMenu();
          break;
        case "ITEM":
          this.mode = "item";
          this.subIndex = 0;
          this.drawSubMenu();
          break;
        case "MERCY":
          this.tryMercy();
          break;
      }
      return;
    }

    if (this.mode === "act") {
      this.chooseAct(this.subIndex);
      return;
    }

    if (this.mode === "item") {
      this.chooseItem(this.subIndex);
    }
  }

  private drawMainMenu(): void {
    this.clearMenuTexts();
    this.mode = "main";
    const session = GameSession.get();
    const items = MAIN_OPTIONS.map((name) => ({
      label: name,
      subtitle: name === "FIGHT" ? "대립" :
        name === "ACT" ? "상대 살피기" :
        name === "ITEM" ? "소지품" :
        readyMercy(session.determinationCount) ? "비폭력 해결 가능" : "비폭력 해결",
      muted: name === "MERCY" && !readyMercy(session.determinationCount),
    }));
    this.menuTexts.push(...drawEncounterCommandRow(
      this,
      items,
      this.mainIndex,
      (index) => {
        this.mainIndex = index;
        this.confirmSelection();
      },
      { centerX: 478, centerY: 476, cardWidth: 184, cardHeight: 58, gap: 38, depth: 40 },
    ));

    this.statusText.setText(
      "HP " + session.hp + "/" + session.maxHp +
      "     진로 선택 의지 " + session.determinationCount + "/" + PROTOTYPE_SETTINGS.mercyActsRequired,
    );
  }

  private drawSubMenu(): void {
    this.clearMenuTexts();
    const options = this.mode === "act"
      ? ACT_OPTIONS
      : ["따뜻한 차 사용", "돌아가기"];

    this.menuTexts.push(...drawEncounterChoiceList(
      this,
      options,
      this.subIndex,
      (index) => {
        this.subIndex = index;
        this.confirmSelection();
      },
      { left: 90, top: 440, width: 780, rowHeight: 28, fontSize: "15px", depth: 40 },
    ));

    if (this.mode === "act") {
      this.statusText.setText("↑↓ 선택 · Z / ENTER 확정 · X / SHIFT 취소");
    } else {
      const hasTea = GameSession.get().hasWarmTea;
      this.statusText.setText(hasTea ? "가방에 따뜻한 차가 있다." : "사용할 수 있는 아이템이 없다.");
    }
  }

  private clearMenuTexts(): void {
    for (const text of this.menuTexts) text.destroy();
    this.menuTexts = [];
  }

  private chooseAct(index: number): void {
    if (index === 1) {
      this.battleInfo.setText("도미토리엘은 잠시 말을 멈추고 당신의 이야기를 듣는다.\n그녀가 걱정하는 마음도 진심이라는 것을 알 수 있다.");
      this.statusText.setText("서로의 생각을 조금 더 이해했다.");
    } else {
      const count = GameSession.expressDetermination();
      this.battleInfo.setText(index === 0
        ? "당신은 자신의 진로를 직접 선택하고 싶다고 다시 말했다."
        : "당신은 걱정에 감사하면서도, 선택할 권리는 자신에게 있다고 전했다.");
      this.statusText.setText(
        "진로 선택 의지 " + count + "/" + PROTOTYPE_SETTINGS.mercyActsRequired +
        (count >= PROTOTYPE_SETTINGS.mercyActsRequired ? " · 자비를 선택할 수 있다." : ""),
      );
    }
    this.beginDodge();
  }

  private chooseItem(index: number): void {
    if (index === 1) {
      this.drawMainMenu();
      return;
    }

    if (!GameSession.useWarmTea()) {
      this.statusText.setText("가방에 사용할 수 있는 아이템이 없다.");
      this.time.delayedCall(900, () => this.drawMainMenu());
      return;
    }

    this.battleInfo.setText("따뜻한 차를 마셨다. 몸과 마음이 조금 편안해졌다.");
    this.statusText.setText("HP가 회복되었다.");
    this.beginDodge();
  }

  private tryMercy(): void {
    const required = PROTOTYPE_SETTINGS.mercyActsRequired;
    const count = GameSession.get().determinationCount;
    if (count < required) {
      this.battleInfo.setText("도미토리엘은 아직 걱정을 거두지 못했다.\n자신의 마음을 조금 더 전해 보자.");
      this.statusText.setText("ACT로 진로를 선택하고 싶은 마음을 다시 표현해 보자.");
      this.beginDodge();
      return;
    }

    this.ending = true;
    GameSession.resolveDomitoriellPeacefully();
    this.clearMenuTexts();
    this.battleInfo.setText("도미토리엘은 한참 당신을 바라보다가, 천천히 길을 비켜선다.");
    this.statusText.setText("평화적으로 대립을 해결했다.");
    this.time.delayedCall(1500, () => this.scene.start("RoomScene", { peaceResolved: true }));
  }

  private beginDodge(): void {
    this.mode = "dodge";
    this.clearMenuTexts();
    this.clearUiObjects();
    this.clearBullets();
    this.dodgeElapsed = 0;
    this.spawnElapsed = 0;
    this.bulletIndex = 0;
    this.playerX = 480;
    this.playerY = 316;

    const border = this.add.graphics().setDepth(50);
    border.fillStyle(0x080d10, 0.96).fillRect(278, 206, 404, 218);
    border.lineStyle(2, 0xb6a77a, 1).strokeRect(278, 206, 404, 218);
    border.lineStyle(1, 0x596e66, 0.7).strokeRect(286, 214, 388, 202);
    this.uiObjects.push(border);

    const title = this.add.text(480, 188, "걱정이 담긴 말들이 다가온다. 피해 보자.", {
      fontFamily: "sans-serif",
      fontSize: "14px",
      color: "#e0d3b3",
    }).setOrigin(0.5).setDepth(51);
    this.uiObjects.push(title);

    this.dodgePlayer = this.add.text(this.playerX, this.playerY, "♥", {
      fontFamily: "serif",
      fontSize: "25px",
      color: "#f2d58f",
      stroke: "#5a4832",
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(60);

    const hint = this.add.text(480, 438, "WASD / 방향키로 이동 · 패턴은 잠시 후 끝난다", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#b6a77a",
    }).setOrigin(0.5).setDepth(51);
    this.uiObjects.push(hint);

    this.statusText.setText("회피 패턴 진행 중 · HP " + GameSession.get().hp + "/" + GameSession.get().maxHp);
  }

  private updateDodge(delta: number): void {
    const dt = Math.min(delta, 40) / 1000;
    this.dodgeElapsed += delta;
    this.spawnElapsed += delta;

    let dx = 0;
    let dy = 0;
    if (this.controls.isDown("LEFT")) dx -= 1;
    if (this.controls.isDown("RIGHT")) dx += 1;
    if (this.controls.isDown("UP")) dy -= 1;
    if (this.controls.isDown("DOWN")) dy += 1;

    if (dx !== 0 || dy !== 0) {
      const length = Math.hypot(dx, dy) || 1;
      this.playerX = Phaser.Math.Clamp(this.playerX + (dx / length) * 220 * dt, 298, 662);
      this.playerY = Phaser.Math.Clamp(this.playerY + (dy / length) * 220 * dt, 226, 404);
      this.dodgePlayer?.setPosition(this.playerX, this.playerY);
    }

    if (this.spawnElapsed >= PROTOTYPE_SETTINGS.bulletIntervalMs) {
      this.spawnElapsed = 0;
      this.spawnBullet();
    }

    const remaining: Bullet[] = [];
    for (const bullet of this.bullets) {
      bullet.object.x += bullet.velocityX * dt;
      bullet.object.y += bullet.velocityY * dt;

      if (Math.hypot(this.playerX - bullet.object.x, this.playerY - bullet.object.y) <
          PROTOTYPE_SETTINGS.playerHitRadius + PROTOTYPE_SETTINGS.bulletRadius) {
        bullet.object.destroy();
        if (this.time.now - this.lastHitAt > 650) {
          this.lastHitAt = this.time.now;
          const session = GameSession.get();
          session.hp -= 1;
          if (session.hp <= 0) {
            // PROTOTYPE ONLY: restart the practice pattern without defining HP 0 lore.
            session.hp = session.maxHp;
            this.statusText.setText("패턴을 다시 연습한다. HP " + session.hp + "/" + session.maxHp);
          } else {
            this.statusText.setText("패턴에 닿았다. HP " + session.hp + "/" + session.maxHp);
          }
        }
      } else if (bullet.object.x >= 282 && bullet.object.x <= 678 &&
                 bullet.object.y >= 210 && bullet.object.y <= 420) {
        remaining.push(bullet);
      } else {
        bullet.object.destroy();
      }
    }
    this.bullets = remaining;

    if (this.dodgeElapsed >= PROTOTYPE_SETTINGS.battlePatternDurationMs) {
      this.finishDodge();
    }
  }

  private spawnBullet(): void {
    const lane = this.bulletIndex % 4;
    const y = 238 + lane * 46;
    const fromLeft = this.bulletIndex % 2 === 0;
    const x = fromLeft ? 292 : 668;
    const velocityX = fromLeft ? PROTOTYPE_SETTINGS.bulletSpeed : -PROTOTYPE_SETTINGS.bulletSpeed;
    const bullet = this.add.circle(x, y, PROTOTYPE_SETTINGS.bulletRadius, 0xe3c77f, 1)
      .setStrokeStyle(1, 0x6d6048, 1)
      .setDepth(55);
    this.bullets.push({ object: bullet, velocityX, velocityY: lane % 2 === 0 ? 0 : 12 });
    this.bulletIndex += 1;
  }

  private finishDodge(): void {
    this.clearBullets();
    this.clearUiObjects();
    this.mode = "main";
    this.battleInfo.setText("도미토리엘의 걱정이 잠시 잦아든다.\n그녀는 당신이 무슨 말을 하려는지 더 들어 보려 한다.");
    this.statusText.setText(
      "HP " + GameSession.get().hp + "/" + GameSession.get().maxHp +
      "     진로 선택 의지 " + GameSession.get().determinationCount + "/" + PROTOTYPE_SETTINGS.mercyActsRequired,
    );
    this.drawMainMenu();
  }

  private clearBullets(): void {
    for (const bullet of this.bullets) bullet.object.destroy();
    this.bullets = [];
  }

  private clearUiObjects(): void {
    for (const object of this.uiObjects) object.destroy();
    this.uiObjects = [];
    this.dodgePlayer?.destroy();
    this.dodgePlayer = undefined;
  }
}

function readyMercy(count: number): boolean {
  return count >= PROTOTYPE_SETTINGS.mercyActsRequired;
}
