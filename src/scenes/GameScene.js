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

    this.ingredientSequence = [
      "cooking-oil", "ginger", "mushrooms", "baby-corn", "carrot", "cabbage",
      "capsicum", "beansprouts", "soy-sauce", "tomato-ketchup", "chilli-sauce",
      "black-pepper", "salt", "noodle", "noodle", "noodle"
    ];

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

    this.itemsGroup = this.physics.add.group();

    this.spawnNextItem(); // Start first drop
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
  }

  handleMiss(item) {
    const type = item.getData("type");
    item.destroy();
  
    if (type === "noodle") {

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
}
