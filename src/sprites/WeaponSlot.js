import BaseWeapon from "./weapons/BaseWeapon";
import List from "./ui/List";

export default class WeaponSlot extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y, enemiesGroup) {
        super(scene, {x: x, y: y});
        this.enemies = enemiesGroup;
        this.weapon = null;
        this.setInteractive({ 
            hitArea: new Phaser.Geom.Circle(0, 0, 32),
            hitAreaCallback: Phaser.Geom.Circle.Contains,
            useHandCursor: true
        });

        this.on('pointerdown', this.onMouseDown, this);
        this.on('pointerup', this.onMouseUp, this);
        this.on('pointerover', this.onOver, this)
        this.on('pointerout', this.onOut, this);

        this.onOut();

        this.weaponMenu = new List(scene, x + 200, y, ['Hello', 'World']);
        
    }

    onMouseUp () {
        this.setWeapon();
        this.onOver();
    }

    onMouseDown() {
        this.clear();
        this.fillStyle(0x555555, 1);
        this.lineStyle(2, 0xffffff, 1);
        this.fillCircle(0, 0, 32);
    }

    onOver() {
        this.clear();
        this.fillStyle(0x888888, 1);
        this.lineStyle(2, 0xffffff, 1);
        this.fillCircle(0, 0, 32);
    }

    onOut() {       
        this.clear();
        this.fillStyle(0x111111, 1);
        this.lineStyle(2, 0xffffff, 1);
        this.fillCircle(0, 0, 32);
    }

    update(time, delta) {

    }

    setWeapon () {
        if (this.weapon) {
            this.weapon.upgrade();
        } else {
            this.weapon = this.scene.add.existing(new BaseWeapon(this.scene, this.x, this.y, this.enemies));
        }
    }
}