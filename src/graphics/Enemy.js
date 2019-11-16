export default (scene) => {
    const graphics = scene.make.graphics({x: 0, y: 0, add: false});
    graphics.fillStyle(0xffff00, 1);
    graphics.slice(32, 32, 32, Phaser.Math.DegToRad(340), Phaser.Math.DegToRad(20), true);
    graphics.fillPath();
    graphics.generateTexture('sprite-enemy', 64, 64);
}