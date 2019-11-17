import generateEnemy from "../graphics/Enemy";
import generateWeaponSlot from "../graphics/WeaponSlot";
import generateLight from "../graphics/Light";
import Enemy from "../sprites/Enemy";
import WeaponSlot from "../sprites/WeaponSlot";
import lightImage from "../assets/light.png";
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
    }

    create() {
        this.deathParticles = new DeathParticles(this);
        this.add.existing(this.deathParticles);

        this.enemies = this.physics.add.group({
            runChildUpdate: true,
            allowGravity: false
        });
        this.physics.world.enable(this.enemies);

        console.log('hello');

        this.path = new Phaser.Curves.Spline([
            600, 600,
            400, 500,
            650, 400,
            600, 300,
            600, 50
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

        this.add.existing(new WeaponSlot(this, 600, 500, this.enemies));
        this.add.existing(new WeaponSlot(this, 500, 350, this.enemies));

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