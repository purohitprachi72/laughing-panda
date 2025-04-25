import Phaser from "phaser";
import { music, toggleMusic } from "../utils/MusicManager"; // Music manager import

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  preload() {
    this.load.image("background", "/background1.png");
    this.load.image("pandaIntro", "/panda-intro.png");
    this.load.image("settings", "/settings.png");
    this.load.image("title-img", "/title-img.png"); // 🎯 Title image
    this.load.audio("bgMusic", "/audio_hero_Yellow-Cafe_SIPML_C-0361.mp3");
  }

  create() {
    this.cameras.main.fadeIn(1000, 255, 255, 255);

    // Background
    this.add.image(0, 0, "background")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height);

    // 1️⃣ Title Image (Bounce Effect)
    const titleImage = this.add.image(240, 50, "title-img")
      .setOrigin(0.5)
      .setScale(0.3)
      .setAlpha(0);

    this.tweens.add({
      targets: titleImage,
      y: 150,
      alpha: 1,
      ease: "Bounce.easeOut",
      delay: 500,
      duration: 1000,
    });

    // 2️⃣ Panda Image
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

    // 3️⃣ Play Button
    const playBtn = this.add.text(240, 280, "▶ PLAY", {
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

    // Play Button click
    playBtn.on("pointerdown", () => {
      if (!window.__music) {
        window.__music = this.sound.add("bgMusic", { loop: true, volume: 0.8 });
        window.__music.play();
      }
      this.scene.start("GameScene");
    });    

    // ⚙️ Settings Icon
    const settingsIcon = this.add.image(50, 50, "settings") // 💬 adjust kar diya thoda left-top
      .setScale(0.08)
      .setInteractive({ useHandCursor: true });

    // Popup Rectangle
    const settingsPopup = this.add.rectangle(240, 400, 250, 160, 0x000000, 0.8)
      .setStrokeStyle(2, 0xffffff)
      .setVisible(false);

    // Popup Options
    const musicToggleBtn = this.add.text(240, 350, "Music: ON", {
      fontSize: "20px",
      fill: "#ffffff",
      fontFamily: "Arial",
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false);

    const creditsBtn = this.add.text(240, 400, "Credits", {
      fontSize: "20px",
      fill: "#ffffff",
      fontFamily: "Arial",
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false);

    const writeBtn = this.add.text(240, 450, "Suggest a good title", {
      fontSize: "20px",
      fill: "#ffffff",
      fontFamily: "Arial",
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false);

    // Popup Logic
    let popupVisible = false;

    settingsIcon.on("pointerdown", () => {
      popupVisible = !popupVisible;
      settingsPopup.setVisible(popupVisible);
      musicToggleBtn.setVisible(popupVisible);
      creditsBtn.setVisible(popupVisible);
      writeBtn.setVisible(popupVisible);
    });

    // Music toggle
    musicToggleBtn.on("pointerdown", () => {
      toggleMusic(this);
      musicToggleBtn.setText(window.__music?.isPlaying ? "Music: ON" : "Music: OFF");
    });

    // Credits click
    creditsBtn.on("pointerdown", () => {
      alert("Audio credits to Zapsplat.com ❤️");
    });

    // Write to us click
    writeBtn.on("pointerdown", () => {
      alert("Contact: purohitprachi72@email.com 📧");
    });
  }
}