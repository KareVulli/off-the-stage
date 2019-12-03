import Button from "./Button";

export default class BaseListItem extends Button {
    constructor(scene, x, y, item) {
        super(scene, x, y);
        this.enabled = true;
        this.updateItem(item);
    }

    createBackground() {
        return this.scene.add.image(0, 0, 'sprite-list-item-out');
    }

    setEnabled (enabled) {
        this.enabled = enabled;
        if (this.enabled) {
            this.text.setColor('#ffffff');
            this.background.setTexture('sprite-list-item-out');
        } else {
            this.text.setColor('#aaaaaa');
            this.background.setTexture('image-list-item-disabled');
        }
    }

    updateItem(item) {
        this.text.setText(item.title);
        this.item = item;
        this.key = item.key;
        if (item.enabled !== undefined) {
            this.setEnabled(item.enabled);
        }
    }

    onMouseUp () {
        if (this.enabled) {
            this.emit('onClicked', this.item);
            super.onMouseUp();
        }
    }

    onMouseDown() {
        if (this.enabled) {
            this.background.setTexture('sprite-list-item-pressed');
        }
    }

    onOver() {
        if (this.enabled) {
            this.background.setTexture('sprite-list-item-over');
        }
    }

    onOut() {  
        if (this.enabled) {
            this.background.setTexture('sprite-list-item-out');
        }
    }
}