import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import PhaserUpdatePlugin from 'phaser-plugin-update'

const config = {
    type: Phaser.WEBGL,
    parent: "phaser-example",
    width: 1366,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 200 }
        }
    },
    scene: [
        GameScene
    ],
    plugins: {
        scene: [{ key: 'updatePlugin', plugin: PhaserUpdatePlugin, mapping: 'updates' }]
    }
};

const game = new Phaser.Game(config);