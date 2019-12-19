export default (scene) => {
    const graphics = scene.make.graphics({x: 0, y: 0, add: false});
    graphics.lineStyle(3, 0xffffff, 1);
    graphics.fillStyle(0x00ff00, 0.9);
    graphics.fillCircle(16, 16, 14);
    graphics.strokeCircle(16, 16, 14);
    graphics.generateTexture('slider-head', 32, 32);
}