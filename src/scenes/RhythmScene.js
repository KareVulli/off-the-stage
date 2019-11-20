import backgroundImage from '../assets/rhythm-background.png';
import noteImage from '../assets/rhythm-note.png';
import beatmapAudio from '../assets/beatmaps/sample/audio.mp3';
import beatmap from '../assets/beatmaps/sample/beatmap.json';
import Note from '../sprites/Note';

export default class RhythmScene extends Phaser.Scene {
    constructor() {
        super({key: 'RhythmScene'});
        this.timeframe = 2000;
        
    }

    preload() {
        this.load.image('image-rhythm-background', backgroundImage);
        this.load.image('image-rhythm-note', noteImage);
        this.load.json('json-beatmap', beatmap);
        this.load.audio('audio-beatmap', beatmapAudio);
    }

    create() {
        this.text = this.add.text(800, 600, 'RhythmScene');
        this.background = this.add.image(1366 - 420, 0, 'image-rhythm-background');
        this.background.setOrigin(0, 0);
        this.beatmap = this.cache.json.get('json-beatmap');
        this.notes = [];

        for (let i = 0; i < this.beatmap.notes.length; i++) {
            const note = this.beatmap.notes[i];
            this.notes.push(new Note(this, note));
        }

        this.music = this.sound.add('audio-beatmap');
    }
}