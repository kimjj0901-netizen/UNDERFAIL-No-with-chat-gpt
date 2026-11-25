import Phaser from "phaser";
import { PROTOTYPE_DIALOGUE, PROTOTYPE_SETTINGS } from "../data/prototypeContent";
import { GameSession } from "../state/GameSession";

type RoomTarget = {
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
  kind: "object" | "domitoriell" | "exit";
};

type DialogueState = {
  speaker: string;
  lines: string[];
  page: number;
  choices?: string[];
  choiceIndex: number;
  onChoose?: (index: number) => void;
};

const ROOM_BOUNDS = { left: 82, right: 878, top: 78, bottom: 458 };
const OBSTACLES = [
  { x: 132, y: 142, width: 142, height: 72 },
  { x: 680, y: 140, width: 158, height: 78 },
  { x: 118, y: 350, width: 178, height: 70 },
  { x: 390, y: 266, width: 172, height: 72 },
];

export class RoomScene extends Phaser.Scene {
  private playerX = 480;
  private playerY = 414;
  private playerGraphic!: Phaser.GameObjects.Graphics;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private dialogue?: DialogueState;
  private dialogueObjects: Phaser.GameObjects.GameObject[] = [];
  private promptText!: Phaser.GameObjects.Text;
  private targets: RoomTarget[] = [];
  private nearestTarget?: RoomTarget;

  constructor() {
    super("RoomScene");
  }

  create(): void {
    const session = GameSession.get();
    this.cameras.main.setBackgroundColor("#172126");
    this.drawRoom();
    this.createTargets();

    this.playerGraphic = this.add.graphics().setDepth(15);
    this.drawPlayer();
    this.drawDomitoriell();
    this.drawHud();

    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error("Keyboard input is unavailable in RoomScene.");

    this.keys = {
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      w: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      interact: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      enter: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
      space: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };

    this.promptText = this.add.text(480, 502, "", {
      fontFamily: "monospace",
      fontSize: "13px",
      color: "#e3c77f",
      backgroundColor: "#101619",
      padding: { x: 10, y: 6 },
    }).setOrigin(0.5).setDepth(30);

    if (session.domitoriellPeaceResolved) {
      this.openDialogue("도미토리엘", [...PROTOTYPE_DIALOGUE.domitoriellAfter]);
    } else if (!session.domitoriellIntroduced) {
      this.openDialogue("도미토리엘", [...PROTOTYPE_DIALOGUE.roomWelcome]);
      session.domitoriellIntroduced = true;
    }
  }

