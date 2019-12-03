import Healthbar from "../graphics/Healthbar";

export default class Key extends Phaser.GameObjects.Sprite {
    constructor(scene, noteNumber) {
        super(scene, 1366 - ((72 + 3) * (4 - noteNumber)) + 18, 755, 'image-rhythm-active-note');
        this.setBlendMode('ADD');
        this.setOrigin(0.5, 1);
        this.setAlpha(0);
        this.setTint(0x00ff2f);
        this.tween = null;
    }

    show() {
        if (this.tween) {
            this.tween.remove();
            this.tween = null;
        }
        this.scaleX = 1;
        this.setAlpha(1);
    }

    hide() {
        this.tween = this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scaleX: 0.8,
            duration: 50
        });
    }
}