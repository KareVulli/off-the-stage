import BaseListItem from "./BaseListItem";

export default class List extends Phaser.GameObjects.Container {
    constructor(scene, x, y, items = [], startHidden = false) {
        super(scene, x, y);

        if (startHidden) {
            this.show = false;
            this.setActive(false).setVisible(false);
        } else {
            this.show = true;
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            this.addItem(item);
        }
    }

    addItem(item) {
        const button = new BaseListItem(this.scene, 0, this.getAll().length * 40, item);
        button.on('onClicked', this.onItemClicked, this);
        this.scene.add.existing(button);
        this.add(button);
    }

    updateItem(key, item) {
        const listItem = this.getFirst('key', key);
        listItem.updateItem(item);
    }

    onItemClicked(item) {
        this.emit('onItemClicked', item);
    }

    toggle() {
        if (this.show) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.show = true;
        this.setActive(true).setVisible(true);
        this.scene.tweens.add({
            targets: this,
            alpha: {from: 0, to: 1},
            duration: 100
        });
    }

    close() {
        this.show = false;
        this.scene.tweens.add({
            targets: this,
            alpha: {from: 1, to: 0},
            onComplete: this.afterCloseFade,
            onCompleteScope: this,
            duration: 100
        });
    }

    afterCloseFade () {
        console.log('afterCloseFade');
        this.setActive(false).setVisible(false);
    }

    update(time, delta) {

    }
}