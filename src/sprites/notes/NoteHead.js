import Healthbar from "../../graphics/Healthbar";

export default class NoteHead extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'image-rhythm-note');
        this.missed = false;
        this.setTint(0x00ff2f);
    }

    setMissed(missed) {
        this.missed = missed;
        if (missed) {
            this.setTint(0xffffff);
        } else {
            this.setTint(0x00ff2f);
        }
    }
}