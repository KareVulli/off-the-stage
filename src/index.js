import Phaser from "phaser";
import PhaserUpdatePlugin from 'phaser-plugin-update'
import LoadingScene from "./scenes/LoadingScene";
import GameScene from "./scenes/GameScene";
import RhythmScene from "./scenes/RhythmScene";
import MenuScene from "./scenes/MenuScene";
import GameOverScene from "./scenes/GameOverScene";
import OptionsScene from "./scenes/OptionsScene";
import SliderPlugin from './plugins/slider/slider-plugin.js';

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
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    fps: {
        target: 1000,
        forceSetTimeOut: true
    },
    scene: [
        LoadingScene,
        MenuScene,
        GameScene,
        GameOverScene,
        OptionsScene
    ],
    plugins: {
        scene: [{ key: 'updatePlugin', plugin: PhaserUpdatePlugin, mapping: 'updates' }],
        global: [{
            key: 'rexSlider',
            plugin: SliderPlugin,
            start: true
        }]
    }
};

const game = new Phaser.Game(config);