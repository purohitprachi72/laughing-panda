import Phaser from "phaser";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  preload() {
    this.load.image("background", "/background1.png");
    this.load.image("pandaIntro", "/panda-intro.png"); 
    // this.load.image("playButton", "/play-button.png");
  }

  create() {
    const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
    bg.setDisplaySize(this.scale.width, this.scale.height);

    this.add
      .text(240, 150, "Laughing Panda", {
        fontSize: "36px",
        fill: "#ffcc00",
        fontFamily: "Comic Sans MS", // or "Caveat", "Chalkduster" etc if loaded
        stroke: "#000",
        strokeThickness: 5,
      })
      .setOrigin(0.5);

    this.add.image(240, 590, "pandaIntro").setScale(0.35).setOrigin(0.5);

    const playBtn = this.add
      .text(240, 250, "▶ PLAY", {
        fontSize: "32px",
        fill: "#ffffff",
        fontFamily: "Arial",
        backgroundColor: "#00c853",
        padding: { x: 20, y: 10 },
        borderRadius: 10,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    playBtn.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}
