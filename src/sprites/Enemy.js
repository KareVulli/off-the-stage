import Healthbar from "../graphics/Healthbar";

export default class Enemy extends Phaser.GameObjects.PathFollower {
    constructor(scene, path, x, y) {
        super(scene, path, x, y, 'sprite-enemy');

        this.hp = new Healthbar(scene, x, y - 110);
    }

    update(time, delta) {
        this.hp.x = this.x - 32;
        this.hp.y = this.y - 50;
        this.hp.draw();
    }

    damage(damage) {        
        if (this.hp.decrease(damage)) {
            return true;
        }
        return false;
    }

    destroy (fromScene) {
        this.hp.destroy();
        super.destroy(fromScene);
    }
}