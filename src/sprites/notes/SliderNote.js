import NoteSlider from "./NoteSlider";
import Note, { NOTE_NORMAL, NOTE_MISSED, NOTE_ADD_COMBO, NOTE_HIT } from "./Note";
import NoteHead from "./NoteHead";

const STATE_NORMAL = 0;
const STATE_SLIDING = 1;
const STATE_RELEASED = 2;

export default class SliderNote extends Note {
    constructor(scene, note, timeframe, music) {
        super(scene, note, timeframe, music);
        const length = note.endTime - note.time;
        this.noteHeight = this.endHeight * (length / timeframe);
        this.slider = new NoteSlider(scene, 60, this.noteHeight);
        this.endHead = new NoteHead(scene, 0, -this.noteHeight);
        this.addAt(this.slider);
        this.add(this.endHead);
        this.state = STATE_NORMAL;
    }

    update(time, delta) {
        if (this.music.seek * 1000 > this.note.time - this.timeframe) {
            this.setAlpha(1);
            const newY = this.endHeight * (this.timeframe - (this.note.time - this.music.seek * 1000)) / this.timeframe - this.heightOffset;
            if (this.y > this.endHeight + this.heightOffset + this.noteHeight) {
                this.setAlpha(0);
            } else {
                this.setY(newY)
            }
        }
    }

    check(songTime, badHitWindow, keyDown, keyUp) {
        if (this.state === STATE_NORMAL && songTime - badHitWindow > this.note.time) {
            console.log('Too late');
            return NOTE_MISSED;
        } else if (this.state === STATE_NORMAL && keyDown && songTime + badHitWindow > this.note.time) {
            console.log('Hit');
            this.state = STATE_SLIDING;
            return NOTE_ADD_COMBO;
        } else if (this.state === STATE_SLIDING && keyUp) {
            this.state = STATE_RELEASED;
            if (songTime + badHitWindow > this.note.endTime) {
                console.log('Release Hit');
                this.scene.sound.play('audio-hitsound');
                return NOTE_HIT;
            }
            console.log('Released too early');
            return NOTE_MISSED;
        } else if (this.state === STATE_SLIDING && songTime - badHitWindow > this.note.endTime) {
            console.log('Released too late');
            this.state = STATE_RELEASED;
            return NOTE_MISSED;
        }
        return NOTE_NORMAL;
    }

    onHit() {
        this.slider.setHit(true);
    }

    onMiss() {
        this.slider.setMissed(true);
        this.noteHead.setMissed(true);
        this.endHead.setMissed(true);
    }
}