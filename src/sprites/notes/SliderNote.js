import NoteSlider from "./NoteSlider";
import Note, { 
    NOTE_NORMAL,
    NOTE_MISSED,
    NOTE_ADD_COMBO,
    NOTE_HIT,
    ACCURACY_PERFECT,
    ACCURACY_GOOD,
    ACCURACY_MEH
} from "./Note";
import NoteHead from "./NoteHead";

const STATE_NORMAL = 0;
const STATE_SLIDING = 1;
const STATE_RELEASED = 2;

export default class SliderNote extends Note {
    constructor(scene, note, timeframe, music, hitsoundVolume) {
        super(scene, note, timeframe, music);
        this.hitsoundVolume = hitsoundVolume;
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

    check(songTime, badHitWindow, keyDown, keyUp, goodHitWindow, perfectHitWindow) {
        if (this.state === STATE_NORMAL && songTime - badHitWindow > this.note.time) {
            console.log('Too late');
            return [NOTE_MISSED];
        } else if (this.state === STATE_NORMAL && keyDown && songTime + badHitWindow > this.note.time) {
            console.log('Hit. delta from perfect: ', this.note.time - songTime);
            this.state = STATE_SLIDING;
            const delta = Math.abs(this.note.time - songTime);
            let acc;
            if (delta <= perfectHitWindow) {
                acc = ACCURACY_PERFECT
            } else if (delta <= goodHitWindow) {
                acc = ACCURACY_GOOD
            } else {
                acc = ACCURACY_MEH
            }
            return [NOTE_ADD_COMBO, acc];
        } else if (this.state === STATE_SLIDING && keyUp) {
            this.state = STATE_RELEASED;
            if (songTime + badHitWindow > this.note.endTime) {
                this.scene.sound.play('audio-hitsound2', {
                    volume: this.hitsoundVolume
                });
                const delta = Math.abs(this.note.endTime - songTime);
                console.log('Release Hit. delta from perfect: ', delta);
                let acc;
                if (delta <= perfectHitWindow) {
                    acc = ACCURACY_PERFECT
                } else if (delta <= goodHitWindow) {
                    acc = ACCURACY_GOOD
                } else {
                    acc = ACCURACY_MEH
                }
                return [NOTE_HIT, acc];
            }
            console.log('Released too early');
            return [NOTE_MISSED];
        } else if (this.state === STATE_SLIDING && songTime - badHitWindow > this.note.endTime) {
            console.log('Released too late');
            this.state = STATE_RELEASED;
            return [NOTE_MISSED];
        }
        return [NOTE_NORMAL];
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