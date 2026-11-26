import Phaser from "phaser";
import { GameInput } from "../input/GameInput";
import { drawEncounterCommandRow, drawEncounterChoiceList } from "../ui/EncounterMenu";
import { GameSession } from "../state/GameSession";
import { WELFARE_EVENTS } from "../data/storyEvents";

type Mode = "main" | "act" | "response" | "resolution";
type Action = "fight" | "act" | "mercy";

const MAIN_OPTIONS = ["FIGHT", "ACT", "ITEM", "MERCY"];

export class SecondRankEncounterScene extends Phaser.Scene {
  private mode: Mode = "main";
  private mainIndex = 0;
  private actIndex = 0;
  private controls!: GameInput;
  private menuObjects: Phaser.GameObjects.GameObject[] = [];
  private playerText?: Phaser.GameObjects.Text;
  private message?: Phaser.GameObjects.Text;
  private hint?: Phaser.GameObjects.Text;
  private student!: Phaser.GameObjects.Image;
  private teacher!: Phaser.GameObjects.Image;

  constructor() {
    super("SecondRankEncounterScene");
  }

  create(): void {
    this.add.image(480, 270, "welfare-classroom").setDisplaySize(960, 540).setAlpha(0.42);
    this.add.rectangle(480, 270, 960, 540, 0x07131a, 0.58);

    this.add.text(52, 32, "교육복지반 · 특별 조우", {
      fontFamily: "'Noto Serif KR', serif",
      fontSize: "17px",
      color: "#e4d4b1",
    }).setDepth(20);

    this.student = this.add.image(430, 185, "character-second-rank")
      .setDisplaySize(118, 166)
      .setDepth(18);
    this.teacher = this.add.image(710, 188, "character-domitoriell")
      .setDisplaySize(92, 128)
      .setAlpha(0)
      .setDepth(19);

    this.add.text(430, 286, "전교 2등", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "12px",
      color: "#f0dfbd",
      backgroundColor: "#243a3c",
      padding: { x: 7, y: 4 },
    }).setOrigin(0.5).setDepth(20);

    const panel = this.add.graphics().setDepth(30);
    panel.fillStyle(0x09151d, 0.97).fillRoundedRect(42, 326, 876, 176, 10);
    panel.lineStyle(2, 0xbca981, 0.94).strokeRoundedRect(42, 326, 876, 176, 10);
    panel.lineStyle(1, 0x64766d, 0.72).strokeRoundedRect(52, 336, 856, 156, 7);

    this.add.text(72, 347, "전교 2등", {
      fontFamily: "'Noto Serif KR', serif",
      fontSize: "15px",
      color: "#e5c98d",
      fontStyle: "bold",
    }).setDepth(31);

    this.message = this.add.text(72, 378, WELFARE_EVENTS.secondRankEncounter.intro.join("\n"), {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "16px",
      color: "#f1ead7",
      lineSpacing: 8,
      wordWrap: { width: 780 },
    }).setDepth(31);

    this.controls = new GameInput(this);

