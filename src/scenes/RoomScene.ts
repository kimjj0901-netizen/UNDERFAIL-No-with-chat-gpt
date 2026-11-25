import Phaser from "phaser";
import { GameSession } from "../state/GameSession";
import { WELFARE_EVENTS } from "../data/storyEvents";

type Target = {
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
};

type Dialogue = {
  speaker: string;
  lines: string[];
  page: number;
  choices?: string[];
  choiceIndex: number;
};

export class RoomScene extends Phaser.Scene {
  private x = 480;
  private y = 420;
  private player!: Phaser.GameObjects.Graphics;
  private prompt!: Phaser.GameObjects.Text;
  private dialogue?: Dialogue;
  private dialogueObjects: Phaser.GameObjects.GameObject[] = [];
  private targets: Target[] = [];
  private nearest?: Target;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private puzzleStep = 0;
  private proggithubDone = false;

  constructor() {
    super("RoomScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#101716");
    this.drawRoom();
    this.targets = [
      { id: "proggithub", label: "프로깃허브", x: 728, y: 270, radius: 76 },
      { id: "second", label: "전교 2등", x: 205, y: 246, radius: 70 },
      { id: "puzzle", label: "첫 퍼즐", x: 485, y: 286, radius: 82 },
      { id: "shelf", label: "학생들의 책장", x: 128, y: 392, radius: 62 },
      { id: "door", label: "교육복지실 안쪽 문", x: 480, y: 88, radius: 72 },
    ];

    this.player = this.add.graphics().setDepth(20);
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
    };

