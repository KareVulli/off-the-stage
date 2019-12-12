import BaseWeapon from "./BaseWeapon";
import Light from "../projectiles/Light";

export default class LightWeapon extends BaseWeapon {
    static upgrades = [
        {damage: 10, firerate: 700, range: 100, price: 300}, // initial buy price
        {damage: 15, firerate: 600, range: 110, price: 100},
        {damage: 20, firerate: 500, range: 120, price: 100},
        {damage: 25, firerate: 500, range: 130, price: 200},
        {damage: 30, firerate: 400, range: 140, price: 200}
    ]
    static key = 'WEAPON_LIGHT';
    static name = 'Stage light';
    static projectile = Light;
    static sprite = 'sprite-stage-light';

    constructor(scene, x, y, enemiesGroup) {
        super(scene, x, y, enemiesGroup);
        this.setScale(0.8);
    }

    setWeaponRotation(angle) {
        if (angle < -120) {
            this.setFrame(5)
            this.setDepth(1)
        } else if (angle < -60) {
            this.setFrame(4)
            this.setDepth(1)
        } else if (angle < 0) {
            this.setFrame(0)
            this.setDepth(1)
        } else if (angle < 60) {
            this.setFrame(2)
            this.setDepth(0)
        } else if (angle < 120) {
            this.setFrame(1)
            this.setDepth(0)
        } else {
            this.setFrame(3)
            this.setDepth(0)
        }
    }
}