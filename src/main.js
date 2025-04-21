import Phaser from "phaser";
import TitleScene from "./scenes/TitleScene";
import GameScene from "./scenes/GameScene";

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 800,
  backgroundColor: "#ffffff",
  parent: "game",
  scene: [TitleScene, GameScene], // Load scenes in order
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },
};

new Phaser.Game(config);
