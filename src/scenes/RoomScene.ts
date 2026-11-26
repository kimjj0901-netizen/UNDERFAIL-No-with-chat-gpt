import Phaser from "phaser";
import { GameSession } from "../state/GameSession";
import { WELFARE_EVENTS } from "../data/storyEvents";
import { WELFARE_PHONE_CALLS } from "../data/welfareEncounterContent";

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

export class RoomScene extends Phaser.Scene {
  private x = 480;
  private y = 420;
  private player!: Phaser.GameObjects.Image;
  private prompt!: Phaser.GameObjects.Text;
  private dialogue?: Dialogue;
  private dialogueObjects: Phaser.GameObjects.GameObject[] = [];
  private targets: Target[] = [];
  private nearest?: Target;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private puzzleStep = 0;
  private secondRankSprite?: Phaser.GameObjects.Image;
  private proggithubSprite?: Phaser.GameObjects.Image;
  private puzzleLights: Phaser.GameObjects.Arc[] = [];

  constructor() {
    super("RoomScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#101716");
    this.drawRoom();
    const session = GameSession.get();
    this.targets = [
      { id: "domitoriell", label: "도미토리엘 선생님", x: 480, y: 164, radius: 76 },
      ...(!session.proggithubGuideHidden
        ? [{ id: "proggithub", label: "프로깃허브", x: 728, y: 270, radius: 78 }]
        : []),
      { id: "phone", label: "도미토리엘의 전화", x: 842, y: 255, radius: 58 },
      ...(session.proggithubTutorialDone && !session.secondRankFled
        ? [{ id: "second", label: "전교 2등", x: 205, y: 246, radius: 76 }]
        : []),
      { id: "puzzle", label: "첫 퍼즐", x: 485, y: 286, radius: 82 },
      { id: "shelf", label: "학생들의 책장", x: 128, y: 392, radius: 66 },
      { id: "door", label: "교육복지실 안쪽 문", x: 480, y: 88, radius: 72 },
    ];

    this.player = this.add.image(this.x, this.y, "character-player").setDisplaySize(43, 65).setDepth(20);
    this.drawPlayer();
    this.drawHud();

    const k = this.input.keyboard;
    if (!k) throw new Error("Keyboard input unavailable.");
    this.keys = {
      up: k.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: k.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left: k.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: k.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      w: k.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: k.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: k.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: k.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      e: k.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      enter: k.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
      space: k.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      esc: k.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
      c: k.addKey(Phaser.Input.Keyboard.KeyCodes.C),
    };

    this.prompt = this.add.text(480, 504, "", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#e4cf92",
      backgroundColor: "#0a1011",
      padding: { x: 10, y: 6 },
    }).setOrigin(0.5).setDepth(40);

