import Button from "../sprites/ui/Button";
import Text from "../sprites/ui/Text";

export default class OptionsScene extends Phaser.Scene {
    constructor() {
        super({key: 'OptionsScene'});
    }

    preload() {

    }

    create()
    {

        const musicVolume = localStorage.getItem('music-volume')
        const SFXVolume = localStorage.getItem('sfx-volume')
        const hitsoundsVolume = localStorage.getItem('hitsounds-volume')
 
        this.cameras.main.fadeIn(200, 0, 0, 0);
        //this.background = this.add.image(0, 0, 'image-menu-background');
        //this.background.setOrigin(0, 0)

        /* this.btnStart = new Button(this, 1366 / 2, 500, 'Start game');
        this.btnStart.on('pointerup', this.onStart, this);
        this.add.existing(this.btnStart); */

        this.btnBack = new Button(this, 1366 / 2, 600, 'Go back');
        this.btnBack.on('pointerup', this.onBack, this);
        this.add.existing(this.btnBack);

        this.optMusicLevelTrack = this.add.image(1366/2, 300, 'slider-track')
        this.optMusicLevelSlider = this.add.image(1366/2, 300, 'slider-head');
        this.optMusicLevelSlider.slider = this.plugins.get('rexSlider').add(this.optMusicLevelSlider, {
            endPoints: [{
                    x: this.optMusicLevelSlider.x - 200,
                    y: this.optMusicLevelSlider.y
                },
                {
                    x: this.optMusicLevelSlider.x + 200,
                    y: this.optMusicLevelSlider.y
                }
            ],
            value: musicVolume
        });
        this.optMusicLevelText = new Text(this, 1366/2 - 200, 260);
        this.add.existing(this.optMusicLevelText);

        this.optSFXLevelTrack = this.add.image(1366/2, 400, 'slider-track')
        this.optSFXLevelSlider = this.add.image(1366/2, 400, 'slider-head');
        this.optSFXLevelSlider.slider = this.plugins.get('rexSlider').add(this.optSFXLevelSlider, {
            endPoints: [{
                    x: this.optSFXLevelSlider.x - 200,
                    y: this.optSFXLevelSlider.y
                },
                {
                    x: this.optSFXLevelSlider.x + 200,
                    y: this.optSFXLevelSlider.y
                }
            ],
            value: SFXVolume
        });
        this.optSFXLevelText = new Text(this, 1366/2 - 200, 360);
        this.add.existing(this.optSFXLevelText);

        this.optHitsoundsLevelTrack = this.add.image(1366/2, 500, 'slider-track')
        this.optHitsoundsLevelSlider = this.add.image(1366/2, 500, 'slider-head');
        this.optHitsoundsLevelSlider.slider = this.plugins.get('rexSlider').add(this.optHitsoundsLevelSlider, {
            endPoints: [{
                    x: this.optHitsoundsLevelSlider.x - 200,
                    y: this.optHitsoundsLevelSlider.y
                },
                {
                    x: this.optHitsoundsLevelSlider.x + 200,
                    y: this.optHitsoundsLevelSlider.y
                }
            ],
            value: hitsoundsVolume
        });
        this.optHitsoundsLevelText = new Text(this, 1366/2 - 200, 460);
        this.add.existing(this.optHitsoundsLevelText);

    }

    /* onStart() {
        this.cameras.main.fadeOut(400, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.scene.start('GameScene');
            }
        }, this);
    } */

    onBack() {
        localStorage.setItem('music-volume', this.optMusicLevelSlider.slider.value)
        localStorage.setItem('sfx-volume', this.optSFXLevelSlider.slider.value)
        localStorage.setItem('hitsounds-volume', this.optHitsoundsLevelSlider.slider.value)
        this.cameras.main.fadeOut(200, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.scene.start('MenuScene');
            }
        }, this);
    }

    update() {
        this.optMusicLevelText.setText(`Music volume: ${Math.round(this.optMusicLevelSlider.slider.value * 100)}%`);
        this.optSFXLevelText.setText(`Effects volume: ${Math.round(this.optSFXLevelSlider.slider.value * 100)}%`);
        this.optHitsoundsLevelText.setText(`Hit-sounds volume: ${Math.round(this.optHitsoundsLevelSlider.slider.value * 100)}%`);
    }
}