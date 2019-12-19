import generateWeaponSlot from "../graphics/WeaponSlot";
import generateLight from "../graphics/Light";
import generateButton from "../graphics/Button";
import generateSliderTrack from "../graphics/SliderTrack";
import generateSliderHead from "../graphics/SliderHead";
import enemyImage from "../assets/crazy-fan.png";
import lightImage from "../assets/light.png";
import smokeImage from "../assets/smoke-puff.png";
import waveImage from "../assets/wave.png";
import bloodImage from "../assets/blood-splat.png";
import speakerImage from "../assets/speakers.png";
import smokeWeaponImage from "../assets/smoke-machine.png";
import lightWeaponImage from "../assets/stage-light.png";
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

// MenuScene
import menuBackgroundImage from '../assets/menu.png';

// RythmScene
import rythmBackgroundImage from '../assets/rhythm-background.png';
import noteImage from '../assets/rhythm-note.png';
import activeNoteImage from '../assets/rhythm-note-active.png';
import hitSound from '../assets/sounds/HitSound.mp3';
import hitSound2 from '../assets/sounds/HitSound2.mp3';
import hitSound3 from '../assets/sounds/HitSound3.wav';
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
        generateSliderTrack(this);
        generateSliderHead(this);
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
        this.load.spritesheet('sprite-enemy', enemyImage, { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('sprite-weapon-slot', weaponSlotButton, { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('sprite-speaker', speakerImage, { frameWidth: 100, frameHeight: 110 });
        this.load.spritesheet('sprite-smoke', smokeWeaponImage, { frameWidth: 120, frameHeight: 90 });
        this.load.spritesheet('sprite-stage-light', lightWeaponImage, { frameWidth: 80, frameHeight: 110 });
        

        this.load.audio('audio-death', death1Sound);
        this.load.audio('audio-death2', death2Sound);
        this.load.audio('audio-fire1', fire1Sound);
        this.load.audio('audio-fire2', fire2Sound);
        this.load.audio('audio-fire3', fire3Sound);
        this.load.audio('audio-background', backgroundSound);

        // MenuScene:
        this.load.image('image-menu-background', menuBackgroundImage);

        // RythmScene:
        this.load.audio('audio-hitsound', hitSound);
        this.load.audio('audio-hitsound2', hitSound2);
        this.load.audio('audio-hitsound3', hitSound3);
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
                this.scene.start('MenuScene');
            }
        });
        this.progressText.setText('Loading settings...');
        const musicVolume = localStorage.getItem('music-volume')
        const SFXVolume = localStorage.getItem('sfx-volume')
        const HitsoundsVolume = localStorage.getItem('hitsounds-volume')
        if (musicVolume === null) {
            console.log('Loading default value for music-volume')
            localStorage.setItem('music-volume', 0.8)
        }
        if (SFXVolume === null) {
            console.log('Loading default value for sfx-volume')
            localStorage.setItem('sfx-volume', 0.4)
        }
        if (HitsoundsVolume === null) {
            console.log('Loading default value for hitsounds-volume')
            localStorage.setItem('hitsounds-volume', 0.5)
        }
        this.progressText.setText('Done');
    }
}