import generateWeaponSlot from "../graphics/WeaponSlot";
import generateLight from "../graphics/Light";
import generateButton from "../graphics/Button";
import Enemy from "../sprites/Enemy";
import WeaponSlot from "../sprites/WeaponSlot";
import enemyImage from "../assets/enemy.png";
import lightImage from "../assets/light.png";
import bloodImage from "../assets/blood-splat.png";
import backgroundImage from "../assets/background.png";
import backgroundLightsImage from "../assets/background-lights.png";
import DeathParticles from "../particles/DeathParticles";
import Button from "../sprites/ui/Button";
import beatmapSampleAudio from '../assets/beatmaps/sample/audio.mp3';
import beatmapSample from '../assets/beatmaps/sample/beatmap.json';

export default class GameScene extends Phaser.Scene {
    static waves = [
        {
            delay: 2000,
            beatmap: beatmapSample,
            beatmapAudio: beatmapSampleAudio
        },
        {
            delay: 5500,
            beatmap: beatmapSample,
            beatmapAudio: beatmapSampleAudio
        },
        {
            delay: 4500,
            beatmap: beatmapSample,
            beatmapAudio: beatmapSampleAudio
        },
        {
            delay: 3000,
            beatmap: beatmapSample,
            beatmapAudio: beatmapSampleAudio
        }
    ]
    constructor() {
        super({key: 'GameScene'});
        this.lives = 3;
        this.wave = 0;
        this.waveActive = false;
        this.waveTimerActive = false;
        this.waveStartTime = 0;
        this.waveLength = 0;
        this.waveSettings = null;
    }

    preload() {
        generateWeaponSlot(this)
        generateLight(this)
        generateButton(this)
        this.load.image('particle-light', lightImage);
        this.load.image('particle-blood', bloodImage);
        this.load.image('image-background', backgroundImage);
        this.load.image('image-background-lights', backgroundLightsImage);
        this.load.spritesheet('sprite-enemy', enemyImage, { frameWidth: 75, frameHeight: 100 });
    }

    createAnimations () {
        this.anims.create({
            key: 'enemy-walk',
            frames: this.anims.generateFrameNumbers('sprite-enemy', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
    }

    create() {
        this.createAnimations();

        this.background = this.add.image(0, 0, 'image-background');
        this.background.setOrigin(0, 0);
        this.backgroundLights = this.add.image(0, 0, 'image-background-lights');
        this.backgroundLights.setOrigin(0, 0);
        this.backgroundLights.setDepth(1);
        this.backgroundLights.setBlendMode('SCREEN');

        var tween = this.tweens.add({
            targets: this.backgroundLights,
            alpha: 0.05,
            duration: 100,
            yoyo: true,
            hold: 300,
            repeat: -1,
            repeatDelay: 1000
        });

        this.deathParticles = new DeathParticles(this);
        this.add.existing(this.deathParticles);

        this.enemies = this.physics.add.group({
            runChildUpdate: true,
            allowGravity: false
        });
        this.physics.world.enable(this.enemies);

        console.log('hello');

        this.path = new Phaser.Curves.Spline([
            -50, 350,
            300, 350, 
            500, 300, 
            800, 400, 
            1100, 350
        ])

        const debugGraphics = this.add.graphics();
        debugGraphics.lineStyle(2, 0x333333, 1);

        this.path.draw(debugGraphics, 64);

        this.healthText = this.add.text(20, 20)
        this.updateLivesCounter()

        this.add.existing(new WeaponSlot(this, 900, 270, this.enemies));
        this.add.existing(new WeaponSlot(this, 500, 430, this.enemies));
        this.add.existing(new WeaponSlot(this, 250, 230, this.enemies));

        const btnStartWave = new Button(this, 1200, 30, 'Start performance');
        btnStartWave.on('pointerup', this.onStartWaveClicked, this);
        this.add.existing(btnStartWave);

        // weaponSlot.setWeapon();
    }

    onStartWaveClicked () {
        if (!this.waveActive) {
            this.waveSettings = GameScene.waves[this.wave++];
            this.waveActive = true;
            this.scene.launch('RhythmScene', this.waveSettings);
            this.scene.get('RhythmScene').events.on('onGameStarted', this.onWaveStarted, this)
            this.scene.get('RhythmScene').events.on('onGameEnded', this.onWaveEnded, this)
        }
    }

    onWaveStarted(length) {
        this.waveStartTime = this.time.now;
        this.waveLength = length;
        this.waveTimerActive = true;
        this.waveTimer = this.time.addEvent({
            delay: this.waveSettings.delay,
            callback: this.addEnemy,
            callbackScope: this
        });
    }

    onWaveEnded(length) {
        this.waveStartTime = this.time.now;
        this.waveLength = length;
        this.waveTimerActive = true;
    }

    addEnemy(){
        const enemy = new Enemy(this);
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
        this.healthText.setText(`Lives: ${this.lives} | Wave: ${this.wave} | Enemies left: ${this.enemiesLeft} | Wave timer active: ${this.waveTimerActive} | Wave active: ${this.waveActive}`)
    }

    update(time, delta) {
        this.updateLivesCounter();
    }
}