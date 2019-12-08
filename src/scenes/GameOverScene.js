import Text from "../sprites/ui/Text";
import Button from "../sprites/ui/Button";
import GameScene from "./GameScene";

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameOverScene'});
    }

    preload() {
    }

    create()
    {
        this.scene.bringToTop(this);
        const background = this.add.graphics({
            fillStyle: {
                color: 0x000000,
                alpha: 1
            }
        })
        background.fillRect(0, 0, 1366, 768);
        
        this.gameOverText = new Text(this, 1366 / 2, 768 / 2, 'Game over, the fans reached the stage!');
        this.gameOverText.setOrigin(0.5, 0.5);
        this.gameOverText.setFontSize(20);
        this.add.existing(this.gameOverText);

        this.btnRestart = new Button(this, 1366 / 2, 450, 'Restart');
        this.btnRestart.on('pointerup', this.onRestartClicked, this);
        this.add.existing(this.btnRestart);

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
}