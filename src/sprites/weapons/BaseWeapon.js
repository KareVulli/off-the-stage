import Light from "../projectiles/Light";

export default class BaseWeapon extends Phaser.GameObjects.Sprite {
    static upgrades = [
        {damage: 10, firerate: 600, range: 100, price: 300}, // initial buy price
        {damage: 15, firerate: 600, range: 110, price: 100},
        {damage: 20, firerate: 500, range: 120, price: 100},
        {damage: 25, firerate: 500, range: 130, price: 200},
        {damage: 30, firerate: 400, range: 140, price: 200}
    ]
    static key = 'WEAPON_LIGHT';
    static name = 'Stage light';
    static projectile = Light;
    static sprite = 'sprite-weapon';
    static getBuyPrice () {
        return this.upgrades[0].price;
    }

    constructor(scene, x, y, enemiesGroup) {
        super(scene, x, y, '');
        this.setTexture(this.constructor.sprite);
        scene.updates.add(this);
        this.fireRate = 0;
        this.damage = 0;
        this.range = 0;
        this.targets = [];
        this.lastFired = 0;
        this.enemies = enemiesGroup;
        this.level = 0;

        this.projectile = this.constructor.projectile;
        this.projectiles = scene.physics.add.group({
            classType: this.projectile,
            allowGravity: false
        });

        this.zone = scene.add.zone(this.x, this.y, this.range * 2, this.range * 2);
        scene.physics.world.enable(this.zone)
        this.zone.body.setAllowGravity(false);
        this.zone.body.moves = false;

        scene.physics.add.overlap(enemiesGroup, this.zone, this.onOverlap, null, this);
        scene.physics.add.overlap(enemiesGroup, this.projectiles, this.onHit, null, this);

        /* const debugGraphics = scene.add.graphics();
        debugGraphics.lineStyle(2, 0xaaaaaa, 1);
        debugGraphics.strokeCircle(this.x, this.y, this.range) */
        this.upgrade();
    }

    upgrade (money) {
        if (this.level < this.constructor.upgrades.length) {
            let newUpgrade = this.constructor.upgrades[this.level];
            if (!money || money.use(newUpgrade.price)) {
                this.onUpgrade(newUpgrade);
                this.zone.setSize(this.range * 2, this.range * 2);
                this.zone.body.setCircle(this.range);
                this.level++;
                console.log('Weapon upgraded: ' + this.level)
            } else {
                console.log('Not enough money to upgrade to level ' + this.level)
            }
        }
    }

    onUpgrade(newUpgrade) {
        this.damage = newUpgrade.damage;
        this.fireRate = newUpgrade.firerate;
        this.range = newUpgrade.range;
    }

    getNextUpgrade () {
        if (this.level === this.constructor.upgrades.length) {
            return null;
        }
        let upgrade = {level: this.level, ...this.constructor.upgrades[this.level]}
        return upgrade;
    }

    onHit (enemy, projectile) {
        if(enemy.damage(this.damage)) {
            this.scene.deathParticles.emitParticle(50, enemy.x, enemy.y);
            this.enemies.remove(enemy, true, true);
        }
        projectile.destroy();
    }

    onOverlap(zone, enemy) {
        
        this.targets.push(enemy);
    }

    fire () {
        console.log('FIRE');
        const projectile = new this.projectile(this.scene, this.x, this.y);
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