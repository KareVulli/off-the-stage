import Light from "./Light";

export default class Smoke extends Phaser.GameObjects.Image {
    constructor(scene, x, y, size = 50, speed = 5, lifetime = 1500) {
        super(scene, x, y, 'sprite-light');
        scene.physics.world.enable(this);
        this.size = size;
        this.lifetime = lifetime;
        this.speed = speed;
        this.direction = 0;
        this.setAlpha(0);

        this.particles = scene.add.particles('particle-wave');

        this.emitter = this.particles.createEmitter({
            lifespan: 1000,
            scale: { start: 1.5, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: [0x000000, 0x111111],
            rotate: {onEmit: () => this.direction},
            frequency: 140
        });

        this.emitter.startFollow(this);
    }

    fire(direction) {
        this.direction = Phaser.Math.RadToDeg(direction) + 90;
        this.scene.physics.velocityFromRotation(direction, 20, this.body.velocity);
        // We want the projectile act as a custom size area collision
        this.body.setSize(this.size, this.size, true);
        this.body.velocity.x *= this.speed;
        this.body.velocity.y *= this.speed;
        this.scene.sound.play('audio-fire2', {
            volume: 0.2
        });
        this.scene.time.addEvent({
            delay: this.lifetime,
            callback: () => {
                this.destroy()
            },
            callbackScope: this
        });
    }

    destroy (fromScene) {
        this.emitter.stop();
        this.emitter.onParticleDeath(this.particleDeath, this);
        super.destroy(fromScene);
    }

    particleDeath() {
        if (!this.emitter.getAliveParticleCount()) {
            this.particles.destroy();
        }
    }
}