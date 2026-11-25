import Phaser from "phaser";
import { PROTOTYPE_DIALOGUE } from "../data/prototypeContent";
import { GameSession } from "../state/GameSession";

export class PrologueScene extends Phaser.Scene {
  private page = 0;
  private bodyText!: Phaser.GameObjects.Text;

  constructor() {
    super("PrologueScene");
  }

  create(): void {
    const name = GameSession.get().playerName;
    this.cameras.main.setBackgroundColor("#171d20");

    const art = this.add.graphics();
    art.fillStyle(0x28383a, 1).fillRect(0, 0, 960, 260);
    art.fillStyle(0xd4bd85, 0.8).fillCircle(770, 112, 38);
    art.fillStyle(0x253439, 1).fillRect(0, 260, 960, 280);
    art.fillStyle(0x202b2d, 1).fillRect(160, 110, 190, 150);
    art.lineStyle(4, 0xb6a77a, 0.9).strokeRect(160, 110, 190, 150);
    art.fillStyle(0x202b2d, 1).fillRect(610, 110, 190, 150);
    art.lineStyle(4, 0xb6a77a, 0.9).strokeRect(610, 110, 190, 150);

    this.add.text(64, 52, "풍화양상 고등학교", {
      fontFamily: "serif",
      fontSize: "22px",
      color: "#f1ead7",
    });
    this.add.text(64, 86, "PROLOGUE / PROTOTYPE", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#b6a77a",
    });

    this.add.rectangle(480, 422, 800, 126, 0x0b1013, 0.92)
      .setStrokeStyle(2, 0xb6a77a, 0.9);

    this.bodyText = this.add.text(112, 382, "", {
      fontFamily: "sans-serif",
      fontSize: "20px",
      color: "#f1ead7",
      wordWrap: { width: 720 },
      lineSpacing: 12,
    });

    this.add.text(824, 470, "ENTER  ▶", {
      fontFamily: "monospace",
      fontSize: "13px",
      color: "#e3c77f",
    }).setOrigin(1, 0.5);

    const lines = [...PROTOTYPE_DIALOGUE.prologue];
    lines[0] = name + "은(는) 풍화양상 고등학교의 교문 앞에 서 있다.";
    this.pages = lines;
    this.bodyText.setText(this.pages[0]);

    this.input.keyboard?.on("keydown-ENTER", this.nextPage, this);
    this.input.keyboard?.on("keydown-SPACE", this.nextPage, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off("keydown-ENTER", this.nextPage, this);
      this.input.keyboard?.off("keydown-SPACE", this.nextPage, this);
    });
  }

  private pages: string[] = [];

  private nextPage(): void {
    this.page += 1;
    if (this.page >= this.pages.length) {
      this.scene.start("RoomScene");
      return;
    }
    this.bodyText.setText(this.pages[this.page]);
  }
}
