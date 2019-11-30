import Button from "./Button";

export default class BaseListItem extends Button {
    constructor(scene, x, y, item) {
        super(scene, x, y);
        this.updateItem(item);
    }

    createBackground() {
        return this.scene.add.image(0, 0, 'sprite-list-item-out');
    }

    updateItem(item) {
        this.text.setText(item.title);
        this.item = item;
        this.key = item.key;
    }

    onMouseUp () {
        this.emit('onClicked', this.item);
        super.onMouseUp();
    }

    onMouseDown() {
        this.background.setTexture('sprite-list-item-pressed');
    }

    onOver() {
        this.background.setTexture('sprite-list-item-over');
    }

    onOut() {  
        this.background.setTexture('sprite-list-item-out');
    }
}