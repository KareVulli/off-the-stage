import BaseWeapon from "./weapons/BaseWeapon";

export default class WeaponSlot extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, enemiesGroup) {
        super(scene, x, y, 'sprite-weapon-slot');
        this.enemies = enemiesGroup;
        this.weapon = null;
        
    }

    update(time, delta) {

    }

    setWeapon () {
        this.weapon = this.scene.add.existing(new BaseWeapon(this.scene, this.x, this.y, this.enemies));
    }
}