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

export default class GameScene extends Phaser.Scene {
    static waves = [
        {
            enemies: 4,
            delay: 2000
        },
        {
            enemies: 5,
            delay: 5500
        },
        {
            enemies: 6,
            delay: 4500
        },
        {
            enemies: 10,
            delay: 3000
        }
    ]
    constructor() {
        super({key: 'GameScene'});
        this.lives = 3;
        this.wave = 0;
        this.enemiesLeft = 0;
        this.waveActive = false;
        this.waveTimerActive = false;
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
            const waveSettings = GameScene.waves[this.wave++];
            this.enemiesLeft = waveSettings.enemies;
            this.waveActive = true;
            this.waveTimerActive = true;
            this.waveTimer = this.time.addEvent({
                delay: waveSettings.delay,
                callback: this.addEnemy,
                callbackScope: this,
                args: [waveSettings]
            });
            this.scene.launch('RhythmScene');
        }
    }

    addEnemy(waveSettings){
        const enemy = new Enemy(this);
        this.enemies.add(enemy);
        this.add.existing(enemy);
        enemy.followPath(this.path);
        enemy.once('onReachedEnd', this.onEnemyPassed, this);
        enemy.once('onKilled', this.onEnemyKilled, this);
        if (this.enemiesLeft > 0) {
            this.waveTimer = this.time.addEvent({
                delay: waveSettings.delay,
                callback: this.addEnemy,
                callbackScope: this,
                args: [waveSettings]
            });
            this.enemiesLeft -= 1;
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