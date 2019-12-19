export default class Light extends Phaser.GameObjects.Image {
    constructor(scene, x, y, SFXVolume) {
        super(scene, x, y, 'sprite-light');
        scene.physics.world.enable(this);
        this.speed = 2;
        this.SFXVolume = SFXVolume;

        this.particles = scene.add.particles('particle-light');

        this.emitter = this.particles.createEmitter({
            lifespan: 1000,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        this.emitter.startFollow(this);
    }

    fire(direction) {
        this.scene.physics.velocityFromRotation(direction, 200, this.body.velocity);
        // We want the projectile act as a point collision
        this.body.setSize(1, 1, true);
        this.body.velocity.x *= this.speed;
        this.body.velocity.y *= this.speed;
        this.scene.sound.play('audio-fire1', {
            volume: this.SFXVolume / 2
        });
        this.scene.time.addEvent({
            delay: 500,
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
            // console.log('ParticlesManager destroyed!')
        }
    }
}