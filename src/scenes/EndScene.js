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
  }

  create() {
    // test code
    // this.isHappy = true;
    // this.noodlesCaught = 3;
    // this.ingredientsCaught = 2;

    this.cameras.main.fadeIn(500, 255, 255, 255); // White fade-in
  
    this.add.image(0, 0, "background").setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);
  
    let message = "";
    let imageKey = "";
  
    if (this.isHappy) {
      message = "You made the perfect bowl! 🍜✨";
      imageKey = "happy-eating";
    } else if (this.noodlesCaught < 3) {
      message = "Oh no! You did not collect all the noodles :(";
      imageKey = "sad-rainy";
    } else {
      message = "Uh-oh! You did not collect enough veggies :(";
      imageKey = "sad-windy";
    }
    
    const text = this.add.text(240, 100, message, {
      fontSize: "24px",
      fill: "#fff",
      fontFamily: "Comic Sans MS",
      stroke: "#000",
      strokeThickness: 4,
    }).setOrigin(0.5).setAlpha(0);
    
    this.tweens.add({
      targets: text,
      y: 100,
      alpha: 1,
      ease: "Bounce.easeOut",
      delay: 300,
      duration: 800
    });

    const panda = this.add.image(240, 550, imageKey).setScale(0.4).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(800, () => {
      this.tweens.add({
        targets: panda,
        alpha: 1,
        duration: 800
      });
    });
    
    const replayBtn = this.add.text(240, 250, "▶ Replay", {
      fontSize: "28px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#00c853",
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setAlpha(0);
  
    const homeBtn = this.add.text(240, 320, "🏠 Home", {
      fontSize: "24px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#2962ff",
      padding: { x: 20, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setAlpha(0);

    this.time.delayedCall(1800, () => {
      this.tweens.add({
        targets: [replayBtn, homeBtn],
        alpha: 1,
        duration: 600
      });
    });
  
    this.time.delayedCall(500, () => {
      this.tweens.add({ targets: [text, panda], alpha: 1, duration: 600 });
    });
  
    this.time.delayedCall(1100, () => {
      this.tweens.add({ targets: [replayBtn, homeBtn], alpha: 1, duration: 600 });
    });
  
    replayBtn.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  
    homeBtn.on("pointerdown", () => {
      this.scene.start("TitleScene");
    });
  }
}