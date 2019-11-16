import Light from "../projectiles/Light";

export default class BaseWeapon extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, enemiesGroup) {
        super(scene, x, y, 'sprite-weapon');
        scene.updates.add(this);
        this.fireRate = 400;
        this.damage = 25;
        this.range = 100;
        this.targets = [];
        this.lastFired = 0;
        this.enemies = enemiesGroup;
        this.projectile = Light;
        this.projectiles = scene.physics.add.group({
            classType: this.projectile,
            allowGravity: false
        });

        this.zone = scene.add.zone(this.x, this.y, this.range * 2, this.range * 2);
        scene.physics.world.enable(this.zone)
        this.zone.body.setAllowGravity(false);
        this.zone.body.moves = false;
        this.zone.setCircleDropZone(this.range);

        scene.physics.add.overlap(enemiesGroup, this.zone, this.onOverlap, null, this);
        scene.physics.add.overlap(enemiesGroup, this.projectiles, this.onHit, null, this);

        const debugGraphics = scene.add.graphics();
        debugGraphics.lineStyle(2, 0xaaaaaa, 1);
        debugGraphics.strokeCircle(this.x, this.y, this.range)
    }

    onHit (enemy, projectile) {
        console.log('onHit', enemy);
        if(enemy.damage(this.damage)) {
            enemy.stopFollow();
            this.enemies.remove(enemy, true, true);
        }
        projectile.destroy();
    }

    onOverlap(zone, enemy) {
        
        this.targets.push(enemy);
    }

    fire () {
        console.log('FIRE');
        const projectile = new Light(this.scene, this.x, this.y);
        this.scene.add.existing(projectile);
        this.projectiles.add(projectile);
        projectile.fire(this.rotation);
    }

    update(time, delta) {
        if (this.targets.length) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targets[0].x, this.targets[0].y);
            this.setRotation(angle);
            if (this.lastFired + this.fireRate < time) {
                this.lastFired = time;
                this.fire();
            }
        }
        this.targets = [];
    }
}