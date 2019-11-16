export default (scene) => {
    const graphics = scene.make.graphics({x: 0, y: 0, add: false});
    graphics.lineStyle(2, 0xaa0000, 1);
    graphics.strokeCircle(6, 6, 5);
    graphics.generateTexture('sprite-light', 12, 12);
}