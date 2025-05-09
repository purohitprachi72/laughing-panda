import Phaser from "phaser";
import TitleScene from "./scenes/TitleScene";
import GameScene from "./scenes/GameScene";
import EndScene from "./scenes/EndScene";

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 800,
  backgroundColor: "#ffffff",
  parent: "game",
  // scene: [EndScene],
  scene: [TitleScene, GameScene, EndScene], // Load scenes in order
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

new Phaser.Game(config);
