import Light from "./Light";

export default class Smoke extends Phaser.GameObjects.Image {
    constructor(scene, x, y, SFXVolume, size = 80, speed = 3, lifetime = 2000) {
        super(scene, x, y, 'sprite-light');
        this.SFXVolume = SFXVolume;
        scene.physics.world.enable(this);
        this.size = size;
        this.lifetime = lifetime;
        this.speed = speed;
        this.setAlpha(0);

        this.particles = scene.add.particles('particle-smoke');

        this.emitter = this.particles.createEmitter({
            lifespan: 1000,
            scale: { start: 1, end: 5 },
            alpha: { start: 0.7, end: 0 },
            speedX: {min: -2, max: 2},
            speedY: {min: -2, max: 2},
            angle: {min: -180, max: 180},
            tint: [0xffffff, 0xbbbbbb, 0xeeeeee],
            frequency: 50
        });

        this.emitter.startFollow(this);
    }

    fire(direction) {
        this.scene.physics.velocityFromRotation(direction, 20, this.body.velocity);
        // We want the projectile act as a custom size area collision
        this.body.setSize(this.size, this.size, true);
        this.body.velocity.x *= this.speed;
        this.body.velocity.y *= this.speed;
        this.scene.sound.play('audio-fire2', {
            volume: this.SFXVolume / 2
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