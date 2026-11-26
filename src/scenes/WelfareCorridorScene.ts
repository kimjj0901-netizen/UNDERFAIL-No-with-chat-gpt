import Phaser from "phaser";
import {
  WELFARE_HALL_PUZZLE,
  WELFARE_PHONE_CALLS,
  WELFARE_PROGGITHUB_NPCS,
  WELFARE_REGULAR_ENCOUNTERS,
  type WelfareRegularEnemyId,
} from "../data/welfareEncounterContent";
import { GameSession } from "../state/GameSession";

type Target = {
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
};
type Dialogue = {
  speaker: string;
  lines: readonly string[];
  page: number;
  choices?: readonly string[];
  choiceIndex: number;
};

const ENCOUNTER_TARGETS: Array<{
  id: WelfareRegularEnemyId;
  x: number;
  y: number;
  label: string;
  withCompanion?: boolean;
}> = [
  { id: "timidPeer", x: 350, y: 330, label: "겁 많은 친구" },
  { id: "rhythmMote", x: 450, y: 188, label: "박자 먼지" },
  { id: "watchfulPrism", x: 575, y: 210, label: "반사 결정" },
  { id: "lunchSprout", x: 665, y: 368, label: "급식 새싹" },
  { id: "echoPair", x: 790, y: 286, label: "메아리 친구들", withCompanion: true },
];

export class WelfareCorridorScene extends Phaser.Scene {
  private x = 188;
  private y = 432;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private player!: Phaser.GameObjects.Image;
  private targets: Target[] = [];
  private nearest?: Target;
  private prompt!: Phaser.GameObjects.Text;
  private dialogue?: Dialogue;
  private dialogueObjects: Phaser.GameObjects.GameObject[] = [];
  private status?: Phaser.GameObjects.Text;
  private idleCallPrompt?: Phaser.GameObjects.Text;
  private puzzleHintLevel = 0;

  constructor() {
    super("WelfareCorridorScene");
  }

