import Enemy from "../sprites/Enemy";
import WeaponSlot from "../sprites/WeaponSlot";
import DeathParticles from "../particles/DeathParticles";
import Button from "../sprites/ui/Button";/* 
import beatmapSampleAudio from '../assets/beatmaps/sample/audio.mp3';
import beatmapSample from '../assets/beatmaps/sample/beatmap.json'; */
import beatmap1Audio from '../assets/beatmaps/meanwhile-in-rio/audio.mp3';
import beatmap1 from '../assets/beatmaps/meanwhile-in-rio/beatmap.json';
import beatmap2Audio from '../assets/beatmaps/preserved-valkyria/audio.mp3';
import beatmap2 from '../assets/beatmaps/preserved-valkyria/beatmap.json';
import beatmap3Audio from '../assets/beatmaps/resurrection-spell/shortened.mp3';
// import beatmap3Audio from '../assets/sounds/Shoot1.mp3';
import beatmap3 from '../assets/beatmaps/resurrection-spell/beatmap.json';
import Money from "../Money";
import Text from "../sprites/ui/Text";
import RhythmScene from "./RhythmScene";

export default class GameScene extends Phaser.Scene {
    static waves = [
        {
            delay: 5000,
            beatmap: beatmap1,
            beatmapAudio: beatmap1Audio,
            enemySpeed: 60,
            enemyHealth: 80
        },
        {
            delay: 5000,
            enemySpeed: 80,
            beatmap: beatmap3,
            beatmapAudio: beatmap3Audio,
            enemyHealth: 130
        },
        {
            delay: 4000,
            random: 2000, // TODO: 
            beatmap: beatmap2,
            beatmapAudio: beatmap2Audio,
            enemySpeed: 90,
            enemyHealth: 150
        }
        /* {
            delay: 3000,
            beatmap: beatmapSample,
            beatmapAudio: beatmapSampleAudio,
            enemySpeed: 100,
            enemyHealth: 150
        } */
    ]
    constructor() {
        super({key: 'GameScene'});
        console.log('GameScene constructor');
    }

    preload() {
        console.log('GameScene preload()');

    }

    createAnimations () {
        this.anims.create({
            key: 'enemy-walk',
            frames: this.anims.generateFrameNumbers('sprite-enemy', { start: 0, end: 7 }),
            frameRate: 6,
            repeat: -1
        });
    }

    reset() {
        this.lives = 3;
        this.wave = 0;
        this.waveActive = false;
        this.waveTimerActive = false;
        this.waveStartTime = 0;
        this.waveLength = 0;
        this.waveSettings = null;
    }

    create() {
        this.musicVolume = localStorage.getItem('music-volume');
        this.SFXVolume = localStorage.getItem('sfx-volume');

        this.cameras.main.fadeIn(600, 0, 0, 0);
        console.log('GameScene create()');
        this.reset();
        this.createAnimations();
        this.setupBackground();
        this.money = new Money(this);
        this.backgroundMusic = this.sound.add('audio-background', {
            volume: this.musicVolume / 2,
            loop: true
        });
        this.backgroundMusic.play();

        this.deathParticles = new DeathParticles(this);
        this.add.existing(this.deathParticles);

        this.enemies = this.physics.add.group({
            runChildUpdate: true,
            allowGravity: false
        });
        this.physics.world.enable(this.enemies);

        console.log('hello');

        this.path = new Phaser.Curves.Spline([
            -50, 370,
            270, 390, 
            500, 340, 
            800, 430, 
            1000, 370
        ])

        /* const debugGraphics = this.add.graphics();
        debugGraphics.lineStyle(2, 0x333333, 1);
        this.path.draw(debugGraphics, 64); */

        this.healthText = this.add.existing(new Text(this, 40, 20, '', {fontSize: '24px'}));
        this.waveText = this.add.existing(new Text(this, 40, 700, 'Wave: 0', {fontSize: '24px'}));
        this.helpText = this.add.existing(new Text(this, 40, 630, 'Start by placing down some tools to keep crazy fans from running to the stage.\nWhen you think you\'re ready, you can start performing.', {fontSize: '16px'}));
        
        this.updateLivesCounter();

        this.add.existing(new WeaponSlot(this, 750, 320, this.enemies, this.money, 90));
        this.add.existing(new WeaponSlot(this, 700, 500, this.enemies, this.money, -90));
        this.add.existing(new WeaponSlot(this, 500, 420, this.enemies, this.money, -90));
        this.add.existing(new WeaponSlot(this, 250, 310, this.enemies, this.money, 90));
        this.add.existing(new WeaponSlot(this, 250, 480, this.enemies, this.money, -90));

        this.btnStartWave = new Button(this, 1200, 700, 'Start performance');
        this.btnStartWave.on('pointerup', this.onStartWaveClicked, this);
        this.btnStartWave.setDepth(1);
        this.add.existing(this.btnStartWave);

        this.events.on('ExtraHealth', this.addLife, this);

        // weaponSlot.setWeapon();
        this.input.keyboard.on('keydown_ESC', (event) => {
            this.events.emit('onGameStopped');
            this.backgroundMusic.stop();
            this.scene.start('MenuScene');
        }, this)
    }

    
    setupBackground() {
        this.background = this.add.image(0, 0, 'image-background');
        this.background.setOrigin(0, 0);
        this.bgRed = this.add.image(950, 410, 'image-background-lights-red');
        this.bgRed.setDepth(1);
        this.bgRed.setBlendMode('SCREEN');
        this.bgGreen = this.add.image(890, 370, 'image-background-lights-green');
        this.bgGreen.setDepth(1);
        this.bgGreen.setBlendMode('SCREEN');
        this.bgBlue = this.add.image(1190, 270, 'image-background-lights-blue');
        this.bgBlue.setDepth(1);
        this.bgBlue.setBlendMode('SCREEN');

        this.tweens.add({
            targets: this.bgRed,
            alpha: 0.05,
            duration: 100,
            yoyo: true,
            hold: 300,
            repeat: -1,
            repeatDelay: 1000
        });

        this.tweens.add({
            targets: this.bgGreen,
            delay: 500,
            alpha: 0.05,
            duration: 300,
            yoyo: true,
            hold: 300,
            repeat: -1,
            repeatDelay: 500
        });

        this.tweens.add({
            targets: this.bgBlue,
            delay: 400,
            alpha: 0.05,
            duration: 100,
            yoyo: true,
            hold: 300,
            repeat: -1,
            repeatDelay: 500
        });
    }

