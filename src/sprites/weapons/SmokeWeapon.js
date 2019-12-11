import Smoke from "../projectiles/Smoke";
import BaseWeapon from "./BaseWeapon";

export default class SmokeWeapon extends BaseWeapon {
    static upgrades = [
        {damage: 0.1, slowness: 0.3, time: 1000, firerate: 5000, range: 70, price: 150}, // initial buy price
        {damage: 0.2, slowness: 0.5, time: 2000, firerate: 5000, range: 80, price: 100},
        {damage: 0.2, slowness: 0.5, time: 3000, firerate: 3000, range: 80, price: 100},
        {damage: 0.3, slowness: 0.6, time: 4000, firerate: 3000, range: 100, price: 300},
        {damage: 0.5, slowness: 0.6, time: 5000, firerate: 3000, range: 100, price: 500}
    ]
    static key = 'WEAPON_SMOKE';
    static name = 'Smoke machine';
    static projectile = Smoke;
    static sprite = 'image-rhythm-note';
    
    constructor(scene, x, y, enemiesGroup) {
        super(scene, x, y, enemiesGroup);
    }

    onUpgrade(newUpgrade) {
        super.onUpgrade(newUpgrade);
        this.slowness = newUpgrade.slowness;
        this.effectTime = newUpgrade.time;
    }

    onHit (enemy, projectile) {
        enemy.slow(this.slowness, this.effectTime);
        if(enemy.damage(this.damage)) {
            this.scene.deathParticles.emitParticle(50, enemy.x, enemy.y);
            this.enemies.remove(enemy, true, true);
        }
    }
}