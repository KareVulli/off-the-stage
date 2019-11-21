import Healthbar from "../graphics/Healthbar";

export default class Note extends Phaser.GameObjects.Sprite {
    constructor(scene, note, timeframe, music) {
        super(scene, 1366 - ((72 + 3) * (4 - note.note)) + 18, 0, 'image-rhythm-note');
        console.log('Note created');
        this.note = note;
        this.music = music;
        this.timeframe = timeframe;
        this.endHeight = 768;
        this.heightOffset = 50;
        this.setAlpha(0);
        this.setTint(0x00ff2f);
    }

    update(time, delta) {
        if (this.music.seek * 1000 > this.note.time - this.timeframe) {
            this.setAlpha(1);
            const newY = this.endHeight * (this.timeframe - (this.note.time - this.music.seek * 1000)) / this.timeframe - this.heightOffset;
            if (this.y > this.endHeight + this.heightOffset) {
                this.setAlpha(0);
            } else {
                this.setY(newY)
            }
        }
    }

    onHit() {
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scale: 1.4,
            duration: 100
        });
    }
}