import Healthbar from "../../graphics/Healthbar";
import NoteHead from "./NoteHead";

export const NOTE_ADD_COMBO = 3;
export const NOTE_HIT = 2;
export const NOTE_MISSED = 1;
export const NOTE_NORMAL = 0;

export default class Note extends Phaser.GameObjects.Container {
    constructor(scene, note, timeframe, music) {
        super(scene, 1366 - ((72 + 3) * (4 - note.note)) + 18, 0);
        this.noteHead = new NoteHead(scene, 0, 0);
        this.add(this.noteHead);
        console.log('Note created');
        this.note = note;
        this.music = music;
        this.timeframe = timeframe;
        this.endHeight = 768;
        this.heightOffset = 50;
        this.setAlpha(0);
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

    check(songTime, badHitWindow, keyDown) {
        if (songTime - badHitWindow > this.note.time) {
            console.log(`${songTime} - ${this.badHitWindow} > ${this.note.time}`)
            console.log('Miss')
            return NOTE_MISSED;
        } else if (keyDown) {
            if (songTime + badHitWindow > this.note.time) {
                console.log('Hit')
                return NOTE_HIT;
            }
        }
        return NOTE_NORMAL;
    }

    onHit() {
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scale: 1.4,
            duration: 100
        });
    }

    onMiss() {
        this.noteHead.setMissed(true);
    }
}