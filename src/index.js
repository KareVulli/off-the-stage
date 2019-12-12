import Phaser from "phaser";
import PhaserUpdatePlugin from 'phaser-plugin-update'
import LoadingScene from "./scenes/LoadingScene";
import GameScene from "./scenes/GameScene";
import RhythmScene from "./scenes/RhythmScene";
import MenuScene from "./scenes/MenuScene";
import GameOverScene from "./scenes/GameOverScene";

const config = {
    type: Phaser.WEBGL,
    parent: "phaser",
    width: 1366,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 200 }
        }
    },
    scene: [
        LoadingScene,
        MenuScene,
        GameScene,
        GameOverScene
    ],
    plugins: {
        scene: [{ key: 'updatePlugin', plugin: PhaserUpdatePlugin, mapping: 'updates' }]
    }
};

const game = new Phaser.Game(config);