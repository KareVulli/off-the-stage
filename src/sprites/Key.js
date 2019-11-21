import Healthbar from "../graphics/Healthbar";

export default class Key extends Phaser.GameObjects.Sprite {
    constructor(scene, noteNumber) {
        super(scene, 1366 - ((72 + 3) * (4 - noteNumber)) + 18, 768-50, 'particle-light');
        this.setAlpha(0);
        //this.setTint(0x00ff2f);
    }
}