    this.prompt = this.add.text(480, 504, "", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#e4cf92",
      backgroundColor: "#0a1011",
      padding: { x: 10, y: 6 },
    }).setOrigin(0.5).setDepth(40);

    if (GameSession.get().bullyRescued) {
      this.openDialogue("도미토리엘", [
        "여기가 교육복지반이란다.",
        "조금 전 일은 잊고 숨을 고르렴. 여기서는 네가 직접 살펴보고 결정해도 괜찮아.",
      ]);
      GameSession.get().bullyRescued = false;
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
      this.x = Phaser.Math.Clamp(this.x + dx / length * speed, 82, 878);
      this.y = Phaser.Math.Clamp(this.y + dy / length * speed, 116, 456);
      this.drawPlayer();
    }

    this.updateNearest();
    if (Phaser.Input.Keyboard.JustDown(this.keys.e)) this.interact();
  }

  private isDown(...names: string[]): boolean {
    return names.some((name) => this.keys[name].isDown);
  }

  private drawRoom(): void {
    const g = this.add.graphics();
    g.fillStyle(0x111918, 1).fillRect(0, 0, 960, 540);
    g.fillStyle(0x263733, 1).fillRect(48, 44, 864, 448);
    g.fillStyle(0x53645a, 1).fillRect(74, 72, 812, 396);

    for (let y = 82; y < 465; y += 34) {
      g.lineStyle(1, 0xb8c1a9, 0.08).lineBetween(76, y, 884, y);
    }
    for (let x = 84; x < 884; x += 42) {
      g.lineStyle(1, 0xb8c1a9, 0.05).lineBetween(x, 74, x, 468);
    }

    // Warm central rug, intentionally irregular rather than a generic rectangle.
    g.fillStyle(0x384842, 1).fillEllipse(480, 330, 470, 190);
    g.lineStyle(2, 0xd2bd88, 0.35).strokeEllipse(480, 330, 450, 170);
    g.lineStyle(1, 0xd2bd88, 0.18).strokeEllipse(480, 330, 380, 125);

    // Books / student traces.
    for (let i = 0; i < 11; i += 1) {
      const x = 94 + i * 9;
      const h = 18 + (i % 4) * 5;
      g.fillStyle(i % 2 ? 0x8a735d : 0x6d7f71, 0.9).fillRect(x, 400 - h, 7, h);
    }
    g.fillStyle(0x172222, 0.8).fillRect(88, 408, 116, 10);
    g.fillStyle(0xcbbd95, 0.5).fillRect(103, 413, 68, 2);

    // Puzzle station.
    g.fillStyle(0x3b4c47, 1).fillRoundedRect(414, 236, 142, 86, 12);
    g.lineStyle(2, 0xd5c28e, 0.55).strokeRoundedRect(414, 236, 142, 86, 12);
    for (let i = 0; i < 3; i += 1) {
      g.fillStyle([0x8a6e62, 0x6d8a7b, 0xb5a26f][i], 1).fillCircle(447 + i * 38, 279, 13);
    }
    g.fillStyle(0xded2b2, 0.35).fillRect(439, 302, 91, 3);

    // Proggithub: a friendly terminal-like teaching creature, not a copied character.
    g.fillStyle(0x1b2728, 1).fillRoundedRect(686, 222, 84, 90, 18);
    g.lineStyle(2, 0x8fb0a0, 0.6).strokeRoundedRect(686, 222, 84, 90, 18);
    g.fillStyle(0x9ec0ad, 0.85).fillCircle(712, 254, 6);
    g.fillStyle(0x9ec0ad, 0.85).fillCircle(744, 254, 6);
    g.lineStyle(2, 0x9ec0ad, 0.7).lineBetween(710, 278, 748, 278);
    g.fillStyle(0x263a35, 1).fillRoundedRect(702, 290, 52, 10, 5);

    // Second-rank student.
    g.fillStyle(0x2a3940, 1).fillRoundedRect(166, 218, 78, 92, 24);
    g.fillStyle(0xd5c29f, 1).fillCircle(205, 198, 29);
    g.fillStyle(0x303b40, 1).fillEllipse(205, 182, 56, 24);
    g.fillStyle(0x20272a, 1).fillCircle(195, 199, 3);
    g.fillStyle(0x20272a, 1).fillCircle(215, 199, 3);
    g.fillStyle(0xd9d0bd, 1).fillRect(155, 266, 100, 45);
    g.fillStyle(0x6d7d77, 0.45).fillRect(165, 274, 80, 3);
    g.fillStyle(0x6d7d77, 0.45).fillRect(165, 285, 60, 3);

    // Exit / inner door.
    g.fillStyle(0x17201f, 1).fillRoundedRect(420, 60, 120, 50, 10);
    g.lineStyle(2, 0xd0bd89, 0.6).strokeRoundedRect(420, 60, 120, 50, 10);
    g.fillStyle(0xbba77b, 0.55).fillCircle(522, 85, 4);

    this.add.text(480, 24, "교육복지반", {
      fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
      fontSize: "20px",
      color: "#efe6cf",
    }).setOrigin(0.5);

    this.add.text(480, 128, "안전한 길을 배우는 곳. 하지만 안전과 선택은 같은 말이 아닐지도 모른다.", {
      fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
      fontSize: "12px",
      color: "#b9c3b6",
    }).setOrigin(0.5);
  }

  private drawPlayer(): void {
    const g = this.player;
    g.clear();
    g.fillStyle(0x0c1213, 0.45).fillEllipse(this.x, this.y + 18, 34, 12);
    g.fillStyle(0x4a6570, 1).fillRoundedRect(this.x - 14, this.y - 1, 28, 36, 7);
    g.fillStyle(0xd7c4a2, 1).fillCircle(this.x, this.y - 12, 12);
    g.fillStyle(0x303a3e, 1).fillEllipse(this.x, this.y - 22, 25, 8);
    g.fillStyle(0x1d2729, 1).fillCircle(this.x - 4, this.y - 12, 1.4);
    g.fillStyle(0x1d2729, 1).fillCircle(this.x + 4, this.y - 12, 1.4);
  }

  private drawHud(): void {
    this.add.rectangle(480, 526, 936, 28, 0x0a1011, 0.95).setDepth(30);
    this.add.text(22, 526, GameSession.get().playerName + "  ·  교육복지반", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#c9c2ad",
    }).setOrigin(0, 0.5).setDepth(31);
    this.add.text(938, 526, "WASD / 방향키 이동   E 조사", {
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
      case "puzzle":
        this.runPuzzle();
        break;
      case "proggithub":
        this.proggithubEncounter();
        break;
      case "second":
        this.secondRankInteraction();
        break;
      case "shelf":
        this.openDialogue("학생들의 책장", [
          "교과서 사이에 그림, 운동 기록, 낡은 악보가 섞여 있다.",
          "누군가의 미래를 한 줄의 성적표로만 정리할 수는 없었던 것 같다.",
        ]);
        break;
      case "door":
        this.openDialogue("출구", [
          "아직은 안쪽으로 더 이어지는 길이 있다.",
          "도미토리엘 선생님이 말한 '안전한 길'은 이 문 너머일지도 모른다.",
        ]);
        break;
    }
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
    if (this.proggithubDone) {
      this.openDialogue("프로깃허브", [
        "이미 기본 메뉴는 배웠다.",
        "이번에는 네가 원하는 방식으로 상황을 해결해 보렴.",
      ]);
      return;
    }
    this.proggithubDone = true;
    this.openDialogue("프로깃허브", WELFARE_EVENTS.proggithub.tutorial, [
      "말을 건다",
      "상태를 살핀다",
      "자비를 시도한다",
    ]);
  }

  private secondRankInteraction(): void {
    this.openDialogue("전교 2등", [
      "책을 꼭 끌어안은 학생이 잠깐 당신을 바라본다.",
      "당신이 무슨 말을 하기도 전에 책장을 넘기며 뒤로 물러난다.",
      "조금 뒤, 그는 공부하러 가겠다는 듯 조용히 사라진다.",
    ]);
    WELFARE_EVENTS.secondRankSeen();
  }

  private openDialogue(speaker: string, lines: string[], choices?: string[]): void {
    this.clearDialogue();
    this.dialogue = { speaker, lines, page: 0, choices, choiceIndex: 0 };
    this.renderDialogue();
  }

  private handleDialogue(): void {
    const d = this.dialogue;
    if (!d) return;

    if (d.choices && d.page >= d.lines.length - 1) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.up) || Phaser.Input.Keyboard.JustDown(this.keys.w)) {
        d.choiceIndex = (d.choiceIndex + d.choices.length - 1) % d.choices.length;
        this.renderDialogue();
      } else if (Phaser.Input.Keyboard.JustDown(this.keys.down) || Phaser.Input.Keyboard.JustDown(this.keys.s)) {
        d.choiceIndex = (d.choiceIndex + 1) % d.choices.length;
        this.renderDialogue();
      } else if (Phaser.Input.Keyboard.JustDown(this.keys.enter) || Phaser.Input.Keyboard.JustDown(this.keys.space)) {
        if (d.speaker === "첫 퍼즐") {
          this.resolvePuzzleChoice(d.choiceIndex);
        } else {
          this.clearDialogue();
          if (d.speaker === "프로깃허브" && d.choiceIndex === 2) {
            this.openDialogue("프로깃허브", [
              "자비를 선택하려는 태도를 확인했다.",
              "하지만 전투 메뉴 자체를 익히는 것이 먼저다. 이제 다음 조우에서는 직접 판단해 보렴.",
            ]);
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
