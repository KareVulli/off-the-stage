export default (scene) => {
    const graphics = scene.make.graphics({x: 0, y: 0, add: false});
    graphics.lineStyle(10, 0x9cffff, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(297, 0);
    graphics.closePath();
    graphics.strokePath();
    graphics.generateTexture('sprite-hit-line', 297, 10);
}