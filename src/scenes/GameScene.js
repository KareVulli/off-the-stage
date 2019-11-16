import generateEnemy from "../graphics/Enemy";
import generateWeaponSlot from "../graphics/WeaponSlot";
import generateLight from "../graphics/Light";
import Enemy from "../sprites/Enemy";
import WeaponSlot from "../sprites/WeaponSlot";
import lightImage from "../assets/light.png";

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

        this.enemies = this.physics.add.group({
            runChildUpdate: true,
            allowGravity: false
        });
        this.physics.world.enable(this.enemies);

        console.log('hello');

        this.path = new Phaser.Curves.Spline([
            700, 300,
            500, 400,
            400, 300,
            200, 350,
            100, 300
        ])

        const debugGraphics = this.add.graphics();
        debugGraphics.lineStyle(2, 0x333333, 1);

        this.path.draw(debugGraphics, 64);

        this.healthText = this.add.text(20, 20)
        this.updateLivesCounter()

        this.waveTimer = this.time.addEvent({
            delay: 1000,
            callback: this.addEnemy,
            callbackScope: this,
            repeat: 4
        });

        this.add.existing(new WeaponSlot(this, 525, 300, this.enemies));
        this.add.existing(new WeaponSlot(this, 200, 270, this.enemies));

        // weaponSlot.setWeapon();
    }

    addEnemy(){
        const enemy = new Enemy(this, this.path, 700, 300);
        this.enemies.add(enemy);
        this.add.existing(enemy);
        enemy.startFollow({
            duration: 5000,
            repeat: 0,
            rotateToPath: true,
            onComplete: this.onEnemyPassed,
            onCompleteScope: this,
            onCompleteParams: [enemy]
        });
    }

    onEnemyPassed(tween, targets, enemy) {
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