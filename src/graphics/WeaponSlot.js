export default (scene) => {
    const graphics = scene.make.graphics({x: 0, y: 0, add: false});
    graphics.fillStyle(0x999999, 1);
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.fillEllipse(32, 32, 64, 32);
    graphics.generateTexture('sprite-weapon-slot', 64, 64);
}