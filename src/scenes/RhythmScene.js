import Note, { NOTE_MISSED, NOTE_HIT, NOTE_ADD_COMBO } from '../sprites/notes/Note';
import Key from '../sprites/Key';
import Text from '../sprites/ui/Text';
import SliderNote from '../sprites/notes/SliderNote';

export default class RhythmScene extends Phaser.Scene {
    static keyBinds = [
        {
            name: 'D',
            code: Phaser.Input.Keyboard.KeyCodes.D
        },
        {
            name: 'F',
            code: Phaser.Input.Keyboard.KeyCodes.F
        },
        {
            name: 'J',
            code: Phaser.Input.Keyboard.KeyCodes.J
        },
        {
            name: 'K',
            code: Phaser.Input.Keyboard.KeyCodes.K
        }
    ];

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
        console.log(this.waveSettings)
    }

    preload() {
        console.log('RhythmScene preload()');
        console.log(this.waveSettings);
        this.load.json('json-beatmap', this.waveSettings.beatmap);
        this.load.audio('audio-beatmap', this.waveSettings.beatmapAudio);
    }

    create() {
        console.log('RhythmScene create()')
        
        // this.debugText = new Text(this, 20, 40);
        // this.add.existing(this.debugText);

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
            let sprite;
            if (note.endTime !== undefined) {
                sprite = new SliderNote(this, note, this.timeframe, this.music);
            } else {
                sprite = new Note(this, note, this.timeframe, this.music);
            }
            note.sprite = sprite;
            this.notes[note.note].push(note);
            this.notesGroup.add(sprite, true);
        }

        this.keys = [];
        this.keySprites = [];
        
        for (let i = 0; i < 4; i++) {
            const bind = RhythmScene.keyBinds[i];
            this.keys.push(this.input.keyboard.addKey(bind.code));
            const key = new Key(this, i, bind.name);
            this.keySprites.push(key);
            this.add.existing(key);
        }

        
        this.comboText = new Text(this, 1197, 500);
        this.comboText.setFontSize('64px');
        this.comboText.setAlign('center');
        this.comboText.setOrigin(0.5, 0.5);
        this.add.existing(this.comboText);

        this.scene.get('GameScene').events.once('onWaveLost', this.onWaveLost, this);
    }

    onWaveLost() {
        this.add.tween({
            targets: this.music,
            rate: 0,
            duration: 2000,
            onComplete: () => {
                console.log('onWaveLost onComplete()');
                this.stopAndRecreateScene();
            },
            onCompleteScope: this
        })
        
    }

    onFadedIn() {
        console.log('onFadedIn');
        this.music.play();
        this.events.emit('onGameStarted', this.music.duration * 1000);

    }

    onMusicComplete() {
        console.log('onMusicComplete()');
        this.events.emit('onGameEnded');
        this.stopAndRecreateScene();
    }

    stopAndRecreateScene() {
        this.music.destroy();
        this.cache.audio.remove('audio-beatmap');
        this.cache.json.remove('json-beatmap');
        const sceneManager = this.scene;
        sceneManager.get('GameScene').events.off('onWaveLost', this.onWaveLost, this);
        sceneManager.stop('RhythmScene');
        sceneManager.remove('RhythmScene');
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
        this.money.add(Math.floor(0.05 * this.combo));
        console.log('onHit');
    }

    onMiss(note) {
        this.combo = 0;
        this.tweens.add({
            targets: this.comboText,
            alpha: 0,
            duration: 100
        });
        note.sprite.onMiss();
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
            const state = note.sprite.check(this.getSongTime(), this.badHitWindow, keyDown, keyUp);
            if (state === NOTE_MISSED) {
                this.onMiss(note);
                this.nextNotes[index]++;
                continue;
            } else if (state === NOTE_HIT) {
                this.onHit(note);
                this.nextNotes[index]++;
                break;
            } else if (state === NOTE_ADD_COMBO) {
                // Register a hit, but continue to check the same note next update
                this.onHit(note);
                break;
            } else {
                break;
            }
        }
    }

    update(time, delta) {
        // this.debugText.setText(`combo: ${this.combo} time: ${Math.round(this.music.seek * 1000)}`);
        for (let i = 0; i < 4; i++) {
            this.checkNotesRow(i);
        }
    }
}