  create(): void {
    this.add.image(480, 270, "welfare-corridor").setDisplaySize(960, 540).setDepth(0);

    this.add.text(480, 24, "교육복지반 · 연결 복도", {
      fontFamily: "'Noto Serif KR', serif",
      fontSize: "19px",
      color: "#efe4c9",
      stroke: "#1a3035",
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(20);

    this.drawCharactersAndObjects();
    this.buildTargets();

    this.player = this.add.image(this.x, this.y, "character-player")
      .setDisplaySize(42, 63)
      .setDepth(24);
    this.drawPlayer();

    this.status = this.add.text(22, 508, "주변의 표식과 친구들을 살펴보자.", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "11px",
      color: "#9eac9c",
    }).setDepth(30);

    this.prompt = this.add.text(480, 481, "", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "13px",
      color: "#ecd7a6",
      backgroundColor: "#0b171d",
      padding: { x: 10, y: 6 },
    }).setOrigin(0.5).setDepth(31);

    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error("Keyboard input is unavailable in WelfareCorridorScene.");
    this.keys = {
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      w: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      e: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      c: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
      enter: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
      space: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      esc: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    };

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.clearDialogue();
      this.idleCallPrompt?.destroy();
    });

    if (!GameSession.get().welfareIdleCallSeen) {
      this.time.delayedCall(60000, () => {
        if (this.scene.isActive() && !this.dialogue) {
          this.idleCallPrompt = this.add.text(480, 442, "전화가 짧게 울린다. C를 누르면 받을 수 있다.", {
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: "12px",
            color: "#f0dcb4",
            backgroundColor: "#172d32",
            padding: { x: 12, y: 7 },
          }).setOrigin(0.5).setDepth(33);
          GameSession.markWelfareIdleCallSeen();
        }
      });
    }

    this.cameras.main.fadeIn(240, 0, 0, 0);
  }

  update(_time: number, delta: number): void {
    if (this.dialogue) {
      this.handleDialogue();
      return;
    }

    const speed = 178 * Math.min(delta, 40) / 1000;
    let dx = 0;
    let dy = 0;
    if (this.isDown("left", "a")) dx -= 1;
    if (this.isDown("right", "d")) dx += 1;
    if (this.isDown("up", "w")) dy -= 1;
    if (this.isDown("down", "s")) dy += 1;

    if (dx || dy) {
      const length = Math.hypot(dx, dy) || 1;
      const nextX = Phaser.Math.Clamp(this.x + (dx / length) * speed, 70, 890);
      const nextY = Phaser.Math.Clamp(this.y + (dy / length) * speed, 120, 454);
      if (!this.collides(nextX, this.y)) this.x = nextX;
      if (!this.collides(this.x, nextY)) this.y = nextY;
      this.drawPlayer();
    }

    this.updateNearest();
    if (Phaser.Input.Keyboard.JustDown(this.keys.e)) this.interact();
    if (Phaser.Input.Keyboard.JustDown(this.keys.c)) this.callDomitoriell();
  }

  private isDown(...names: string[]): boolean {
    return names.some((name) => this.keys[name].isDown);
  }

  private drawCharactersAndObjects(): void {
    const session = GameSession.get();
    const teacher = this.add.image(120, 184, "character-domitoriell")
      .setDisplaySize(44, 62)
      .setAlpha(0.88)
      .setDepth(12);
    this.tweens.add({ targets: teacher, y: 181, duration: 2300, yoyo: true, repeat: -1, ease: "Sine.InOut" });

    this.add.image(620, 286, "welfare-phone").setDisplaySize(44, 58).setDepth(13);
    this.add.image(486, 455, "welfare-classroom").setDisplaySize(32, 18).setAlpha(0.25).setDepth(4);

    if (!session.proggithubGuideHidden && !session.proggithubTutorialDone) {
      this.add.image(250, 260, "character-proggithub").setDisplaySize(46, 59).setDepth(15);
    }
    this.add.image(725, 145, "character-proggithub").setDisplaySize(36, 46).setAlpha(0.88).setDepth(15);
    this.add.image(820, 376, "character-proggithub").setDisplaySize(34, 44).setAlpha(0.78).setDepth(15);

    for (const item of ENCOUNTER_TARGETS) {
      if (session.welfareEncounterResults[item.id]) continue;
      const definition = WELFARE_REGULAR_ENCOUNTERS[item.id];
      this.add.image(item.x, item.y, definition.textureKey)
        .setDisplaySize(item.withCompanion ? 52 : 56, item.withCompanion ? 44 : 56)
        .setDepth(16);
    }

    if (!session.nerdstablookResolved) {
      this.add.image(885, 280, "character-nerdstablook")
        .setDisplaySize(62, 82)
        .setDepth(17);
      this.add.rectangle(916, 280, 18, 130, 0x20383b, 0.74)
        .setStrokeStyle(2, 0xb7a47c, 0.82)
        .setDepth(12);
    } else {
      this.add.text(865, 282, "통로가 열렸다", {
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: "10px",
        color: "#d5c8a7",
        backgroundColor: "#233c3c",
        padding: { x: 5, y: 3 },
      }).setOrigin(0.5).setDepth(17);
    }

    if (session.welfareHallPuzzleSolved && !session.proggithubTutorialDone) {
      this.add.image(850, 420, "character-proggithub")
        .setDisplaySize(36, 46)
        .setAlpha(0.92)
        .setDepth(16);
    }

    this.add.text(486, 85, "벽면의 표식은 순서를 기억하고 있다.", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "11px",
      color: "#bfc6b0",
      stroke: "#21393a",
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(20);
  }

  private buildTargets(): void {
    const session = GameSession.get();
    this.targets = [
      { id: "return", label: "교육복지반으로 돌아가기", x: 112, y: 410, radius: 66 },
      { id: "phone", label: "도미토리엘에게 전화하기", x: 620, y: 286, radius: 60 },
      ...(!session.proggithubGuideHidden && !session.proggithubTutorialDone
        ? [{ id: "proggithubGuide", label: "안내 프로깃허브", x: 250, y: 260, radius: 62 }]
        : []),
      { id: "puzzleHint", label: "벽의 표식 조사", x: 485, y: 94, radius: 64 },
      { id: "puzzle", label: session.welfareHallPuzzleSolved ? "열린 표식 장치" : "세 개의 바닥 스위치", x: 486, y: 455, radius: 66 },
      { id: "recordMark", label: "오래된 기록 표식", x: 285, y: 370, radius: 48 },
      { id: "proggithubCancel", label: "벽 옆 프로깃허브", x: 725, y: 145, radius: 64 },
      { id: "proggithubDisplay", label: "기둥 뒤 프로깃허브", x: 820, y: 376, radius: 58 },
      ...(session.welfareHallPuzzleSolved && !session.proggithubTutorialDone
        ? [{ id: "proggithubHidden", label: "숨은 프로깃허브", x: 850, y: 420, radius: 50 }]
        : []),
      ...ENCOUNTER_TARGETS.filter((enemy) => !session.welfareEncounterResults[enemy.id])
        .map((enemy) => ({ id: "enemy:" + enemy.id, label: enemy.label, x: enemy.x, y: enemy.y, radius: 58 })),
      ...(!session.nerdstablookResolved
        ? [{ id: "nerdstablook", label: "길을 막고 있는 친구", x: 885, y: 280, radius: 70 }]
        : [{ id: "exit", label: "열린 통로", x: 916, y: 280, radius: 66 }]),
    ];
  }

  private drawPlayer(): void {
    this.player.setPosition(this.x, this.y);
  }

  private collides(x: number, y: number): boolean {
    const obstacles = [
      { left: 442, top: 238, right: 524, bottom: 390 },
      { left: 600, top: 240, right: 664, bottom: 338 },
      { left: 42, top: 326, right: 210, bottom: 392 },
      ...(GameSession.get().nerdstablookResolved
        ? []
        : [{ left: 842, top: 120, right: 938, bottom: 454 }]),
    ];
    return obstacles.some((o) => {
      const cx = Phaser.Math.Clamp(x, o.left, o.right);
      const cy = Phaser.Math.Clamp(y, o.top, o.bottom);
      return Math.hypot(x - cx, y - cy) < 13;
    });
  }

  private updateNearest(): void {
    let nearest: Target | undefined;
    let best = Infinity;
    for (const target of this.targets) {
      const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
      if (distance <= target.radius && distance < best) {
        nearest = target;
        best = distance;
      }
    }
    this.nearest = nearest;
    this.prompt.setText(nearest ? "E  " + nearest.label : "");
  }

  private interact(): void {
    const target = this.nearest;
    if (!target) return;
    if (target.id.startsWith("enemy:")) {
      const enemyId = target.id.slice(6) as WelfareRegularEnemyId;
      const withCompanion = ENCOUNTER_TARGETS.find((e) => e.id === enemyId)?.withCompanion ?? false;
      this.scene.start("RegularEncounterScene", { enemyId, withCompanion });
      return;
    }

    switch (target.id) {
      case "return":
        this.scene.start("RoomScene");
        break;
      case "phone":
        this.callDomitoriell();
        break;
      case "puzzleHint":
        this.openDialogue("벽의 표식", [
          WELFARE_HALL_PUZZLE.hint,
          "벽면의 선은 세 개의 바닥 홈과 이어져 있다.",
        ]);
        break;
      case "puzzle":
        this.runHallPuzzle();
        break;
      case "recordMark":
        this.openDialogue("오래된 기록 표식", [
          "표식 안쪽에서 희미한 빛이 맴돈다.",
          "무언가를 기록하는 장소처럼 보이지만, 지금은 정확한 의미를 알 수 없다.",
        ]);
        break;
      case "proggithubGuide":
        this.openDialogue(WELFARE_PROGGITHUB_NPCS.guide.speaker, WELFARE_PROGGITHUB_NPCS.guide.lines);
        break;
      case "proggithubCancel":
        this.openDialogue(WELFARE_PROGGITHUB_NPCS.cancel.speaker, WELFARE_PROGGITHUB_NPCS.cancel.lines);
        break;
      case "proggithubDisplay":
        this.openDialogue(WELFARE_PROGGITHUB_NPCS.display.speaker, WELFARE_PROGGITHUB_NPCS.display.lines);
        break;
      case "proggithubHidden":
        this.openDialogue(WELFARE_PROGGITHUB_NPCS.mercy.speaker, WELFARE_PROGGITHUB_NPCS.mercy.lines, ["전투 메뉴를 다시 설명해 달라고 한다.", "고맙다고 말한다."]);
        break;
      case "nerdstablook":
        this.scene.start("NerdstablookEncounterScene");
        break;
      case "exit":
        this.openDialogue("열린 통로", [
          "너드스타블룩이 비켜서자, 막혀 있던 길이 모습을 드러낸다.",
          "이쪽은 교육복지반으로 돌아가는 길과 이어져 있다.",
        ], ["교실로 돌아간다.", "복도를 조금 더 살펴본다."]);
        break;
    }
  }

  private runHallPuzzle(): void {
    if (GameSession.get().welfareHallPuzzleSolved) {
      this.openDialogue("바닥 스위치", ["세 개의 홈이 차례대로 빛나고 있다.", "벽의 문양이 천천히 밝아진다."]);
      return;
    }
    const state = GameSession.get();
    const step = state.welfareHallPuzzleStep;
    const hint = state.welfareHallPuzzleMistakes > 0 || step > 0
      ? WELFARE_HALL_PUZZLE.repeatHint
      : WELFARE_HALL_PUZZLE.hint;
    this.openDialogue("세 개의 바닥 스위치", [
      hint,
      "어느 홈을 먼저 누를까?",
    ], [...WELFARE_HALL_PUZZLE.choices]);
  }

  private resolvePuzzleChoice(index: number): void {
    const state = GameSession.get();
    const expected = WELFARE_HALL_PUZZLE.sequence[state.welfareHallPuzzleStep];
    if (index === expected) {
      const next = GameSession.advanceWelfareHallPuzzle();
      if (next >= WELFARE_HALL_PUZZLE.sequence.length) {
        this.openDialogue("바닥 스위치", [
          "세 개의 빛이 순서대로 이어졌다.",
          "벽의 좁은 장식 틈이 열리며 작은 숨은 공간이 드러난다.",
        ]);
        if (!GameSession.get().proggithubTutorialDone) {
          this.targets.push({ id: "proggithubHidden", label: "숨은 프로깃허브", x: 850, y: 420, radius: 54 });
          if (GameSession.get().proggithubGuideHidden) {
            this.add.image(850, 420, "character-proggithub")
              .setDisplaySize(36, 46)
              .setAlpha(0.92)
              .setDepth(16);
          }
        }
        this.targets = this.targets.filter((t) => t.id !== "puzzleHint");
      } else {
        this.openDialogue("바닥 스위치", ["맞았다. 다음 홈의 빛이 조금 더 선명해진다."], [...WELFARE_HALL_PUZZLE.choices]);
      }
    } else {
      GameSession.resetWelfareHallPuzzle();
      this.openDialogue("바닥 스위치", [
        "빛이 꺼지고 장치가 다시 조용해졌다.",
        "아무것도 잃지 않았다. 벽의 표식을 다시 살펴보자.",
      ]);
    }
  }

  private callDomitoriell(): void {
    const state = GameSession.get();
    const count = GameSession.recordWelfarePhoneCall();
    const calls = state.welfareHallPuzzleSolved
      ? WELFARE_PHONE_CALLS.afterPuzzle
      : Object.keys(state.welfareEncounterResults).length > 0
        ? WELFARE_PHONE_CALLS.afterEncounters
        : count === 1
          ? WELFARE_PHONE_CALLS.first
          : WELFARE_PHONE_CALLS.later;
    this.idleCallPrompt?.destroy();
    this.idleCallPrompt = undefined;
    this.openDialogue("도미토리엘 · 전화", [...calls, "통화를 마쳤다."]);
  }

  private openDialogue(speaker: string, lines: readonly string[], choices?: readonly string[]): void {
    this.clearDialogue();
    this.dialogue = { speaker, lines, page: 0, choices, choiceIndex: 0 };
    this.renderDialogue();
  }

  private handleDialogue(): void {
    const dialogue = this.dialogue;
    if (!dialogue) return;

    if (Phaser.Input.Keyboard.JustDown(this.keys.esc)) {
      if (dialogue.speaker.toLowerCase().includes("프로깃허브")) {
        GameSession.recordProggithubDialogueSkip(dialogue.lines.length - dialogue.page);
      }
      this.clearDialogue();
      this.status?.setText("대화를 마쳤다. 필요한 곳을 다시 조사할 수 있다.");
      return;
    }

    if (dialogue.choices && dialogue.page >= dialogue.lines.length - 1) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.up) || Phaser.Input.Keyboard.JustDown(this.keys.w)) {
        dialogue.choiceIndex = (dialogue.choiceIndex + dialogue.choices.length - 1) % dialogue.choices.length;
        this.renderDialogue();
      } else if (Phaser.Input.Keyboard.JustDown(this.keys.down) || Phaser.Input.Keyboard.JustDown(this.keys.s)) {
        dialogue.choiceIndex = (dialogue.choiceIndex + 1) % dialogue.choices.length;
        this.renderDialogue();
      } else if (Phaser.Input.Keyboard.JustDown(this.keys.enter) || Phaser.Input.Keyboard.JustDown(this.keys.space)) {
        const selected = dialogue.choiceIndex;
        const speaker = dialogue.speaker;
        this.clearDialogue();
        if (speaker === "열린 통로" && selected === 0) {
          this.scene.start("RoomScene");
          return;
        }
        if (speaker === "세 개의 바닥 스위치") {
          this.resolvePuzzleChoice(selected);
          return;
        }
        if (speaker === WELFARE_PROGGITHUB_NPCS.mercy.speaker && selected === 0) {
          GameSession.markProggithubTutorialDone();
          this.openDialogue("숨은 프로깃허브", [
            "ACT는 상대가 무엇을 필요로 하는지 살펴보는 행동이다.",
            "MERCY는 상대가 마음을 놓았을 때 선택할 수 있다.",
          ]);
        }
      }
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.enter) || Phaser.Input.Keyboard.JustDown(this.keys.space)) {
      dialogue.page += 1;
      if (dialogue.page >= dialogue.lines.length) {
        if (dialogue.speaker === WELFARE_PROGGITHUB_NPCS.guide.speaker) {
          GameSession.markProggithubTutorialDone();
        }
        this.clearDialogue();
      } else this.renderDialogue();
    }
  }

  private renderDialogue(): void {
    this.clearDialogueObjects();
    const dialogue = this.dialogue;
    if (!dialogue) return;

    const panel = this.add.graphics().setDepth(50);
    panel.fillStyle(0x07131a, 0.97).fillRoundedRect(40, 340, 880, 160, 12);
    panel.lineStyle(2, 0xc1ad79, 0.95).strokeRoundedRect(40, 340, 880, 160, 12);
    panel.lineStyle(1, 0x65776d, 0.72).strokeRoundedRect(50, 350, 860, 140, 8);
    this.dialogueObjects.push(panel);

    this.dialogueObjects.push(this.add.text(70, 362, dialogue.speaker, {
      fontFamily: "'Noto Serif KR', serif",
      fontSize: "15px",
      color: "#e5ca8b",
      fontStyle: "bold",
    }).setDepth(51));

    this.dialogueObjects.push(this.add.text(70, 392, dialogue.lines[dialogue.page] ?? "", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "15px",
      color: "#f1ead8",
      wordWrap: { width: 800 },
      lineSpacing: 7,
    }).setDepth(51));

    if (dialogue.page < dialogue.lines.length - 1) {
      this.dialogueObjects.push(this.add.text(886, 468, "ENTER ▶", {
        fontFamily: "monospace",
        fontSize: "10px",
        color: "#aab39f",
      }).setOrigin(1, 0.5).setDepth(51));
    } else if (dialogue.choices) {
      dialogue.choices.forEach((choice, index) => {
        this.dialogueObjects.push(this.add.text(86, 426 + index * 20, (index === dialogue.choiceIndex ? "▶ " : "  ") + choice, {
          fontFamily: "'Noto Sans KR', sans-serif",
          fontSize: "13px",
          color: index === dialogue.choiceIndex ? "#f0d48f" : "#bbc4b9",
        }).setDepth(51));
      });
      this.dialogueObjects.push(this.add.text(886, 468, "↑↓ 선택 · ENTER", {
        fontFamily: "monospace",
        fontSize: "10px",
        color: "#aab39f",
      }).setOrigin(1, 0.5).setDepth(51));
    }
  }

  private clearDialogue(): void {
    this.dialogue = undefined;
    this.clearDialogueObjects();
  }

  private clearDialogueObjects(): void {
    this.dialogueObjects.forEach((object) => object.destroy());
    this.dialogueObjects = [];
  }
}
