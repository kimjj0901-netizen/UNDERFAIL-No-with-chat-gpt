import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { TitleScene } from "./scenes/TitleScene";
import { NameEntryScene } from "./scenes/NameEntryScene";
import { PrologueScene } from "./scenes/PrologueScene";
import { FlowerFieldScene } from "./scenes/FlowerFieldScene";
import { BullyBattleScene } from "./scenes/BullyBattleScene";
import { RoomScene } from "./scenes/RoomScene";
import { SecondRankEncounterScene } from "./scenes/SecondRankEncounterScene";
import { WelfareCorridorScene } from "./scenes/WelfareCorridorScene";
import { RegularEncounterScene } from "./scenes/RegularEncounterScene";
import { NerdstablookEncounterScene } from "./scenes/NerdstablookEncounterScene";
import { BattleScene } from "./scenes/BattleScene";
import { PrototypeEndScene } from "./scenes/PrototypeEndScene";
import "./style.css";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  width: 960,
  height: 540,
  backgroundColor: "#10151b",
  dom: { createContainer: true },
  scene: [
    BootScene,
    TitleScene,
    NameEntryScene,
    PrologueScene,
    FlowerFieldScene,
    BullyBattleScene,
    RoomScene,
    SecondRankEncounterScene,
    WelfareCorridorScene,
    RegularEncounterScene,
    NerdstablookEncounterScene,
    BattleScene,
    PrototypeEndScene,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
