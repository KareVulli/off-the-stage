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
    static sprite = 'sprite-weapon';

    constructor(scene, x, y, enemiesGroup) {
        super(scene, x, y, enemiesGroup);
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