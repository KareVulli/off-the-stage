export default (scene, width = 250, height = 50, name='button') => {
    const graphics = scene.make.graphics({x: 0, y: 0, add: false});

    graphics.fillStyle(0x09ff00, 0.5);
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.strokeRect(0, 0, width, height);
    graphics.generateTexture('sprite-' + name + '-out', width, height);

    graphics.clear();
    graphics.fillStyle(0x4bff45, 0.7);
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.strokeRect(0, 0, width, height);
    graphics.generateTexture('sprite-' + name + '-over', width, height);
    
    graphics.clear();
    graphics.fillStyle(0x05a800, 0.7);
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.strokeRect(0, 0, width, height);
    graphics.generateTexture('sprite-' + name + '-pressed', width, height);
}