  update(_time: number, delta: number): void {
    if (this.dialogue) {
      this.handleDialogueInput();
      return;
    }

    const dt = Math.min(delta, 40) / 1000;
    let dx = 0;
    let dy = 0;
    if (this.isDown("left", "a")) dx -= 1;
    if (this.isDown("right", "d")) dx += 1;
    if (this.isDown("up", "w")) dy -= 1;
    if (this.isDown("down", "s")) dy += 1;

    if (dx !== 0 || dy !== 0) {
      const length = Math.hypot(dx, dy) || 1;
      dx = (dx / length) * PROTOTYPE_SETTINGS.playerSpeed * dt;
      dy = (dy / length) * PROTOTYPE_SETTINGS.playerSpeed * dt;
      this.movePlayer(dx, dy);
    }

    this.drawPlayer();
    this.updateNearestTarget();

    if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
      this.interact();
    }
  }

  private isDown(...names: string[]): boolean {
    return names.some((name) => this.keys[name]?.isDown ?? false);
  }

  private drawRoom(): void {
    const g = this.add.graphics();
    g.fillStyle(0x202f32).fillRect(0, 0, 960, 540);
    g.fillStyle(0x344447).fillRect(64, 48, 832, 440);
    g.fillStyle(0x58655a).fillRect(82, 78, 796, 380);

    g.lineStyle(1, 0x6d7865, 0.2);
    for (let x = 94; x < 875; x += 42) g.lineBetween(x, 90, x, 456);
    for (let y = 102; y < 458; y += 42) g.lineBetween(84, y, 876, y);

    g.fillStyle(0x172326)
      .fillRect(64, 48, 832, 24)
      .fillRect(64, 72, 18, 416)
      .fillRect(878, 72, 18, 416)
      .fillRect(64, 488, 832, 18);
    g.fillStyle(0xb6a77a).fillRect(428, 54, 104, 18);
    g.fillStyle(0x5c4639).fillRect(438, 74, 84, 13);
    g.lineStyle(2, 0xdbc895).strokeRect(438, 74, 84, 13);

    // Rug and room details.
    g.fillStyle(0x293b3d).fillRect(320, 350, 320, 94);
    g.lineStyle(2, 0xb6a77a, 0.85).strokeRect(330, 360, 300, 74);
    g.lineStyle(1, 0xb6a77a, 0.42).lineBetween(330, 397, 630, 397);

    // Furniture shapes are temporary, replaceable prototype art.
    this.drawFurniture(g, 132, 142, 142, 72, 0x6e5947, "책장");
    this.drawFurniture(g, 680, 140, 158, 78, 0x6d5848, "게시판");
    this.drawFurniture(g, 118, 350, 178, 70, 0x485a58, "낮은 수납장");
    this.drawFurniture(g, 390, 266, 172, 72, 0x79674e, "테이블");

    g.fillStyle(0x263d34).fillCircle(830, 386, 22);
    g.fillStyle(0x78906b).fillEllipse(818, 376, 22, 34);
    g.fillStyle(0x78906b).fillEllipse(840, 372, 24, 36);
    g.fillStyle(0x6d5642).fillRect(814, 395, 34, 16);
    g.lineStyle(2, 0xb6a77a, 0.65).strokeRect(710, 252, 132, 70);
    g.fillStyle(0x283b3a).fillRect(715, 257, 122, 60);
    g.fillStyle(0xe0d3b3, 0.9).fillRect(728, 267, 96, 3);
    g.fillStyle(0xe0d3b3, 0.5).fillRect(728, 278, 68, 2);
    g.fillStyle(0xe0d3b3, 0.5).fillRect(728, 288, 84, 2);

    this.add.text(480, 28, "교육복지실", {
      fontFamily: "serif",
      fontSize: "18px",
      color: "#d8d0b9",
    }).setOrigin(0.5);
    this.add.text(480, 92, "출입문", {
      fontFamily: "sans-serif",
      fontSize: "11px",
      color: "#ddc990",
    }).setOrigin(0.5);
  }

  private drawFurniture(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    width: number,
    height: number,
    color: number,
    label: string,
  ): void {
    graphics.fillStyle(0x172326, 0.45).fillRect(x + 5, y + 7, width, height);
    graphics.fillStyle(color).fillRect(x, y, width, height);
    graphics.lineStyle(2, 0x2a2925).strokeRect(x, y, width, height);
    graphics.lineStyle(1, 0xd8c49a, 0.42).lineBetween(x + 8, y + 9, x + width - 8, y + 9);
    this.add.text(x + width / 2, y + height / 2, label, {
      fontFamily: "sans-serif",
      fontSize: "13px",
      color: "#e4d8bd",
    }).setOrigin(0.5);
  }

  private drawDomitoriell(): void {
    const g = this.add.graphics().setDepth(12);
    g.fillStyle(0x182226, 0.45).fillEllipse(510, 231, 58, 15);
    g.fillStyle(0x8a735b).fillRoundedRect(482, 183, 56, 50, 10);
    g.fillStyle(0x9c866b).fillEllipse(510, 166, 44, 54);
    g.fillStyle(0x3a3029).fillEllipse(510, 150, 43, 25);
    g.fillStyle(0x1c2424).fillCircle(499, 168, 3);
    g.fillStyle(0x1c2424).fillCircle(521, 168, 3);
    g.lineStyle(2, 0x3d3027).lineBetween(502, 183, 518, 183);
    this.add.text(510, 128, "도미토리엘", {
      fontFamily: "sans-serif",
      fontSize: "12px",
      color: "#f0e7d3",
      backgroundColor: "#263638",
      padding: { x: 5, y: 3 },
    }).setOrigin(0.5).setDepth(14);
  }

  private drawHud(): void {
    const name = GameSession.get().playerName || "학생";
    this.add.rectangle(480, 525, 930, 28, 0x11191c, 0.95).setDepth(25);
    this.add.text(24, 525, name + "  ·  교육복지실", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#c9c3ae",
    }).setOrigin(0, 0.5).setDepth(26);
    this.add.text(936, 525, "WASD / 방향키 이동   E 조사", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#9eac9e",
    }).setOrigin(1, 0.5).setDepth(26);
    this.add.text(24, 476, "PROTOTYPE ROOM", {
      fontFamily: "monospace",
      fontSize: "9px",
      color: "#d9c28e",
    }).setDepth(20);
  }

  private createTargets(): void {
    this.targets = [
      { id: "bookshelf", label: "책장", x: 205, y: 235, radius: 58, kind: "object" },
      { id: "noticeboard", label: "게시판", x: 775, y: 337, radius: 60, kind: "object" },
      { id: "thermos", label: "보온병", x: 470, y: 390, radius: 54, kind: "object" },
      { id: "domitoriell", label: "도미토리엘 선생님", x: 510, y: 202, radius: 76, kind: "domitoriell" },
      { id: "exit", label: "출입문", x: 480, y: 91, radius: 72, kind: "exit" },
    ];

    for (const target of this.targets) {
      this.add.circle(target.x, target.y, 3, 0xe2cb89, 0.9).setDepth(5);
    }
  }

  private drawPlayer(): void {
    const g = this.playerGraphic;
    g.clear();
    g.fillStyle(0x101719, 0.35).fillEllipse(this.playerX, this.playerY + 13, 34, 12);
    g.fillStyle(0x334e58).fillRoundedRect(this.playerX - 12, this.playerY - 2, 24, 29, 5);
    g.fillStyle(0xd8c5a0).fillCircle(this.playerX, this.playerY - 11, 11);
    g.fillStyle(0x283035).fillRect(this.playerX - 11, this.playerY - 18, 22, 6);
    g.fillStyle(0x263239).fillCircle(this.playerX - 4, this.playerY - 11, 1.3);
    g.fillStyle(0x263239).fillCircle(this.playerX + 4, this.playerY - 11, 1.3);
  }

  private movePlayer(dx: number, dy: number): void {
    const nextX = Phaser.Math.Clamp(this.playerX + dx, ROOM_BOUNDS.left, ROOM_BOUNDS.right);
    if (!this.collides(nextX, this.playerY)) this.playerX = nextX;
    const nextY = Phaser.Math.Clamp(this.playerY + dy, ROOM_BOUNDS.top, ROOM_BOUNDS.bottom);
    if (!this.collides(this.playerX, nextY)) this.playerY = nextY;
  }

  private collides(x: number, y: number): boolean {
    const radius = 12;
    for (const obstacle of OBSTACLES) {
      const nearestX = Phaser.Math.Clamp(x, obstacle.x, obstacle.x + obstacle.width);
      const nearestY = Phaser.Math.Clamp(y, obstacle.y, obstacle.y + obstacle.height);
      if (Math.hypot(x - nearestX, y - nearestY) < radius) return true;
    }

    if (!GameSession.get().domitoriellPeaceResolved) {
      const nearestX = Phaser.Math.Clamp(x, 426, 534);
      const nearestY = Phaser.Math.Clamp(y, 70, 113);
      if (Math.hypot(x - nearestX, y - nearestY) < radius) return true;
    }
    return false;
  }

  private updateNearestTarget(): void {
    let nearest: RoomTarget | undefined;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const target of this.targets) {
      if (target.kind === "exit" && !GameSession.get().domitoriellPeaceResolved) continue;
      const distance = Math.hypot(this.playerX - target.x, this.playerY - target.y);
      if (distance <= target.radius && distance < nearestDistance) {
        nearest = target;
        nearestDistance = distance;
      }
    }

    this.nearestTarget = nearest;
    this.promptText.setText(nearest ? "E  " + nearest.label + " 조사하기" : "");
  }

  private interact(): void {
    const target = this.nearestTarget;
    if (!target) return;

    if (target.kind === "exit") {
      this.scene.start("PrototypeEndScene");
      return;
    }

    if (target.kind === "domitoriell") {
      const session = GameSession.get();
      if (session.domitoriellPeaceResolved) {
        this.openDialogue("도미토리엘", [...PROTOTYPE_DIALOGUE.domitoriellAfter]);
        return;
      }

      this.openDialogue(
        "도미토리엘",
        [...PROTOTYPE_DIALOGUE.domitoriellFirst],
        [
          "선생님께 하고 싶은 말을 한다.",
          "조금 더 둘러본다.",
        ],
        (index) => {
          if (index === 0) {
            this.scene.start("BattleScene");
          } else {
            this.openDialogue("도미토리엘", ["그래. 천천히 둘러보렴. 모르는 게 있으면 언제든 물어보렴."]);
          }
        },
      );
      return;
    }

    GameSession.inspect(target.id);
    if (target.id === "bookshelf") {
      this.openDialogue("책장", [...PROTOTYPE_DIALOGUE.bookshelf]);
    } else if (target.id === "noticeboard") {
      this.openDialogue("게시판", [...PROTOTYPE_DIALOGUE.noticeboard]);
    } else if (target.id === "thermos") {
      const acquired = GameSession.acquireWarmTea();
      this.openDialogue(
        "보온병",
        acquired ? [...PROTOTYPE_DIALOGUE.thermosFirst] : [...PROTOTYPE_DIALOGUE.thermosAgain],
      );
    }
  }

  private openDialogue(
    speaker: string,
    lines: string[],
    choices?: string[],
    onChoose?: (index: number) => void,
  ): void {
    this.closeDialogue();
    this.dialogue = { speaker, lines, page: 0, choices, choiceIndex: 0, onChoose };
    this.renderDialogue();
  }

  private handleDialogueInput(): void {
    const dialogue = this.dialogue;
    if (!dialogue) return;

    if (!dialogue.choices || dialogue.page < dialogue.lines.length - 1) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.enter) || Phaser.Input.Keyboard.JustDown(this.keys.space)) {
        dialogue.page += 1;
        if (dialogue.page >= dialogue.lines.length && !dialogue.choices) {
          this.closeDialogue();
        } else {
          this.renderDialogue();
        }
      }
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.up) || Phaser.Input.Keyboard.JustDown(this.keys.w)) {
      dialogue.choiceIndex = (dialogue.choiceIndex + dialogue.choices.length - 1) % dialogue.choices.length;
      this.renderDialogue();
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.down) || Phaser.Input.Keyboard.JustDown(this.keys.s)) {
      dialogue.choiceIndex = (dialogue.choiceIndex + 1) % dialogue.choices.length;
      this.renderDialogue();
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.enter) || Phaser.Input.Keyboard.JustDown(this.keys.space)) {
      const selected = dialogue.choiceIndex;
      const callback = dialogue.onChoose;
      this.closeDialogue();
      callback?.(selected);
    }
  }

  private renderDialogue(): void {
    this.clearDialogueObjects();
    const dialogue = this.dialogue;
    if (!dialogue) return;

    const panel = this.add.graphics().setDepth(40);
    panel.fillStyle(0x080d10, 0.96).fillRect(48, 350, 864, 150);
    panel.lineStyle(2, 0xb6a77a, 1).strokeRect(48, 350, 864, 150);
    panel.lineStyle(1, 0x65736c, 0.8).strokeRect(55, 357, 850, 136);
    this.dialogueObjects.push(panel);

    this.dialogueObjects.push(
      this.add.text(76, 362, dialogue.speaker, {
        fontFamily: "sans-serif",
        fontSize: "15px",
        color: "#e3c77f",
        fontStyle: "bold",
      }).setDepth(41),
    );

    this.dialogueObjects.push(
      this.add.text(76, 393, dialogue.lines[Math.min(dialogue.page, dialogue.lines.length - 1)] ?? "", {
        fontFamily: "sans-serif",
        fontSize: "17px",
        color: "#f1ead7",
        wordWrap: { width: 790 },
        lineSpacing: 7,
      }).setDepth(41),
    );

    if (dialogue.page < dialogue.lines.length - 1) {
      this.dialogueObjects.push(
        this.add.text(884, 474, "ENTER  ▶", {
          fontFamily: "monospace",
          fontSize: "12px",
          color: "#b6a77a",
        }).setOrigin(1, 0.5).setDepth(41),
      );
      return;
    }

    if (dialogue.choices) {
      dialogue.choices.forEach((choice, index) => {
        const selected = index === dialogue.choiceIndex;
        this.dialogueObjects.push(
          this.add.text(98, 394 + index * 28, (selected ? "▶  " : "    ") + choice, {
            fontFamily: "sans-serif",
            fontSize: "16px",
            color: selected ? "#f2d58f" : "#bdc7bc",
          }).setDepth(41),
        );
      });
      this.dialogueObjects.push(
        this.add.text(884, 474, "↑↓ 선택 · ENTER 확정", {
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#b6a77a",
        }).setOrigin(1, 0.5).setDepth(41),
      );
    } else {
      this.dialogueObjects.push(
        this.add.text(884, 474, "ENTER  ▶", {
          fontFamily: "monospace",
          fontSize: "12px",
          color: "#b6a77a",
        }).setOrigin(1, 0.5).setDepth(41),
      );
    }
  }

  private clearDialogueObjects(): void {
    for (const object of this.dialogueObjects) object.destroy();
    this.dialogueObjects = [];
  }

  private closeDialogue(): void {
    this.clearDialogueObjects();
    this.dialogue = undefined;
    this.promptText?.setText("");
  }
}
