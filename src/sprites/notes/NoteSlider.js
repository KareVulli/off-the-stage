export default class NoteSlider extends Phaser.GameObjects.Graphics {

    constructor (scene, width, height)
    {
        super(scene);

        this.x = -width / 2;
        this.y = -height;
        this.width = width;
        this.height = height;
        this.missed = false;
        this.hit = false;

        this.draw();
    }

    setMissed(missed) {
        if (missed) {
            this.hit = false;
        }
        this.missed = missed;
        this.draw();
    }

    setHit(hit) {
        if (hit) {
            this.missed = false;
        }
        this.hit = hit;
        this.draw();
    }

    draw ()
    {
        this.clear();
        if (this.hit) {
            this.fillStyle(0x00ff2f, 0.8);
        } else if (this.missed) {
            this.fillStyle(0xffffff, 0.2);
        } else {
            this.fillStyle(0x00ff2f, 0.4);
        }
        this.fillRect(0, 0, this.width, this.height);
    }
}
