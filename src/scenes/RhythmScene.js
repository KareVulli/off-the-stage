export default class RhythmScene extends Phaser.Scene {
    constructor() {
        super({key: 'RhythmScene'});
    }

    preload() {

    }

    create() {
        this.text = this.add.text(800, 600, 'RhythmScene');
    }
}