    this.addMenuHint();
    this.drawMainMenu();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.clearMenu();
      this.message?.destroy();
      this.hint?.destroy();
    });
  }

  update(): void {
    if (this.mode === "resolution") return;

    if (this.mode === "response") {
      if (this.controls.justPressed("CONFIRM")) {
        this.mode = "main";
        this.drawMainMenu();
      }
      return;
    }

    if (this.controls.justPressed("CANCEL") && this.mode === "act") {
      this.mode = "main";
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
      if (this.mode === "main") this.mainIndex = (this.mainIndex + MAIN_OPTIONS.length - 1) % MAIN_OPTIONS.length;
      else this.actIndex = (this.actIndex + WELFARE_EVENTS.secondRankEncounter.actOptions.length - 1) %
        WELFARE_EVENTS.secondRankEncounter.actOptions.length;
      this.mode === "main" ? this.drawMainMenu() : this.drawActMenu();
    } else if (down) {
      if (this.mode === "main") this.mainIndex = (this.mainIndex + 1) % MAIN_OPTIONS.length;
      else this.actIndex = (this.actIndex + 1) % WELFARE_EVENTS.secondRankEncounter.actOptions.length;
      this.mode === "main" ? this.drawMainMenu() : this.drawActMenu();
    } else if (this.controls.justPressed("CONFIRM")) {
      this.confirmSelection();
    }
  }

  private addMenuHint(): void {
    this.hint = this.add.text(878, 298, "↑↓ 선택 · Z / ENTER 확정", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#b9b39f",
    }).setOrigin(1, 0.5).setDepth(32);
  }

  private drawMainMenu(): void {
    this.mode = "main";
    this.clearMenu();
    const items = MAIN_OPTIONS.map((label) => ({
      label,
      subtitle: label === "FIGHT" ? "대립" :
        label === "ACT" ? "상대 이해하기" :
        label === "ITEM" ? "소지품" : "비폭력 해결",
    }));
    this.menuObjects.push(...drawEncounterCommandRow(
      this,
      items,
      this.mainIndex,
      (index) => {
        this.mainIndex = index;
        this.confirmSelection();
      },
      { centerX: 480, centerY: 455, cardWidth: 184, cardHeight: 54, gap: 36, depth: 34 },
    ));
    this.message?.setText(WELFARE_EVENTS.secondRankEncounter.intro.join("\n"));
    this.hint?.setText("↑↓ 선택 · Z / ENTER 확정");
  }

  private drawActMenu(): void {
    this.mode = "act";
    this.clearMenu();
    this.menuObjects.push(...drawEncounterChoiceList(
      this,
      WELFARE_EVENTS.secondRankEncounter.actOptions,
      this.actIndex,
      (index) => {
        this.actIndex = index;
        this.confirmSelection();
      },
      { left: 72, top: 412, width: 816, rowHeight: 25, fontSize: "14px", depth: 35 },
    ));
    this.hint?.setText("↑↓ 선택 · Z / ENTER 확정 · X / SHIFT 취소");
  }

  private confirmSelection(): void {
    if (this.mode === "act") {
      const act = WELFARE_EVENTS.secondRankEncounter.actOptions[this.actIndex] ?? "조용히 인사한다.";
      this.resolve("act", act);
      return;
    }

    switch (MAIN_OPTIONS[this.mainIndex]) {
      case "FIGHT":
        this.resolve("fight");
        break;
      case "ACT":
        this.actIndex = 0;
        this.drawActMenu();
        break;
      case "ITEM":
        this.showItemNotice();
        break;
      case "MERCY":
        this.resolve("mercy");
        break;
    }
  }

  private showItemNotice(): void {
    this.mode = "response";
    this.clearMenu();
    this.message?.setText(WELFARE_EVENTS.secondRankEncounter.itemResponse);
    this.hint?.setText("Z / ENTER  —  메뉴로 돌아가기");
  }

  private resolve(action: Action, detail?: string): void {
    this.mode = "resolution";
    this.clearMenu();
    this.hint?.setText("");

    const response = action === "fight"
      ? WELFARE_EVENTS.secondRankEncounter.fightResponse
      : action === "act"
        ? WELFARE_EVENTS.secondRankEncounter.actResponse + "\n" + (detail ?? "")
        : WELFARE_EVENTS.secondRankEncounter.mercyResponse;

    this.message?.setText(response);

    if (action === "fight") {
      this.tweens.add({
        targets: this.teacher,
        x: 585,
        alpha: 1,
        duration: 620,
        ease: "Cubic.Out",
      });
      this.tweens.add({
        targets: this.student,
        x: 470,
        y: 170,
        duration: 260,
        yoyo: true,
        repeat: 1,
        ease: "Sine.InOut",
      });
    }

    this.time.delayedCall(action === "fight" ? 720 : 420, () => {
      this.tweens.add({
        targets: this.student,
        x: 835,
        y: 148,
        alpha: 0,
        duration: 870,
        ease: "Cubic.In",
      });
    });

    this.time.delayedCall(1750, () => {
      this.message?.setText(WELFARE_EVENTS.secondRankEncounter.departure);
      this.hint?.setText("...");
    });

    this.time.delayedCall(2700, () => {
      GameSession.markSecondRankFled();
      this.scene.start("RoomScene");
    });
  }

  private clearMenu(): void {
    this.menuObjects.forEach((object) => object.destroy());
    this.menuObjects = [];
  }
}
