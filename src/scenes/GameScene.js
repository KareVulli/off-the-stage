import Enemy from "../sprites/Enemy";
import WeaponSlot from "../sprites/WeaponSlot";
import DeathParticles from "../particles/DeathParticles";
import Button from "../sprites/ui/Button";
import beatmapSampleAudio from '../assets/beatmaps/sample/audio.mp3';
import beatmapSample from '../assets/beatmaps/sample/beatmap.json';
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
            beatmap: beatmap2,
            beatmapAudio: beatmap2Audio,
            enemySpeed: 60
        },
        {
            delay: 5000,
            beatmap: beatmap3,
            beatmapAudio: beatmap3Audio,
            enemySpeed: 80
        }/* ,
        {
            delay: 4000,
            beatmap: beatmapSample,
            beatmapAudio: beatmapSampleAudio,
            enemySpeed: 90
        },
        {
            delay: 3000,
            beatmap: beatmapSample,
            beatmapAudio: beatmapSampleAudio,
            enemySpeed: 100
        } */
    ]
    constructor() {
        super({key: 'GameScene'});
    }

    preload() {
        console.log('GameScene preload()');

    }

    createAnimations () {
        this.anims.create({
            key: 'enemy-walk',
            frames: this.anims.generateFrameNumbers('sprite-enemy', { start: 0, end: 1 }),
            frameRate: 3,
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
        console.log('GameScene create()');
        this.reset();
        this.createAnimations();
        this.setupBackground();
        this.money = new Money(this);
        this.backgroundMusic = this.sound.add('audio-background', {
            volume: 0.2
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
        this.updateLivesCounter();

        this.add.existing(new WeaponSlot(this, 750, 320, this.enemies, this.money));
        this.add.existing(new WeaponSlot(this, 700, 500, this.enemies, this.money));
        this.add.existing(new WeaponSlot(this, 500, 420, this.enemies, this.money));
        this.add.existing(new WeaponSlot(this, 400, 300, this.enemies, this.money));
        this.add.existing(new WeaponSlot(this, 250, 310, this.enemies, this.money));
        this.add.existing(new WeaponSlot(this, 250, 480, this.enemies, this.money));

        this.btnStartWave = new Button(this, 1200, 700, 'Start performance');
        this.btnStartWave.on('pointerup', this.onStartWaveClicked, this);
        this.add.existing(this.btnStartWave);

        // weaponSlot.setWeapon();
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

    addEnemy(){
        const enemy = new Enemy(this, this.waveSettings.enemySpeed);
        this.enemies.add(enemy);
        this.add.existing(enemy);
        enemy.followPath(this.path);
        enemy.once('onReachedEnd', this.onEnemyPassed, this);
        enemy.once('onKilled', this.onEnemyKilled, this);
        // console.log(`${this.time.now - this.waveStartTime} > ${this.waveLength} - 10000`)
        if (this.time.now - this.waveStartTime < this.waveLength - 30000) {
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
        if(this.lives <= 0) {
            this.events.emit('onWaveLost');
            this.scene.launch('GameOverScene');
            this.scene.pause();
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
        this.healthText.setText(`Lives: ${this.lives} | Money: ${this.money.getMoney()}`)
    }

    update(time, delta) {
        this.updateLivesCounter();
    }
}