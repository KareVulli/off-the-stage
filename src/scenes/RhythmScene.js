import Note, { 
    NOTE_MISSED,
    NOTE_HIT,
    NOTE_ADD_COMBO,
    ACCURACY_PERFECT,
    ACCURACY_GOOD,
    ACCURACY_MEH
} from '../sprites/notes/Note';
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
        this.badHitWindow = 130;
        this.goodHitWindow = 70;
        this.perfectHitWindow = 16;
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
        this.musicVolume = localStorage.getItem('music-volume');
        this.SFXVolume = localStorage.getItem('sfx-volume');
        this.hitsoundsVolume = localStorage.getItem('hitsounds-volume');

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

        
        this.title = new Text(this, 1000, 700, `${this.beatmap.artist} - ${this.beatmap.name}`, {fontSize: '24px'})
        this.add.existing(this.title);
        this.title.setOrigin(1, 0);
        this.tweens.add({
            targets: this.title,
            alpha: {from: 0, to: 1},
            x: '-=25',
            duration: 500,
            ease: 'Quad',
            hold: 3000,
            yoyo: true
        });

        this.notesGroup = this.add.group({
            runChildUpdate: true
        });

        this.music = this.sound.add('audio-beatmap', {
            volume: this.musicVolume
        });
        this.music.on('complete', this.onMusicComplete, this);
        for (let i = 0; i < this.beatmap.notes.length; i++) {
            const note = this.beatmap.notes[i];
            let sprite;
            if (note.endTime !== undefined) {
                sprite = new SliderNote(this, note, this.timeframe, this.music, this.hitsoundsVolume);
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

        
        this.comboText = new Text(this, 1197, 250);
        this.comboText.setFontSize('64px');
        this.comboText.setAlign('center');
        this.comboText.setOrigin(0.5, 0.5);
        this.add.existing(this.comboText);

        this.accuracyText = new Text(this, 1197, 500);
        this.accuracyText.setFontSize('32px');
        this.accuracyText.setAlign('center');
        this.accuracyText.setOrigin(0.5, 0.5);
        this.add.existing(this.accuracyText);

        this.powerUpText = new Text(this, 1197, 450);
        this.powerUpText.setFontSize('16px');
        this.powerUpText.setAlign('center');
        this.powerUpText.setColor('#00ff0c');
        this.powerUpText.setOrigin(0.5, 0.5);
        this.powerUpText.setAlpha(0);
        this.add.existing(this.powerUpText);

        this.scene.get('GameScene').events.once('onWaveLost', this.onWaveLost, this);
        this.scene.get('GameScene').events.once('onGameStopped', this.stopAndRecreateScene, this);
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
        sceneManager.get('GameScene').events.off('onGameStopped', this.stopAndRecreateScene, this);
        sceneManager.stop('RhythmScene');
        sceneManager.remove('RhythmScene');
    }

    getSongTime() {
        return this.music.seek * 1000;
    }

    showPowerUpText(message, time) {
        this.powerUpText.setText(message);
        this.powerUpText.setY(450)
        this.tweens.add({
            targets: this.powerUpText,
            alpha: 1,
            duration: 100
        });
        if (this.powerUpTextTween) {
            this.powerUpTextTween.remove()
        }
        this.powerUpTextTween = this.tweens.add({
            targets: this.powerUpText,
            alpha: 0,
            y: '-=30,',
            delay: time,
            duration: 300,
            onComplete: () => {this.powerUpTextTween = null},
            callbackScope: this
        });
    }

    showAccuracy(message, color) {
        this.accuracyText.setText(message)
        this.accuracyText.setColor(color)
        this.accuracyText.setAlpha(1);
        if (this.accuracyTween) {
            this.accuracyTween.remove();
        }
        if (this.accuracyScaleTween) {
            this.accuracyScaleTween.remove();
        }
        this.accuracyScaleTween = this.tweens.add({
            targets: this.accuracyText,
            scale: {from: 1.2, to: 1},
            duration: 100,
            onComplete: () => this.accuracyScaleTween = null,
            onCompleteScope: this
        });
        this.accuracyTween = this.tweens.add({
            targets: this.accuracyText,
            alpha: 0,
            delay: 300,
            duration: 50,
            onComplete: () => this.accuracyTween = null,
            onCompleteScope: this
        });
    }

    onHit(note, state) {
        this.combo += 1;
        note.sprite.onHit();
        this.comboText.setText(this.combo)
        this.comboText.setAlpha(1);
        switch (state[1]) {
            case ACCURACY_PERFECT:
                this.showAccuracy('Perfect', '#d30ffa');
                break;
            case ACCURACY_GOOD:
                this.showAccuracy('Good', '#4abdff');
                break;
            case ACCURACY_MEH:
                this.showAccuracy('Meh', '#cfc400');
                break;
        }
        this.tweens.add({
            targets: this.comboText,
            scale: {from: 1.2, to: 1},
            duration: 100
        });
        this.money.add(Phaser.Math.Clamp(Math.floor(0.05 * this.combo), 1, 5));
        if (this.combo % 50 == 0) {
            this.scene.get('GameScene').events.emit('ExtraHealth');
            this.showPowerUpText('+1 Lives', 3000);
        } else if (this.combo % 15 == 0) {
            this.scene.get('GameScene').events.emit('DoubleFireRate');
            this.showPowerUpText('+ Double Fire Rate', 5000);
        }
        console.log('onHit');
    }

    onMiss(note, state) {
        this.combo = 0;
        this.tweens.add({
            targets: this.comboText,
            alpha: 0,
            duration: 100
        });
        note.sprite.onMiss();
        this.showAccuracy('Miss', '#ff1100');
        console.log('onMiss');
    }

    checkNotesRow(index) {
        this.rowNotes = this.notes[index];
        const keyDown = Phaser.Input.Keyboard.JustDown(this.keys[index]);
        const keyUp = Phaser.Input.Keyboard.JustUp(this.keys[index]);
        
        if (keyDown) {
            this.keySprites[index].show();
            this.sound.play('audio-hitsound3', {
                volume: this.hitsoundsVolume
            });
        } else if (keyUp) {
            this.keySprites[index].hide();
        }
        for (let i = this.nextNotes[index]; i < this.rowNotes.length; i++) {
            const note = this.rowNotes[i];
            const state = note.sprite.check(this.getSongTime(), this.badHitWindow, keyDown, keyUp, this.goodHitWindow, this.perfectHitWindow);
            if (state[0] === NOTE_MISSED) {
                this.onMiss(note, state);
                this.nextNotes[index]++;
                continue;
            } else if (state[0] === NOTE_HIT) {
                this.onHit(note, state);
                this.nextNotes[index]++;
                break;
            } else if (state[0] === NOTE_ADD_COMBO) {
                // Register a hit, but continue to check the same note next update
                this.onHit(note, state);
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