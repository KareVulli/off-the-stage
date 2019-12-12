import Button from "../sprites/ui/Button";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({key: 'MenuScene'});
    }

    preload() {

    }

    create()
    {
        this.cameras.main.fadeIn(600, 0, 0, 0);
        this.background = this.add.image(0, 0, 'image-menu-background');
        this.background.setOrigin(0, 0)

        this.btnStart = new Button(this, 1366 / 2, 500, 'Start game');
        this.btnStart.on('pointerup', this.onStart, this);
        this.add.existing(this.btnStart);

        /* this.btnHelp = new Button(this, 1366 / 2, 600, 'Guide');
        this.btnHelp.on('pointerup', this.onHelp, this);
        this.add.existing(this.btnHelp); */
    }

    onStart() {
        this.cameras.main.fadeOut(400, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.scene.start('GameScene');
            }
        }, this);
    }

    onHelp() {
        
    }
}