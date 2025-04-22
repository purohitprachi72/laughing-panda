import Phaser from "phaser";

let gameOver = false;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("background", "/background1.png");
    this.load.image("panda", "/panda.png");
    this.load.image("panda-smile", "/panda-smile1.png");
    this.load.image("panda-sad", "/panda-sad.png");
    this.load.image("soup-icon", "/soup-icon.png");
    this.load.image("noodle-icon", "/noodle.png");

    this.ingredientSequence = [
      "cooking-oil", "ginger", "mushrooms", "baby-corn", "carrot", "cabbage",
      "capsicum", "beansprouts", "soy-sauce", "tomato-ketchup", "chilli-sauce",
      "black-pepper", "salt", "noodle", "noodle", "noodle"
    ];

    Phaser.Utils.Array.Shuffle(this.ingredientSequence);

    this.ingredientSequence.forEach((item) => {
      this.load.image(item, `/${item}.png`);
    });
  }

  create() {
    gameOver = false;
    this.currentItemIndex = 0;
    this.totalIngredientsCaught = 0;
    this.noodlesCaught = 0;

    this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
    this.background.setDisplaySize(this.scale.width, this.scale.height);

    this.panda = this.physics.add.sprite(240, 700, "panda").setScale(0.25);
    this.panda.setCollideWorldBounds(true);
    this.panda.setGravityY(0);
    this.panda.setImmovable(true);

    this.panda.body.setSize(
      this.panda.width * 0.6,
      this.panda.height * 0.8,
      true
    );

    this.add.image(180, 80, "soup-icon").setScale(0.08).setScrollFactor(0);
    this.add.image(180, 140, "noodle-icon").setScale(0.06).setScrollFactor(0);

    this.soupBar = this.add.graphics();
    this.noodleBar = this.add.graphics();

    this.updateProgressBars();

    this.itemsGroup = this.physics.add.group(); 

    // this.spawnNextItem(); // Start first drop
    this.startCountdownBeforeGame();
  }

  startCountdownBeforeGame() {
    this.countdownText = this.add.text(240, 400, "3", {
      fontSize: "64px",
      fill: "#fff",
      fontFamily: "Arial",
      stroke: "#000",
      strokeThickness: 6
    }).setOrigin(0.5);
  
    let countdown = 3;
  
    this.countdownTimer = this.time.addEvent({
      delay: 1000,
      repeat: 2, // total 3 times
      callback: () => {
        countdown--;
        if (countdown > 0) {
          this.countdownText.setText(countdown.toString());
        } else {
          this.countdownText.destroy();
          this.spawnNextItem();
        }
      }
    });
  }
  
  updateProgressBars() {
    const maxSoup = 6;
    const maxNoodle = 3;

    const soupRatio = Math.min(this.totalIngredientsCaught / maxSoup, 1);
    const noodleRatio = Math.min(this.noodlesCaught / maxNoodle, 1);

    this.soupBar.clear();
    this.soupBar.fillStyle(0x00ff00, 1);
    this.soupBar.fillRect(220, 78, 100 * soupRatio, 10);

    this.noodleBar.clear();
    this.noodleBar.fillStyle(0x00ff00, 1);
    this.noodleBar.fillRect(220, 138, 100 * noodleRatio, 10);

    if (soupRatio === 1 && !this.soupGlow) {
      this.soupGlow = this.addGlowBar(220, 78, 100, 10);
    }
    
    if (noodleRatio === 1 && !this.noodleGlow) {
      this.noodleGlow = this.addGlowBar(220, 138, 100, 10);
    }    
  }

  spawnNextItem() {
    if (this.currentItemIndex >= this.ingredientSequence.length) {
      this.endGameCheck();
      return;
    }

    const key = this.ingredientSequence[this.currentItemIndex];

    this.lastDroppedType = key; // Store the last dropped type

    const x = Phaser.Math.Between(50, 430);
    const item = this.physics.add.sprite(x, 100, key).setScale(0.1);
    item.body.setSize(item.width * 0.6, item.height * 0.6, true);

    item.setData("type", key); // Store type for tracking
    item.setVelocityY(200);

    this.itemsGroup.add(item);

    this.physics.add.overlap(this.panda, item, this.catchItem, null, this);

    this.currentItemIndex++;

    this.time.delayedCall(2000, this.spawnNextItem, [], this);
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.panda.setVelocityX(-300);
    } else if (cursors.right.isDown) {
      this.panda.setVelocityX(300);
    } else {
      this.panda.setVelocityX(0);
    }

    if (!gameOver) {
      this.itemsGroup.children.iterate((item) => {
        if (item && item.active) {
          // item.setVelocityY(200);
          const speed = Phaser.Math.Between(200, 600);
          item.setVelocityY(speed);

          if (item.y > 800) {
            this.handleMiss(item);
          }
        }
      });
    }
  }

  catchItem(panda, item) {
    const type = item.getData("type");
    if (type === "noodle") {
      this.noodlesCaught++;
    } else {
      this.totalIngredientsCaught++;
    }

    item.destroy();

    this.panda.setTexture("panda-smile");
    this.panda.setScale(0.25);

    this.panda.body.setSize(
      this.panda.width * 0.6,
      this.panda.height * 0.8,
      true
    );

    this.tweens.add({
      targets: this.panda,
      scale: { from: 0.25, to: 0.28 },
      duration: 200,
      yoyo: true,
      ease: "Sine.easeInOut"
    });    

    this.time.delayedCall(500, () => {
      this.panda.setTexture("panda");
    });

    this.updateProgressBars();
  }

  handleMiss(item) {
    const type = item.getData("type");
    item.destroy();

    this.panda.setTexture("panda-sad");
    this.panda.setScale(0.25);

    this.panda.body.setSize(
      this.panda.width * 0.6,
      this.panda.height * 0.8,
      true
    );
  
    this.time.delayedCall(500, () => {
    this.panda.setTexture("panda");
    });
  }  

  endGameCheck() {
    gameOver = true;

    const isHappyEnding =
      this.noodlesCaught === 3 && this.totalIngredientsCaught >= 6;

    this.scene.start("EndScene", {
      isHappy: isHappyEnding,
      noodlesCaught: this.noodlesCaught,
      ingredientsCaught: this.totalIngredientsCaught,
    });
  }

  addGlowBar(x, y, width, height) {
    const glow = this.add.graphics();
    glow.lineStyle(5, 0xffffff, 0.7);
    glow.strokeRect(x, y, width, height);
  
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.7, to: 0.1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  
    return glow;
  }  
}
