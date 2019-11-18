import generateEnemy from "../graphics/Enemy";
import generateWeaponSlot from "../graphics/WeaponSlot";
import generateLight from "../graphics/Light";
import Enemy from "../sprites/Enemy";
import WeaponSlot from "../sprites/WeaponSlot";
import lightImage from "../assets/light.png";
import bloodImage from "../assets/blood-splat.png";
import backgroundImage from "../assets/background.png";
import backgroundLightsImage from "../assets/background-lights.png";
import DeathParticles from "../particles/DeathParticles";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameScene'});
        this.lives = 3
    }

    preload() {
        generateEnemy(this)
        generateWeaponSlot(this)
        generateLight(this)
        this.load.image('particle-light', lightImage);
        this.load.image('particle-blood', bloodImage);
        this.load.image('image-background', backgroundImage);
        this.load.image('image-background-lights', backgroundLightsImage);
    }

    create() {
        this.background = this.add.image(0, 0, 'image-background')
        this.background.setOrigin(0, 0)
        this.backgroundLights = this.add.image(0, 0, 'image-background-lights')
        this.backgroundLights.setOrigin(0, 0)
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
            1360, 350, 
            1000, 400, 
            800, 300, 
            500, 350, 
            200, 350
        ])

        const debugGraphics = this.add.graphics();
        debugGraphics.lineStyle(2, 0x333333, 1);

        this.path.draw(debugGraphics, 64);

        this.healthText = this.add.text(20, 20)
        this.updateLivesCounter()

        this.waveTimer = this.time.addEvent({
            delay: 3000,
            callback: this.addEnemy,
            callbackScope: this,
            repeat: 5
        });

        this.add.existing(new WeaponSlot(this, 1200, 300, this.enemies));
        this.add.existing(new WeaponSlot(this, 600, 400, this.enemies));

        // weaponSlot.setWeapon();
    }

    addEnemy(){
        const enemy = new Enemy(this);
        this.enemies.add(enemy);
        this.add.existing(enemy);
        enemy.followPath(this.path);
        enemy.once('onReachedEnd', this.onEnemyPassed, this);
    }

    onEnemyPassed(enemy) {
        this.lives--;
        this.updateLivesCounter();
        enemy.destroy();
    }

    updateLivesCounter () {
        this.healthText.setText(`Lives: ${this.lives}`)
    }

    update(time, delta) {
        
    }
}