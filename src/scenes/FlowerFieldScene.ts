import Phaser from "phaser";
import { GameInput } from "../input/GameInput";
import { Atmosphere } from "../audio/Atmosphere";
import { GameSession } from "../state/GameSession";

export class FlowerFieldScene extends Phaser.Scene {
  private controls!: GameInput;
  private prompt?: Phaser.GameObjects.Text;
  private bully?: Phaser.GameObjects.Image;
  private player?: Phaser.GameObjects.Image;
  private opened = false;

  constructor() {
    super("FlowerFieldScene");
  }

  create(): void {
    this.controls = new GameInput(this);
    Atmosphere.setMood("uneasy");
    Atmosphere.cue("warning");
    GameSession.markBullyEncountered();

    this.add.image(480, 270, "opening-flower-field").setDisplaySize(960, 540);
    this.add.rectangle(480, 270, 960, 540, 0x091621, 0.12);

    this.player = this.add.image(302, 397, "character-player")
      .setDisplaySize(66, 99)
      .setAngle(70)
      .setDepth(12);
    this.tweens.add({
      targets: this.player,
      angle: 0,
      y: 382,
      duration: 1200,
      ease: "Sine.Out",
    });

    this.bully = this.add.image(1004, 355, "character-bully")
      .setDisplaySize(105, 140)
      .setDepth(13);
    this.tweens.add({
      targets: this.bully,
      x: 712,
      duration: 1000,
      delay: 550,
      ease: "Cubic.Out",
    });

    this.add.text(52, 38, "낯선 꽃밭", {
      fontFamily: "'Noto Serif KR', serif",
      fontSize: "18px",
      color: "#e3d4b5",
    }).setDepth(20);

    this.add.text(480, 108, "꽃잎 사이에서 정신을 차렸다.", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "23px",
      color: "#ece4d1",
      stroke: "#12222a",
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(20);

    this.add.text(712, 250, "불리", {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "13px",
      color: "#f0dfc7",
      backgroundColor: "#1c2d33",
      padding: { x: 7, y: 4 },
    }).setOrigin(0.5).setDepth(20);

    this.prompt = this.add.text(480, 492, "Z / ENTER / E  —  앞의 사람에게 다가가기", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#e4d19e",
      backgroundColor: "#0b171d",
      padding: { x: 12, y: 8 },
    }).setOrigin(0.5).setDepth(25);

    this.tweens.add({
      targets: this.bully,
      y: "-=3",
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });

    this.input.on("pointerdown", this.startEncounter, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off("pointerdown", this.startEncounter, this);
    });
  }

  update(): void {
    if (this.opened) return;
    if (this.controls.justPressed("INTERACT")) this.startEncounter();
  }

  private startEncounter(): void {
    if (this.opened) return;
    this.opened = true;
    this.prompt?.setText("불리가 다가온다...");
    Atmosphere.cue("warning");
    this.tweens.add({
      targets: this.bully,
      scaleX: 1.06,
      scaleY: 1.06,
      duration: 220,
      yoyo: true,
      repeat: 1,
    });
    this.time.delayedCall(520, () => this.scene.start("BullyBattleScene"));
  }
}
