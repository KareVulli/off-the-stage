export default class DeathParticles extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    constructor(scene) {
        super(scene, 'particle-light', null, {
            on: false,
            lifespan: 1000,
            speed: {
                min: 0,
                max: 100
            },
            scale: { start: 0.5, end: 1 },
            alpha: {
                start: 1,
                end: 0,
                ease: "Quad.easeOut"
            },
            blendMode: 'ADD',
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Circle(0, 0, 32)
            },
            tint: 0xffffffff
        });
    }
}