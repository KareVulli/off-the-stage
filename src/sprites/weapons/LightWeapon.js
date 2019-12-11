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
    static sprite = 'sprite-weapon';

    constructor(scene, x, y, enemiesGroup) {
        super(scene, x, y, enemiesGroup);
    }
}