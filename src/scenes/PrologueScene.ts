import Phaser from "phaser";
import { OPENING_PAGES } from "../data/openingContent";
import { Atmosphere } from "../audio/Atmosphere";
import { GameSession } from "../state/GameSession";

export class PrologueScene extends Phaser.Scene {
  private page = 0;
  private backdrop!: Phaser.GameObjects.Image;
  private kicker!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private pageText!: Phaser.GameObjects.Text;
  private continuation!: Phaser.GameObjects.Text;
  private detailTag?: Phaser.GameObjects.Text;
  private advancing = false;

  constructor() {
    super("PrologueScene");
  }

  create(): void {
    this.backdrop = this.add.image(480, 270, OPENING_PAGES[0].image).setDisplaySize(960, 540);
    this.add.rectangle(480, 270, 960, 540, 0x08131a, 0.12);

    const panel = this.add.rectangle(480, 425, 890, 154, 0x101c22, 0.92)
      .setStrokeStyle(2, 0xb8a57c, 0.92);
    panel.setDepth(10);
    this.add.rectangle(480, 425, 874, 138, 0x182a2d, 0.48)
      .setStrokeStyle(1, 0x6c8176, 0.75)
      .setDepth(10);

    this.kicker = this.add.text(84, 367, "", {
      fontFamily: "'Noto Serif KR', serif",
      fontSize: "25px",
      color: "#e9d7ad",
      fontStyle: "bold",
    }).setDepth(11);

    this.bodyText = this.add.text(84, 411, "", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "19px",
      color: "#f0e8d7",
      wordWrap: { width: 770 },
      lineSpacing: 9,
    }).setDepth(11);

    this.pageText = this.add.text(84, 490, "", {
      fontFamily: "monospace",
      fontSize: "10px",
      color: "#9eae9f",
      letterSpacing: 1,
    }).setDepth(11);

    this.continuation = this.add.text(866, 488, "ENTER  ▶", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#e1c994",
    }).setOrigin(1, 0.5).setDepth(11);

    this.input.keyboard?.on("keydown-ENTER", this.advance, this);
    this.input.keyboard?.on("keydown-SPACE", this.advance, this);
    this.input.on("pointerdown", this.advance, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off("keydown-ENTER", this.advance, this);
      this.input.keyboard?.off("keydown-SPACE", this.advance, this);
      this.input.off("pointerdown", this.advance, this);
    });

    this.renderPage();
    this.cameras.main.fadeIn(450, 0, 0, 0);
  }

  private renderPage(): void {
    const page = OPENING_PAGES[this.page];
    this.tweens.killTweensOf(this.backdrop);
    this.backdrop.setTexture(page.image).setAlpha(0.76).setScale(1.015);
    this.tweens.add({
      targets: this.backdrop,
      alpha: 1,
      scale: 1.045,
      duration: 3600,
      ease: "Sine.InOut",
    });

    this.kicker.setText(page.kicker);
    this.bodyText.setText(page.body);
    this.pageText.setText(page.pageLabel + "   " + page.status);
    this.detailTag?.destroy();
    this.detailTag = undefined;

    if (this.page === 3) {
      this.detailTag = this.add.text(712, 299, "고교 배정 통지서", {
        fontFamily: "'Noto Serif KR', serif",
        fontSize: "17px",
        color: "#303a38",
        backgroundColor: "#e4d6b8",
        padding: { x: 10, y: 7 },
      }).setOrigin(0.5).setAngle(-5).setDepth(5);
    }

    if (this.page === 2) {
      Atmosphere.cue("paper");
    }
    Atmosphere.setMood(page.mood);
    this.continuation.setText(this.page === OPENING_PAGES.length - 1 ? "꽃밭으로  ▶" : "ENTER  ▶");
  }

  private advance(): void {
    if (this.advancing) return;
    this.advancing = true;
    this.time.delayedCall(170, () => { this.advancing = false; });

    if (this.page < OPENING_PAGES.length - 1) {
      this.page += 1;
      this.renderPage();
      return;
    }

    GameSession.markPrologueViewed();
    this.cameras.main.fadeOut(650, 4, 10, 15);
    Atmosphere.cue("warning");
    this.time.delayedCall(680, () => this.scene.start("FlowerFieldScene"));
  }
}
