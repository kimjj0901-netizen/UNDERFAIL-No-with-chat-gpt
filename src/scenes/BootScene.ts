import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload(): void {
    // Shared original SVG assets are loaded once and reused by later Scenes.
    this.load.svg("title-art", "/assets/title/title_art.svg", { width: 960, height: 540 });
    this.load.svg("opening-past-school", "/assets/opening/past_school.svg", { width: 960, height: 540 });
    this.load.svg("opening-closure", "/assets/opening/closure_document.svg", { width: 960, height: 540 });
    this.load.svg("opening-present", "/assets/opening/present_school.svg", { width: 960, height: 540 });
    this.load.svg("opening-flower-field", "/assets/opening/flower_field.svg", { width: 960, height: 540 });

    this.load.svg("character-player", "/assets/characters/player_student.svg", { width: 120, height: 180 });
    this.load.svg("character-bully", "/assets/characters/bully_student.svg", { width: 180, height: 240 });
    this.load.svg("character-domitoriell", "/assets/characters/domitoriell_teacher.svg", { width: 190, height: 260 });
    this.load.svg("character-proggithub", "/assets/characters/proggithub.svg", { width: 120, height: 150 });
    this.load.svg("character-second-rank", "/assets/characters/second_rank_student.svg", { width: 120, height: 170 });

    this.load.svg("promise-petal", "/assets/effects/promise_petal.svg", { width: 64, height: 64 });
    this.load.svg("battle-marker", "/assets/effects/battle_marker.svg", { width: 64, height: 64 });
    this.load.svg("rescue-arc", "/assets/effects/rescue_arc.svg", { width: 960, height: 340 });
    this.load.svg("welfare-classroom", "/assets/rooms/welfare_classroom.svg", { width: 960, height: 540 });
    this.load.svg("warm-thermos", "/assets/items/warm_thermos.svg", { width: 90, height: 110 });
  }

  create(): void {
    this.scene.start("TitleScene");
  }
}
