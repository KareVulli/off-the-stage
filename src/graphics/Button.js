export default (scene, width = 250, height = 50, name='button') => {
    const graphics = scene.make.graphics({x: 0, y: 0, add: false});

    graphics.fillStyle(0x131413, 0.9);
    graphics.lineStyle(4, 0xffffff, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.strokeRect(0, 0, width, height);
    graphics.generateTexture('sprite-' + name + '-out', width, height);

    graphics.clear();
    graphics.fillStyle(0x282a28, 0.9);
    graphics.lineStyle(4, 0xffffff, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.strokeRect(0, 0, width, height);
    graphics.generateTexture('sprite-' + name + '-over', width, height);
    
    graphics.clear();
    graphics.fillStyle(0x070707, 0.9);
    graphics.lineStyle(4, 0xffffff, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.strokeRect(0, 0, width, height);
    graphics.generateTexture('sprite-' + name + '-pressed', width, height);
}