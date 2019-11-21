import backgroundImage from '../assets/rhythm-background.png';
import noteImage from '../assets/rhythm-note.png';
import generateHitLine from "../graphics/HitLine";
import Note from '../sprites/Note';
import Key from '../sprites/Key';

export default class RhythmScene extends Phaser.Scene {
    constructor() {
        super({key: 'RhythmScene'});
        this.timeframe = 1000;
    }

    init(data) {
        console.log('RhythmScene init()');
        this.waveSettings = data;
        this.combo = 0;
        this.nextNotes = [0, 0, 0, 0];
    }

    preload() {
        console.log('RhythmScene preload()');
        generateHitLine(this);
        this.load.image('image-rhythm-background', backgroundImage);
        this.load.image('image-rhythm-background', backgroundImage);
        this.load.image('image-rhythm-note', noteImage);
        this.load.json('json-beatmap', this.waveSettings.beatmap);
        this.load.audio('audio-beatmap', this.waveSettings.beatmapAudio);
    }

    create() {
        console.log('RhythmScene create()')
        
        this.debugText = this.add.text(20, 40)

        this.background = this.add.image(1366 - 420, 0, 'image-rhythm-background');
        this.background.setOrigin(0, 0);
        this.background.setAlpha(0);
        this.tweens.add({
            targets: this.background,
            alpha: 1,
            duration: 500,
            onComplete: this.onFadedIn,
            onCompleteScope: this
        });
        this.hitLine = this.add.image(1048, 718, 'sprite-hit-line');
        this.hitLine.setOrigin(0, 0.5);
        this.hitLine.setDepth(1);
        this.beatmap = this.cache.json.get('json-beatmap');
        this.notes = [[],[],[],[]];

        this.notesGroup = this.add.group({
            runChildUpdate: true
        });

        this.music = this.sound.add('audio-beatmap');
        for (let i = 0; i < this.beatmap.notes.length; i++) {
            const note = this.beatmap.notes[i];
            const sprite = new Note(this, note, this.timeframe, this.music);
            this.notes[note.note].push(note);
            this.notesGroup.add(sprite, true);
        }

        this.keys = [];
        this.keySprites = [];
        this.keys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D));
        this.keys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F));
        this.keys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J));
        this.keys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K));

        for (let i = 0; i < 4; i++) {
            const key = new Key(this, i);
            this.keySprites.push(key);
            this.add.existing(key);
        }
    }

    onFadedIn() {
        console.log('onFadedIn');
        this.music.play();
        this.events.emit('onGameStarted', this.music.duration * 1000);

    }

    checkNotesRow(index) {
        this.rowNotes = this.notes[index];
        for (let i = this.nextNotes[index]; i < this.rowNotes.length; i++) {
            const note = this.rowNotes[i];
            
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys[index])) {
            console.log('key ', index,' down');
            this.keySprites[index].setAlpha(1);
        } else if (Phaser.Input.Keyboard.JustUp(this.keys[index])) {
            console.log('key ', index,' up');
            this.keySprites[index].setAlpha(0);
        }
    }

    update(time, delta) {
        this.debugText.setText(`combo: ${this.combo} time: ${Math.round(this.music.seek * 1000)}`);
        for (let i = 0; i < 4; i++) {
            this.checkNotesRow(i);
        }
    }
}