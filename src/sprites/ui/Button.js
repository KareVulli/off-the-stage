export default class Button extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, text = '') {
        super(scene, x, y, 'sprite-button-out');
        this.setInteractive({
            useHandCursor: true
        });

        this.on('pointerdown', this.onMouseDown, this);
        this.on('pointerup', this.onMouseUp, this);
        this.on('pointerover', this.onOver, this)
        this.on('pointerout', this.onOut, this);

        this.text = scene.add.text(x, y, text);
        this.text.setDepth(1);
        this.text.setOrigin(0.5, 0.5);
        
    }

    onMouseUp () {
        this.onOver();
    }

    onMouseDown() {
        this.setTexture('sprite-button-pressed');
    }

    onOver() {
        this.setTexture('sprite-button-over');
    }

    onOut() {  
        this.setTexture('sprite-button-out');
    }

    update(time, delta) {

    }
}