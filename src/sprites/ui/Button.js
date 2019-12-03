import Text from "./Text";

export default class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text = '') {
        super(scene, x, y);


        // scene.add.text(x, y, text);
        this.background = this.createBackground();
        this.add(this.background);

        this.text = scene.add.existing(new Text(this.scene, 0, 0, text));
        this.text.setDepth(1);
        this.text.setOrigin(0.5, 0.5);
        this.add(this.text);

        
        this.setSize(this.background.width, this.background.height);
        this.setInteractive({
            useHandCursor: true
        });
        this.on('pointerdown', this.onMouseDown, this);
        this.on('pointerup', this.onMouseUp, this);
        this.on('pointerover', this.onOver, this)
        this.on('pointerout', this.onOut, this);

        
    }

    createBackground() {
        return this.scene.add.image(0, 0, 'sprite-button-out');
    }

    onMouseUp () {
        this.onOver();
    }

    onMouseDown() {
        this.background.setTexture('sprite-button-pressed');
    }

    onOver() {
        this.background.setTexture('sprite-button-over');
    }

    onOut() {  
        this.background.setTexture('sprite-button-out');
    }
}