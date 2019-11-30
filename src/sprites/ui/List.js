import Button from "./Button";
import { throws } from "assert";

export default class List extends Phaser.GameObjects.Group {
    constructor(scene, x, y, items = []) {
        super(scene);
        this.x = x;
        this.y = y;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            this.addItem(item);
        }

        this.show = true;
    }

    addItem(title) {
        const item = new Button(this.scene, this.x, this.y + this.items.length * 60, title);
        this.scene.add.existing(item);
        this.items.push(item);
    }

    open() {
        this.show = true;
    }

    close() {
        this.show = false;
        this.children.forEach(item => {
            item.
        });
    }

    update(time, delta) {

    }
}