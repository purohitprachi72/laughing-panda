import Phaser from "phaser";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  preload() {
    this.load.image("background", "/background1.png");
    this.load.image("pandaIntro", "/panda-intro.png");
    this.load.audio("bgMusic", "/audio_hero_Yellow-Cafe_SIPML_C-0361.mp3");
  }

  create() {
    // white fade in
    this.cameras.main.fadeIn(1000, 255, 255, 255);
  
    // background
    this.add.image(0, 0, "background")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height);
  
    // 1️⃣ Title text
    const titleText = this.add.text(240, 80, "Laughing Panda", {
      fontSize: "36px",
      fill: "#ffcc00",
      fontFamily: "Comic Sans MS",
      stroke: "#000",
      strokeThickness: 5,
    }).setOrigin(0.5).setAlpha(0);
  
    this.tweens.add({
      targets: titleText,
      y: 150,
      alpha: 1,
      ease: "Bounce.easeOut",
      delay: 500,
      duration: 1000,
    });
  
    // 2️⃣ Panda image
    const panda = this.add.image(240, 590, "pandaIntro")
      .setScale(0.35)
      .setOrigin(0.5)
      .setAlpha(0);
  
    this.time.delayedCall(1600, () => {
      this.tweens.add({
        targets: panda,
        alpha: 1,
        duration: 1000,
      });
    });
  
    // 3️⃣ Play button
    const playBtn = this.add.text(240, 260, "▶ PLAY", {
      fontSize: "32px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#00c853",
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0);
  
    this.time.delayedCall(2800, () => {
      this.tweens.add({
        targets: playBtn,
        alpha: 1,
        duration: 600,
      });
    });
  
    // 4️⃣ Button click — play music THEN switch scene
    playBtn.on("pointerdown", () => {
      if (!this.music) {
        this.music = this.sound.add("bgMusic", {
          loop: true,
          volume: 0.8, // More thump
        });
        this.music.play();
      }
  
      this.scene.start("GameScene");
    });
  }  
}
