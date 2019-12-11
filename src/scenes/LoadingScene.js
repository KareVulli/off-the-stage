import generateWeaponSlot from "../graphics/WeaponSlot";
import generateLight from "../graphics/Light";
import generateButton from "../graphics/Button";
import enemyImage from "../assets/enemy.png";
import lightImage from "../assets/light.png";
import smokeImage from "../assets/smoke-puff.png";
import waveImage from "../assets/wave.png";
import bloodImage from "../assets/blood-splat.png";
import backgroundImage from "../assets/background/background-no-lights.png";
import backgroundCharacterImage from "../assets/background/background-character.png";
import backgroundLightsRedImage from "../assets/background/background-lights-red.png";
import backgroundLightsGreenImage from "../assets/background/background-lights-green.png";
import backgroundLightsBlueImage from "../assets/background/background-lights-blue.png";
import disabledButtonImage from '../assets/button-disabled.png';
import weaponSlotButton from '../assets/weapon-slot.png';
import death1Sound from '../assets/sounds/death1.wav';
import death2Sound from '../assets/sounds/death2.wav';
import fire1Sound from '../assets/sounds/Shoot1.mp3';
import fire2Sound from '../assets/sounds/Shoot2.mp3';
import fire3Sound from '../assets/sounds/Shoot3.mp3';
import backgroundSound from '../assets/sounds/chillSong.mp3';

// RythmScene
import rythmBackgroundImage from '../assets/rhythm-background.png';
import noteImage from '../assets/rhythm-note.png';
import activeNoteImage from '../assets/rhythm-note-active.png';
import hitSound from '../assets/sounds/HitSound.mp3';
import hitSound2 from '../assets/sounds/HitSound2.mp3';
import generateHitLine from "../graphics/HitLine";

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super({key: 'LoadingScene'});
    }

    preload() {
        this.progressBackground = this.add.graphics();
        this.progressBackground.fillStyle(0x999999, 1);
        this.progressBackground.fillRect(96, 696, 1174, 20);

        this.progress = this.add.graphics();
        this.progressText = this.add.text(96, 670, 'Loading...');
        // this.progressText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            this.progress.clear();
            this.progress.fillStyle(0x00ff0c, 1);
            this.progress.fillRect(100, 700, 1166 * value, 12);
        }, this);
    
        this.load.on('complete', (value) => {
            //this.progress.destroy();
        }, this);

        // generateWeaponSlot(this);
        generateLight(this);
        generateButton(this);
        generateButton(this, 220, 35, 'list-item');
        this.load.image('image-list-item-disabled', disabledButtonImage);
        this.load.image('particle-light', lightImage);
        this.load.image('particle-smoke', smokeImage);
        this.load.image('particle-blood', bloodImage);
        this.load.image('particle-wave', waveImage);
        this.load.image('image-background', backgroundImage);
        this.load.image('image-background-lights-red', backgroundLightsRedImage);
        this.load.image('image-background-lights-green', backgroundLightsGreenImage);
        this.load.image('image-background-lights-blue', backgroundLightsBlueImage);
        this.load.image('image-background-character', backgroundCharacterImage);
        this.load.spritesheet('sprite-enemy', enemyImage, { frameWidth: 75, frameHeight: 100 });
        this.load.spritesheet('sprite-weapon-slot', weaponSlotButton, { frameWidth: 64, frameHeight: 64 });

        this.load.audio('audio-death', death1Sound);
        this.load.audio('audio-death2', death2Sound);
        this.load.audio('audio-fire1', fire1Sound);
        this.load.audio('audio-fire2', fire2Sound);
        this.load.audio('audio-fire3', fire3Sound);
        this.load.audio('audio-background', backgroundSound);

        // RythmScene:
        this.load.audio('audio-hitsound', hitSound);
        this.load.audio('audio-hitsound2', hitSound2);
        generateHitLine(this);
        this.load.image('image-rhythm-background', rythmBackgroundImage);
        this.load.image('image-rhythm-note', noteImage);
        this.load.image('image-rhythm-active-note', activeNoteImage);

        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create()
    {
        this.progressText.setText('Loading fonts...');
        WebFont.load({
            google: {
                families: [ 'Palanquin Dark' ]
            },
            active: () =>
            {
                this.progressText.setText('Starting...');
                this.scene.start('GameScene');
            }
        });
    }
}