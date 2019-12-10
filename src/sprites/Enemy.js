import Healthbar from "../graphics/Healthbar";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, speed = 50, health = 100, x = 0, y = 0) {
        super(scene, x, y, 'sprite-enemy');
        this.baseSpeed = speed;
        this.speed = speed;
        this.hp = new Healthbar(scene, x, y, health);
        scene.physics.world.enable(this);
        this.body.setSize(40, 50, true);

        this.anims.play('enemy-walk');
        this.slowTimer = null;
    }

    followPath(path, resolution = 64) {
        this.points = path.getSpacedPoints(resolution);

        this.tempVec = new Phaser.Math.Vector2();
        this.tempVecP = new Phaser.Math.Vector2();
    
        this.x = this.points[0].x;
        this.y = this.points[0].y;
        this.currentPoint = 1;
        this.setRotation(Math.atan2(this.points[1].y - this.y, this.points[1].x - this.x));    
        this.moveToNextPoint();
    }

    moveToNextPoint ()
    {
        if (this.currentPoint < this.points.length) {
            var next = this.points[this.currentPoint]; 
            this.moveToXY(next.x, next.y, this.speed);
            this.currentPoint++;
        } else {
            this.emit('onReachedEnd', this);
        }
    }

    moveToXY (x, y, speed, maxTime)
    {
        if (speed === undefined) { speed = 60; }
        if (maxTime === undefined) { maxTime = 0; }

        const angle = Math.atan2(y - this.y, x - this.x);
        const dx = this.x - x;
        const dy = this.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (maxTime > 0)
        {
            //  We know how many pixels we need to move, but how fast?
            speed = distance / (maxTime / 1000);
        }
        // How long will it take:
        maxTime = (distance / speed) * 1000;

        // var shortestAngle = Phaser.Math.Angle.ShortestBetween(this.angle, Phaser.Math.RadToDeg(angle));     

        this.moveTimer = this.scene.time.delayedCall(maxTime, this.moveToNextPoint, [], this); 
        // const angularVelocity = shortestAngle / (maxTime / 1000);

        // this.setAngularVelocity(angularVelocity);
        this.setVelocityX(Math.cos(angle) * speed);
        this.setVelocityY(Math.sin(angle) * speed);
    }

    update(time, delta) {
        this.hp.x = this.x - 32;
        this.hp.y = this.y - 100;
        this.hp.draw();
    }

    damage(damage) {        
        if (this.hp.decrease(damage)) {
            this.emit('onKilled', this);
            this.scene.sound.play('audio-death' + (Math.random() > 0.5 ? '2' : ''));
            return true;
        }
        return false;
    }

    slow(factor, time) {
        this.speed = this.baseSpeed - (this.baseSpeed * factor);
        if (this.slowTimer) {
            this.slowTimer.remove();
        }
        this.slowTimer = this.scene.time.delayedCall(time, this.resetSpeed, [], this);
    }

    resetSpeed() {
        console.log('Reset slowness');
        this.speed = this.baseSpeed;
        this.slowTimer = null;
    }

    destroy (fromScene) {
        if (this.moveTimer) {
            this.moveTimer.remove();
        }
        this.hp.destroy();
        super.destroy(fromScene);
    }
}