    onStartWaveClicked () {
        if (!this.waveActive) {
            this.helpText.setText('Remember that you can upgrade or buy new weapons also during the performace.')
            this.tweens.add({
                targets: this.helpText,
                alpha: 0,
                delay: 7000
            });
            this.waveSettings = GameScene.waves[this.wave++];
            console.log(this.waveSettings)
            this.waveActive = true;
            this.scene.add('RhythmScene', RhythmScene, false);
            this.scene.launch('RhythmScene', {
                waveSettings: this.waveSettings,
                money: this.money
            });
            this.scene.get('RhythmScene').events.once('onGameStarted', this.onWaveStarted, this)
            this.scene.get('RhythmScene').events.once('onGameEnded', this.onWaveEnded, this)
            this.tweens.add({
                targets: [this.btnStartWave, this.btnStartWave.text],
                alpha: 0,
                duration: 100
            })
            // Close any open dropdowns
            //this.events.emit('closeLists');
        }
    }

    onWaveStarted(length) {
        this.backgroundMusic.stop();
        this.waveStartTime = this.time.now;
        this.waveLength = length;
        this.waveTimerActive = true;
        this.waveTimer = this.time.addEvent({
            delay: this.waveSettings.delay,
            callback: this.addEnemy,
            callbackScope: this
        });
    }

    onWaveEnded() {
        if (this.wave == GameScene.waves.length) {
            this.scene.launch('GameOverScene', {won: true});
            this.scene.pause();
        } else {
            this.tweens.add({
                targets: [this.btnStartWave, this.btnStartWave.text],
                alpha: 1,
                duration: 500
            })
            this.backgroundMusic.play();
        }
    }

    addLife() {
        this.lives += 1;
    }

    addEnemy(){
        const enemy = new Enemy(this, this.waveSettings.enemySpeed, this.waveSettings.enemyHealth);
        this.enemies.add(enemy);
        this.add.existing(enemy);
        enemy.followPath(this.path);
        enemy.once('onReachedEnd', this.onEnemyPassed, this);
        enemy.once('onKilled', this.onEnemyKilled, this);
        // console.log(`${this.time.now - this.waveStartTime} > ${this.waveLength} - 10000`)
        if (this.time.now - this.waveStartTime < this.waveLength - 10000) {
            // console.log('timed event created');
            this.waveTimer = this.time.addEvent({
                delay: this.waveSettings.delay,
                callback: this.addEnemy,
                callbackScope: this
            });
        } else {
            this.waveTimerActive = false;
        }
    }

    onEnemyPassed(enemy) {
        this.lives--;
        this.updateLivesCounter();
        this.updateWaveStatus();
        this.enemies.remove(enemy, true, true);
        if (this.lives <= 0) {
            this.events.emit('onWaveLost');
            this.scene.launch('GameOverScene');
            this.scene.pause();
        } else {
            this.cameras.main.fadeEffect.alpha = 0.5;
            this.cameras.main.fadeIn(1000, 255, 100, 100);
        }
    }

    onEnemyKilled(enemy) {
        console.log('onEnemyKilled');
        this.updateWaveStatus();
    }

    updateWaveStatus() {
        if (!this.waveTimerActive && this.enemies.getLength() === 1) {
            this.waveActive = false;
        }
    }

    updateLivesCounter () {
        this.waveText.setText(`Wave ${this.wave} / ${GameScene.waves.length}`);
        this.healthText.setText(`Lives: ${this.lives} | Money: ${this.money.getMoney()} | FPS: ${Math.round(1000/this.game.loop.delta)}`);
    }

    update(time, delta) {
        this.updateLivesCounter();
    }
}