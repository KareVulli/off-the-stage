export default (scene, width = 400, height = 16) => {
    const graphics = scene.make.graphics({x: 0, y: 0, add: false});

    graphics.fillStyle(0x131413, 0.9);
    graphics.lineStyle(4, 0xffffff, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.strokeRect(0, 0, width, height);
    graphics.generateTexture('slider-track', width, height);
}