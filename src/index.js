import Phaser from "phaser";
import LoadingScene from "./scenes/LoadingScene";
import GameScene from "./scenes/GameScene";
import RhythmScene from "./scenes/RhythmScene";
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
        LoadingScene,
        GameScene,
        RhythmScene
    ],
    plugins: {
        scene: [{ key: 'updatePlugin', plugin: PhaserUpdatePlugin, mapping: 'updates' }]
    }
};

const game = new Phaser.Game(config);