    if (session.bullyRescued) {
      this.openDialogue("도미토리엘", [
        "여기가 교육복지반이란다.",
        "조금 전 일은 잊고 숨을 고르렴. 여기서는 네가 직접 살펴보고 결정해도 괜찮아.",
      ]);
      session.bullyRescued = false;
    } else if (GameSession.consumeDomitoriellFollowUp()) {
      this.openDialogue("도미토리엘", [...WELFARE_EVENTS.secondRankEncounter.domitoriellAfter]);
    }
  }

  update(_time: number, delta: number): void {
    if (this.dialogue) {
      this.handleDialogue();
      return;
    }

    const speed = 180 * Math.min(delta, 40) / 1000;
    let dx = 0;
    let dy = 0;
    if (this.isDown("left", "a")) dx -= 1;
    if (this.isDown("right", "d")) dx += 1;
    if (this.isDown("up", "w")) dy -= 1;
    if (this.isDown("down", "s")) dy += 1;

    if (dx || dy) {
      const length = Math.hypot(dx, dy) || 1;
      const moveX = dx / length * speed;
      const moveY = dy / length * speed;
      const nextX = Phaser.Math.Clamp(this.x + moveX, 82, 878);
      if (!this.collides(nextX, this.y)) this.x = nextX;
      const nextY = Phaser.Math.Clamp(this.y + moveY, 116, 456);
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

  private drawRoom(): void {
    this.add.image(480, 270, "welfare-classroom")
      .setDisplaySize(960, 540)
      .setDepth(0);

    const teacher = this.add.image(480, 164, "character-domitoriell")
      .setDisplaySize(70, 96)
      .setDepth(14);
    this.tweens.add({
      targets: teacher,
      y: 161,
      duration: 2100,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
    this.add.text(480, 104, "도미토리엘", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "12px",
      color: "#f0dfbd",
      backgroundColor: "#294644",
      padding: { x: 6, y: 3 },
    }).setOrigin(0.5).setDepth(15);

    if (!GameSession.get().proggithubGuideHidden) {
      this.proggithubSprite = this.add.image(728, 264, "character-proggithub")
        .setDisplaySize(62, 78)
        .setDepth(14);
      this.tweens.add({
        targets: this.proggithubSprite,
        y: 260,
        duration: 1600,
        yoyo: true,
        repeat: -1,
        ease: "Sine.InOut",
      });
    }
    this.add.image(842, 255, "welfare-phone")
      .setDisplaySize(34, 46)
      .setDepth(13);
    if (!GameSession.get().secondRankFled) {
      this.secondRankSprite = this.add.image(205, 251, "character-second-rank")
        .setDisplaySize(58, 82)
        .setAlpha(GameSession.get().proggithubTutorialDone ? 1 : 0)
        .setDepth(14);
      this.tweens.add({
        targets: this.secondRankSprite,
        y: 249,
        duration: 2350,
        yoyo: true,
        repeat: -1,
        ease: "Sine.InOut",
      });
    }
    this.puzzleLights = [447, 485, 523].map((x) =>
      this.add.circle(x, 279, 4, 0x64766a, 0.9).setDepth(12),
    );

    this.add.text(480, 24, "교육복지반", {
      fontFamily: "'Noto Serif KR', serif",
      fontSize: "20px",
      color: "#efe5cb",
      stroke: "#213a39",
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(18);

  }

  private collides(x: number, y: number): boolean {
    const obstacles = [
      { left: 414, top: 236, right: 556, bottom: 322 },
      { left: 686, top: 222, right: 770, bottom: 312 },
      { left: 166, top: 218, right: 244, bottom: 310 },
      { left: 88, top: 370, right: 204, bottom: 418 },
      { left: 447, top: 125, right: 513, bottom: 203 },
      { left: 822, top: 225, right: 864, bottom: 285 },
    ];
    const radius = 12;
    return obstacles.some((obstacle) => {
      const closestX = Phaser.Math.Clamp(x, obstacle.left, obstacle.right);
      const closestY = Phaser.Math.Clamp(y, obstacle.top, obstacle.bottom);
      return Math.hypot(x - closestX, y - closestY) < radius;
    });
  }

  private drawPlayer(): void {
    this.player.setPosition(this.x, this.y);
  }

  private drawHud(): void {
    this.add.rectangle(480, 526, 936, 28, 0x0a1011, 0.95).setDepth(30);
    this.add.text(22, 526, GameSession.get().playerName + "  ·  교육복지반", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#c9c2ad",
    }).setOrigin(0, 0.5).setDepth(31);
    this.add.text(938, 526, "WASD / 방향키 이동   E 조사 · 전화", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#9aa89e",
    }).setOrigin(1, 0.5).setDepth(31);
  }

  private updateNearest(): void {
    let nearest: Target | undefined;
    let distance = Infinity;
    for (const target of this.targets) {
      const d = Math.hypot(this.x - target.x, this.y - target.y);
      if (d <= target.radius && d < distance) {
        nearest = target;
        distance = d;
      }
    }
    this.nearest = nearest;
    this.prompt.setText(nearest ? "E  " + nearest.label + "  조사하기" : "");
  }

  private interact(): void {
    const target = this.nearest;
    if (!target) return;

    switch (target.id) {
      case "domitoriell":
        this.openDialogue("도미토리엘", [
          "괜찮니? 조금 전에는 정말 놀랐겠구나.",
          "천천히 둘러보렴. 여기 있는 것들은 네가 직접 살펴보고 결정해도 괜찮단다.",
        ], ["첫 퍼즐을 알려 주세요.", "불리에 대해 물어본다.", "혼자 둘러볼게요."]);
        break;
      case "puzzle":
        this.runPuzzle();
        break;
      case "proggithub":
        this.proggithubEncounter();
        break;
      case "second":
        this.scene.start("SecondRankEncounterScene");
        break;
      case "shelf":
        this.openDialogue("학생들의 책장", [
          "교과서 사이에 그림, 운동 기록, 낡은 악보가 섞여 있다.",
          "누군가의 미래를 한 줄의 성적표로만 정리할 수는 없었던 것 같다.",
        ]);
        break;
      case "door":
        this.openDialogue("복도로 이어지는 문", [
          "교실 밖으로 이어지는 복도다.",
          "벽면의 표식과 작은 친구들의 목소리가 희미하게 들린다.",
        ], ["복도로 나간다.", "조금 더 교실을 둘러본다."]);
        break;
      case "phone":
        this.callDomitoriell();
        break;
    }
  }

  private callDomitoriell(): void {
    const count = GameSession.recordWelfarePhoneCall();
    const state = GameSession.get();
    const lines = state.welfareHallPuzzleSolved
      ? WELFARE_PHONE_CALLS.afterPuzzle
      : Object.keys(state.welfareEncounterResults).length > 0
        ? WELFARE_PHONE_CALLS.afterEncounters
        : count === 1
          ? WELFARE_PHONE_CALLS.first
          : WELFARE_PHONE_CALLS.later;
    this.openDialogue("도미토리엘 · 전화", [...lines]);
  }

  private runPuzzle(): void {
    const sequence = WELFARE_EVENTS.firstPuzzle.sequence;
    if (this.puzzleStep >= sequence.length) {
      this.openDialogue("퍼즐", ["이미 풀었다. 하지만 도미토리엘이 설명한 원리는 기억에 남아 있다."]);
      return;
    }

    this.openDialogue("첫 퍼즐", [
      WELFARE_EVENTS.firstPuzzle.hint,
      "가운데의 세 표식은 순서대로 반응한다.",
    ], ["왼쪽 표식", "가운데 표식", "오른쪽 표식"]);
  }

  private proggithubEncounter(): void {
    if (GameSession.get().proggithubTutorialDone) {
      this.openDialogue("프로깃허브", [
        "이미 기본 메뉴는 배웠다.",
        "이번에는 네가 원하는 방식으로 상황을 해결해 보렴.",
      ]);
      return;
    }
    this.openDialogue("프로깃허브", WELFARE_EVENTS.proggithub.tutorial, [
      "말을 건다",
      "상태를 살핀다",
      "자비를 시도한다",
    ]);
  }

  private revealSecondRank(): void {
    if (GameSession.get().secondRankFled) return;
    this.targets.push({ id: "second", label: "전교 2등", x: 205, y: 246, radius: 76 });
    if (!this.secondRankSprite) return;
    this.tweens.add({
      targets: this.secondRankSprite,
      alpha: 1,
      y: 251,
      duration: 850,
      ease: "Sine.Out",
    });
  }

  private openDialogue(speaker: string, lines: readonly string[], choices?: readonly string[]): void {
    this.clearDialogue();
    this.dialogue = { speaker, lines, page: 0, choices, choiceIndex: 0 };
    this.renderDialogue();
  }

  private handleDialogue(): void {
    const d = this.dialogue;
    if (!d) return;

    if (Phaser.Input.Keyboard.JustDown(this.keys.esc)) {
      if (d.speaker === "프로깃허브") {
        const hidden = GameSession.recordProggithubDialogueSkip(d.lines.length - d.page);
        if (hidden) {
          this.proggithubSprite?.destroy();
          this.targets = this.targets.filter((target) => target.id !== "proggithub");
        }
      }
      this.clearDialogue();
      return;
    }

    if (d.choices && d.page >= d.lines.length - 1) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.up) || Phaser.Input.Keyboard.JustDown(this.keys.w)) {
        d.choiceIndex = (d.choiceIndex + d.choices.length - 1) % d.choices.length;
        this.renderDialogue();
      } else if (Phaser.Input.Keyboard.JustDown(this.keys.down) || Phaser.Input.Keyboard.JustDown(this.keys.s)) {
        d.choiceIndex = (d.choiceIndex + 1) % d.choices.length;
        this.renderDialogue();
      } else if (Phaser.Input.Keyboard.JustDown(this.keys.enter) || Phaser.Input.Keyboard.JustDown(this.keys.space)) {
        const selected = d.choiceIndex;
        const speaker = d.speaker;
        if (speaker === "첫 퍼즐") {
          this.resolvePuzzleChoice(selected);
        } else {
          this.clearDialogue();
          if (speaker === "복도에서 이어지는 문") {
            if (selected === 0) this.scene.start("WelfareCorridorScene");
            else this.openDialogue("도미토리엘", ["천천히 둘러보렴. 궁금한 것이 있으면 언제든 물어봐도 좋단다."]);
          } else if (speaker === "도미토리엘") {
            if (selected === 0) {
              this.openDialogue("도미토리엘", [
                "물론이지. 세 표식의 빛이 남기는 순서를 잘 살펴보렴.",
                "서두르지 않아도 돼. 틀리면 다시 시도할 수 있단다.",
              ]);
            } else if (selected === 1) {
              this.openDialogue("도미토리엘", [
                "그 아이는 낯선 사람과 눈을 마주치는 걸 어려워한단다.",
                "조금 시간이 지나면 네게도 말을 걸어 줄지 모르지.",
              ]);
            } else {
              this.openDialogue("도미토리엘", [
                "그래. 네가 직접 보고 판단하는 것도 좋은 방법이란다.",
                "나는 여기 있을 테니 도움이 필요하면 불러 주렴.",
              ]);
            }
          } else if (speaker === "프로깃허브") {
            GameSession.markProggithubTutorialDone();
            this.revealSecondRank();
            if (selected === 0) {
              this.openDialogue("프로깃허브", [
                "말을 건다는 것은 상대의 말을 들어 보겠다는 뜻이기도 하다.",
                "상대가 어떤 표정을 짓는지도 살펴보렴.",
              ]);
            } else if (selected === 1) {
              this.openDialogue("프로깃허브", [
                "행동을 고르기 전에 상대의 상태를 관찰할 수 있다.",
                "같은 행동도 상황에 따라 다른 결과를 낳을 수 있다.",
              ]);
            } else {
              this.openDialogue("프로깃허브", [
                "자비를 선택하려는 태도를 확인했다.",
                "하지만 전투 메뉴 자체를 익히는 것이 먼저다. 이제 다음 조우에서는 직접 판단해 보렴.",
              ]);
            }
          }
        }
      }
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.enter) || Phaser.Input.Keyboard.JustDown(this.keys.space)) {
      d.page += 1;
      if (d.page >= d.lines.length) this.clearDialogue();
      else this.renderDialogue();
    }
  }

  private resolvePuzzleChoice(index: number): void {
    const expected = WELFARE_EVENTS.firstPuzzle.sequence[this.puzzleStep];
    if (index === expected) {
      this.puzzleStep += 1;
      this.puzzleLights[index]?.setFillStyle(0xd8c595, 1);
      this.tweens.add({
        targets: this.puzzleLights[index],
        scale: 1.8,
        duration: 250,
        yoyo: true,
        ease: "Sine.Out",
      });
      this.clearDialogue();
      if (this.puzzleStep >= WELFARE_EVENTS.firstPuzzle.sequence.length) {
        this.openDialogue("첫 퍼즐", ["딸깍.", "세 표식이 순서대로 빛나며 길이 열렸다."]);
      } else {
        this.openDialogue("첫 퍼즐", ["맞았다.", "다음 표식이 희미하게 빛난다."], ["왼쪽 표식", "가운데 표식", "오른쪽 표식"]);
      }
    } else {
      this.openDialogue("첫 퍼즐", [
        "아무 일도 일어나지 않는다.",
        "도미토리엘이 말한 것처럼, 실패해도 다시 살펴볼 수 있다.",
      ], ["왼쪽 표식", "가운데 표식", "오른쪽 표식"]);
    }
  }

  private renderDialogue(): void {
    this.clearDialogueObjects();
    const d = this.dialogue;
    if (!d) return;

    const panel = this.add.graphics().setDepth(50);
    panel.fillStyle(0x070b0d, 0.97).fillRoundedRect(42, 344, 876, 154, 12);
    panel.lineStyle(2, 0xc1ad79, 0.95).strokeRoundedRect(42, 344, 876, 154, 12);
    panel.lineStyle(1, 0x64726a, 0.7).strokeRoundedRect(52, 354, 856, 134, 8);
    this.dialogueObjects.push(panel);

    this.dialogueObjects.push(this.add.text(70, 366, d.speaker, {
      fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
      fontSize: "15px",
      color: "#e5cb8b",
      fontStyle: "bold",
    }).setDepth(51));

    this.dialogueObjects.push(this.add.text(70, 396, d.lines[d.page] ?? "", {
      fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
      fontSize: "16px",
      color: "#f1ead7",
      wordWrap: { width: 800 },
      lineSpacing: 7,
    }).setDepth(51));

    if (d.page < d.lines.length - 1) {
      this.dialogueObjects.push(this.add.text(890, 468, "ENTER ▶", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#a9b29f",
      }).setOrigin(1, 0.5).setDepth(51));
    } else if (d.choices) {
      d.choices.forEach((choice, index) => {
        this.dialogueObjects.push(this.add.text(90, 430 + index * 20, (index === d.choiceIndex ? "▶ " : "  ") + choice, {
          fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
          fontSize: "14px",
          color: index === d.choiceIndex ? "#f0d58f" : "#b9c1b9",
        }).setDepth(51));
      });
      this.dialogueObjects.push(this.add.text(890, 468, "↑↓ 선택 · ENTER", {
        fontFamily: "monospace",
        fontSize: "10px",
        color: "#a9b29f",
      }).setOrigin(1, 0.5).setDepth(51));
    }
  }

  private clearDialogue(): void {
    this.dialogue = undefined;
    this.clearDialogueObjects();
  }

  private clearDialogueObjects(): void {
    for (const object of this.dialogueObjects) object.destroy();
    this.dialogueObjects = [];
  }
}
