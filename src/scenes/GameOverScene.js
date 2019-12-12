import Text from "../sprites/ui/Text";
import Button from "../sprites/ui/Button";
import GameScene from "./GameScene";

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameOverScene'});
    }

    init(data) {
        console.log('GameOverScene init()');
        this.win = data.won ? true : false
    }

    preload() {
    }

    create()
    {
        this.scene.bringToTop(this);
        let background;

        if (this.win) {
            background = this.add.graphics({
                fillStyle: {
                    color: 0x00cc03,
                    alpha: 0.9
                }
            })
            this.gameOverText = new Text(this, 1366 / 2, 768 / 2, 'You managed to defeat all the crazy fans. Good job!');
        } else {
            background = this.add.graphics({
                fillStyle: {
                    color: 0x000000,
                    alpha: 1
                }
            })
            this.gameOverText = new Text(this, 1366 / 2, 768 / 2, 'Game over, the fans reached the stage!');
        }
        
        background.fillRect(0, 0, 1366, 768);
        
        this.gameOverText.setOrigin(0.5, 0.5);
        this.gameOverText.setFontSize(20);
        this.add.existing(this.gameOverText);

        this.btnRestart = new Button(this, 1366 / 2, 450, 'Restart');
        this.btnRestart.on('pointerup', this.onRestartClicked, this);
        this.add.existing(this.btnRestart);

        this.btnMenu = new Button(this, 1366 / 2, 550, 'Back to menu');
        this.btnMenu.on('pointerup', this.onMenuClicked, this);
        this.add.existing(this.btnMenu);

        this.add.tween({
            targets: [background, this.gameOverText, this.btnRestart],
            alpha: {from: 0, to: 1},
            duration: 1000
        })
    }

    onRestartClicked () {
        this.scene.remove('GameScene');
        this.scene.add('GameScene', GameScene, false);
        this.scene.start('GameScene');
    }

    onMenuClicked () {
        this.scene.remove('GameScene');
        this.scene.add('GameScene', GameScene, false);
        this.scene.start('MenuScene');
    }
}