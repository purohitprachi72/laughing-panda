import Phaser from "phaser";

let score = 0;
let lives = 3;
let gameOver = false;
let baseSpeed = 200;
let currentSpeed = baseSpeed;
let maxSpeed = 800;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("background", "/background1.png");
    this.load.image("panda", "/panda.png");
    this.load.image("noodle", "/noodle.png");
  }

  create() {
    score = 0;
    lives = 3;
    gameOver = false;

    const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
    bg.setDisplaySize(this.scale.width, this.scale.height);

    this.panda = this.physics.add.sprite(240, 700, "panda").setScale(0.25);
    this.panda.setCollideWorldBounds(true);
    this.panda.setGravityY(0);
    this.panda.setImmovable(true);

    this.panda.body.setSize(
      this.panda.width * 0.6,
      this.panda.height * 0.8,
      true
    );

    this.noodlesGroup = this.physics.add.group();

    this.scoreText = this.add.text(20, 20, "Score: 0", {
      fontSize: "32px",
      fill: "#fff",
      fontFamily: "Arial",
      stroke: "#000",
      strokeThickness: 4,
    });

    this.livesText = this.add.text(340, 20, "Lives: 3", {
      fontSize: "28px",
      fill: "#fff",
      fontFamily: "Arial",
      stroke: "#000",
      strokeThickness: 3,
    });

    this.noodleTimer = this.time.addEvent({
      delay: 3000,
      callback: () => {
        if (gameOver) return;

        const randomX = Phaser.Math.Between(50, 430);
        const noodle = this.physics.add
          .sprite(randomX, 100, "noodle")
          .setScale(0.1);
        noodle.setVelocityY(currentSpeed);

        this.noodlesGroup.add(noodle);

        this.physics.add.overlap(
          this.panda,
          noodle,
          this.catchNoodle,
          null,
          this
        );
      },
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
        delay: 3000,
        callback: () => {
            if(currentSpeed < maxSpeed) {
                currentSpeed += 100;
            }
        },
        callbackScope: this,
        loop: true,
    });
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.panda.setVelocityX(-200);
    } else if (cursors.right.isDown) {
      this.panda.setVelocityX(200);
    } else {
      this.panda.setVelocityX(0);
    }

    if (!gameOver) {
      this.noodlesGroup.children.iterate((noodle) => {

        if(noodle) {
          noodle.setVelocityY(currentSpeed);
        }

        if (noodle && noodle.y > 800) {
          noodle.destroy();
          lives -= 1;

          this.livesText.setText("Lives: " + lives);

          if (lives <= 0) {
            this.endGame();
          }
        }
      });
    }
  }

  catchNoodle(panda, noodle) {
    noodle.destroy();
    score += 10;
    this.scoreText.setText("Score: " + score);
  }


  endGame() {
    gameOver = true;
  
    this.physics.pause();
    this.noodleTimer.remove(false);
    this.noodlesGroup.clear(true, true);
  
    this.add
      .text(240, 300, "GAME OVER !!!", {
        fontSize: "48px",
        fill: "#ff0000",
        fontFamily: "Arial",
        stroke: "#000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);
  
    const replayBtn = this.add
      .text(240, 420, "REPLAY", {
        fontSize: "28px",
        fill: "#ffffff",
        fontFamily: "Arial",
        backgroundColor: "#00c853",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
  
    replayBtn.on("pointerdown", () => {
      this.scene.restart(); // 🔄 Restart GameScene
    });
  
    const homeBtn = this.add
      .text(240, 500, "HOME", {
        fontSize: "28px",
        fill: "#ffffff",
        fontFamily: "Arial",
        backgroundColor: "#2962ff",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
  
    homeBtn.on("pointerdown", () => {
      this.scene.start("TitleScene"); // Go to title screen
    });
  }
  
//   endGame() {
//     gameOver = true;

//     this.physics.pause();
//     this.noodleTimer.remove(false);
//     this.noodlesGroup.clear(true, true);

//     this.add
//       .text(240, 400, "GAME OVER!!!", {
//         fontSize: "48px",
//         fill: "#ff0000",
//         fontFamily: "Arial",
//         stroke: "#000",
//         strokeThickness: 6,
//       })
//       .setOrigin(0.5);
//   }

}