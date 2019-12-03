export default class Text extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, options) {
        super(scene, x, y, text, {fontFamily: 'Palanquin Dark', ...options});
    }
}