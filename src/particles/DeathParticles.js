export default class DeathParticles extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    constructor(scene) {
        super(scene, 'particle-blood', null, [{
                on: false,
                lifespan: { min: 200, max: 1000 },
                speed: {
                    min: 200,
                    max: 300
                },
                scale: 0.2,
                alpha: {
                    start: 1,
                    end: 0,
                    ease: "Quad.easeOut"
                },
                tint: 0xff006bd9,
                blendMode: 'NORMAL'
            },
            {
                on: false,
                lifespan: { min: 200, max: 600 },
                speed: {
                    min: 0,
                    max: 20
                },
                scale: { start: 1, end: 1.5 },
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
                frequency: -1
            }
        ]);
    }
}