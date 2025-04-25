import Phaser from "phaser";

export default class EndScene extends Phaser.Scene {
  constructor() {
    super("EndScene");
  }

  init(data) {
    this.isHappy = data.isHappy;
    this.noodlesCaught = data.noodlesCaught;
    this.ingredientsCaught = data.ingredientsCaught;
  }

  preload() {
    this.load.image("background", "/background1.png");
    this.load.image("happy-eating", "/happy-eating.png");
    this.load.image("sad-rainy", "/sad-rainy.png");
    this.load.image("sad-windy", "/sad-windy.png");
    this.load.image("perfect-text", "/perfect-text.png");
    this.load.image("rainy-text", "/rainy-text.png");
    this.load.image("windy-text", "/windy-text.png");
  }

  create() {

    // test code
    // this.isHappy = false;
    // this.noodlesCaught = 2;
    // this.ingredientsCaught = 8;

    this.cameras.main.fadeIn(1000, 255, 255, 255); // white fade in

    this.add.image(0, 0, "background")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height);

    let imageKey = "";
    let textImageKey = "";

    if (this.isHappy) {
      imageKey = "happy-eating";
      textImageKey = "perfect-text";
    } else if (this.noodlesCaught < 3) {
      imageKey = "sad-rainy";
      textImageKey = "rainy-text";
    } else {
      imageKey = "sad-windy";
      textImageKey = "windy-text";
    }

    const textBanner = this.add.image(250, 50, textImageKey)
      .setScale(0.25)
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: textBanner,
      y: 150,
      alpha: 1,
      ease: "Bounce.easeOut",
      delay: 500,
      duration: 1000,
    });

    const panda = this.add.image(240, 550, imageKey)
      .setScale(0.4)
      .setOrigin(0.5)
      .setAlpha(0);

    this.time.delayedCall(1600, () => {
      this.tweens.add({
        targets: panda,
        alpha: 1,
        duration: 1000,
      });
    });

    const replayBtn = this.add.text(240, 260, "▶ Replay", {
      fontSize: "28px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#00c853",
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0);

    const homeBtn = this.add.text(240, 320, "🏠 Home", {
      fontSize: "24px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#2962ff",
      padding: { x: 20, y: 8 },
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0);

    this.time.delayedCall(2800, () => {
      this.tweens.add({
        targets: [replayBtn, homeBtn],
        alpha: 1,
        duration: 600,
      });
    });

    replayBtn.on("pointerdown", () => {
      this.scene.start("GameScene");
    });

    homeBtn.on("pointerdown", () => {
      this.scene.start("TitleScene");
    });
  }
}