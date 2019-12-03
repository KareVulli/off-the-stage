import backgroundImage from '../assets/rhythm-background.png';
import noteImage from '../assets/rhythm-note.png';
import activeNoteImage from '../assets/rhythm-note-active.png';
import hitSound from '../assets/sounds/HitSound.mp3';
import hitSound2 from '../assets/sounds/HitSound2.mp3';
import generateHitLine from "../graphics/HitLine";
import Note from '../sprites/Note';
import Key from '../sprites/Key';

export default class RhythmScene extends Phaser.Scene {
    constructor() {
        super({key: 'RhythmScene'});
        this.timeframe = 1000;
        this.badHitWindow = 100;
        this.goodHitWindow = 55;
        this.perfectHitWindow = 20;
    }

    init(data) {
        console.log('RhythmScene init()');
        this.money = data.money
        this.waveSettings = data.waveSettings;
        this.combo = 0;
        this.nextNotes = [0, 0, 0, 0];
    }

    preload() {
        console.log('RhythmScene preload()');
        generateHitLine(this);
        this.load.image('image-rhythm-background', backgroundImage);
        this.load.image('image-rhythm-note', noteImage);
        this.load.image('image-rhythm-active-note', activeNoteImage);
        this.load.json('json-beatmap', this.waveSettings.beatmap);
        this.load.audio('audio-beatmap', this.waveSettings.beatmapAudio);
        this.load.audio('audio-hitsound', hitSound);
        this.load.audio('audio-hitsound2', hitSound2);
    }

    create() {
        console.log('RhythmScene create()')
        
        this.debugText = this.add.text(20, 40)

        this.background = this.add.image(1366 - 420, 0, 'image-rhythm-background');
        this.background.setOrigin(0, 0);
        this.background.setAlpha(0);
        this.tweens.add({
            targets: this.background,
            alpha: 0.8,
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
        this.music.on('complete', this.onMusicComplete, this);
        for (let i = 0; i < this.beatmap.notes.length; i++) {
            const note = this.beatmap.notes[i];
            const sprite = new Note(this, note, this.timeframe, this.music);
            note.sprite = sprite;
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

        
        this.comboText = this.make.text({
            x: 1197,
            y: 500,
            text: '',
            font: 'Palanquin Dark',
            style: {
                fontSize: '64px',
                color: '#ffffff',
                align: 'center'
            },
            add: true
        })
        this.comboText.setOrigin(0.5, 0.5);
    }

    onFadedIn() {
        console.log('onFadedIn');
        this.music.play();
        this.events.emit('onGameStarted', this.music.duration * 1000);

    }

    onMusicComplete() {
        this.events.emit('onGameEnded');
    }

    getSongTime() {
        return this.music.seek * 1000;
    }

    onHit(note) {
        this.combo += 1;
        note.sprite.onHit();
        this.comboText.setText(this.combo)
        this.comboText.setAlpha(1);
        this.tweens.add({
            targets: this.comboText,
            scale: {from: 1.2, to: 1},
            duration: 100
        });
        this.money.add(Math.floor(0.1 * this.combo));
        console.log('onHit');
    }

    onMiss(note) {
        this.combo = 0;
        this.tweens.add({
            targets: this.comboText,
            alpha: 0,
            duration: 100
        });
        console.log('onMiss');
    }

    checkNotesRow(index) {
        this.rowNotes = this.notes[index];
        const keyDown = Phaser.Input.Keyboard.JustDown(this.keys[index]);
        const keyUp = Phaser.Input.Keyboard.JustUp(this.keys[index]);
        
        if (keyDown) {
            this.keySprites[index].show();
            if (index > 0 && index < 3) {
                this.sound.play('audio-hitsound2');
            } else {
                this.sound.play('audio-hitsound');
            }
            console.log('key ', index,' down');
        } else if (keyUp) {
            this.keySprites[index].hide();
        }
        for (let i = this.nextNotes[index]; i < this.rowNotes.length; i++) {
            const note = this.rowNotes[i];
            if (this.getSongTime() - this.badHitWindow > note.time) {
                console.log(`${this.getSongTime()} - ${this.badHitWindow} > ${note.time}`)
                console.log('Miss')
                this.onMiss(note);
                this.nextNotes[index]++;
                continue;
            } else if (keyDown) {
                if (this.getSongTime() + this.badHitWindow > note.time) {
                    console.log('Hit')
                    this.onHit(note);
                    this.nextNotes[index]++;
                    break;
                }
            } else {
                break;
            }
        }
    }

    update(time, delta) {
        this.debugText.setText(`combo: ${this.combo} time: ${Math.round(this.music.seek * 1000)}`);
        for (let i = 0; i < 4; i++) {
            this.checkNotesRow(i);
        }
    }
}