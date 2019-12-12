import BaseWeapon from "./BaseWeapon";
import Soundwave from "../projectiles/Soundwave";

export default class SpeakerWeapon extends BaseWeapon {
    static upgrades = [
        {damage: 10, firerate: 1000, range: 80, price: 500}, // initial buy price
        {damage: 15, firerate: 900, range: 100, price: 100},
        {damage: 20, firerate: 800, range: 120, price: 300},
        {damage: 25, firerate: 700, range: 150, price: 400},
        {damage: 30, firerate: 600, range: 180, price: 500}
    ]
    static key = 'WEAPON_SPEAKER';
    static name = 'Subwoofer';
    static projectile = Soundwave;
    static sprite = 'sprite-speaker';

    constructor(scene, x, y, enemiesGroup) {
        super(scene, x, y, enemiesGroup);
        this.setScale(0.8)
    }

    setWeaponRotation(angle) {
        if (angle < -120) {
            this.setFrame(4)
            this.setDepth(1)
        } else if (angle < -60) {
            this.setFrame(3)
            this.setDepth(1)
        } else if (angle < 0) {
            this.setFrame(2)
            this.setDepth(1)
        } else if (angle < 60) {
            this.setFrame(1)
            this.setDepth(0)
        } else if (angle < 120) {
            this.setFrame(0)
            this.setDepth(0)
        } else {
            this.setFrame(5)
            this.setDepth(0)
        }
    }

    onHit (enemy, projectile) {
        // This is full of hacks...
        if((enemy.lastHitTime || 0) + 100 < this.scene.time.now) {
            enemy.lastHitTime = this.scene.time.now;
            if (enemy.damage(this.damage)) {
                this.scene.deathParticles.emitParticle(50, enemy.x, enemy.y);
                this.enemies.remove(enemy, true, true);
            }
        }
    }
}