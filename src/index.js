import Phaser from "phaser";
import PhaserUpdatePlugin from 'phaser-plugin-update'
import LoadingScene from "./scenes/LoadingScene";
import GameScene from "./scenes/GameScene";
import RhythmScene from "./scenes/RhythmScene";
import GameOverScene from "./scenes/GameOverScene";

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
        GameOverScene
    ],
    plugins: {
        scene: [{ key: 'updatePlugin', plugin: PhaserUpdatePlugin, mapping: 'updates' }]
    }
};

const game = new Phaser.Game(config);