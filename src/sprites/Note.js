import Healthbar from "../graphics/Healthbar";

export default class Note extends Phaser.GameObjects.Sprite {
    constructor(scene, note) {
        super(scene, 0, 1366 - ((72 + 3) * (note.note + 1)) + 36, 'image-rhythm-note');
        this.note = note;


    }

    update(time, delta) {

    }
}