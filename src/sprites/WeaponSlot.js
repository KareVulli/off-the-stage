import List from "./ui/List";
import LightWeapon from "./weapons/LightWeapon";
import SmokeWeapon from "./weapons/SmokeWeapon";
import SpeakerWeapon from "./weapons/SpeakerWeapon";

export default class WeaponSlot extends Phaser.GameObjects.Sprite {
    static weapons = [
        LightWeapon,
        SmokeWeapon,
        SpeakerWeapon
    ]
    constructor(scene, x, y, enemiesGroup, money, defaultAngle = 50) {
        super(scene, x, y, 'sprite-weapon-slot');
        this.enemies = enemiesGroup;
        this.weapon = null;
        this.money = money;
        this.setInteractive({ 
            useHandCursor: true
        });
        this.defaultAngle = defaultAngle;

        this.money.events.on('moneyUsed', this.onMoneyChanged, this);
        this.money.events.on('moneyAdded', this.onMoneyChanged, this);
        this.on('pointerdown', this.onMouseDown, this);
        this.on('pointerup', this.onMouseUp, this);
        this.on('pointerover', this.onOver, this)
        this.on('pointerout', this.onOut, this);

        this.onOut();

        this.upgradeMenu = new List(scene, x + 160, y, this.buildUpgradeMenu(), true);
        this.upgradeMenu.on('onItemClicked', this.onUpgradeWeapon, this);
        scene.add.existing(this.upgradeMenu);
        
        this.weaponMenu = new List(scene, x + 160, y, this.buildWeaponMenu(), true);
        this.weaponMenu.on('onItemClicked', this.onWeaponSelected, this);
        scene.add.existing(this.weaponMenu);

    }

    destroy(fromScene) {
        super.destroy(fromScene);
    }

    onMoneyChanged() {
        if (this.weapon === null) {
            this.weaponMenu.updateItems(this.buildWeaponMenu());
        } else {
            this.updateUpgradeMenuItem();
        }
    }

    buildWeaponMenu () {
        let menuItems = [];
        for (let i = 0; i < WeaponSlot.weapons.length; i++) {
            const weapon = WeaponSlot.weapons[i];
            menuItems.push(
                {
                    key: weapon.key,
                    title: `${weapon.name} - ${weapon.getBuyPrice()} $`,
                    price: weapon.getBuyPrice(),
                    enabled: this.money.getMoney() >= weapon.getBuyPrice()
                }
            );
        }
        return menuItems;
    }

    buildUpgradeMenu () {
        let menuItems = [
            {
                key: 'UPGRADE',
                title: ''
            },
            {
                key: 'SELL',
                title: ''
            }
        ];
        return menuItems;
    }

    updateUpgradeMenuItem() {
        const nextUpgrade = this.weapon.getNextUpgrade();
        if (!nextUpgrade) {
            this.upgradeMenu.updateItem('UPGRADE', {
                key: 'UPGRADE',
                title: `Upgrades maxed`,
                enabled: false
            })
        } else {
            this.upgradeMenu.updateItem('UPGRADE', {
                key: 'UPGRADE',
                title: `Upgrade [${nextUpgrade.level}] - ${nextUpgrade.price} $`,
                enabled: this.money.getMoney() >= nextUpgrade.price
            })
        }
        this.upgradeMenu.updateItem('SELL', {
            key: 'SELL',
            title: `Sell for ${this.weapon.constructor.getBuyPrice() * 0.75} $`
        })
    }

    onMouseUp () {
        if (!this.weapon) {
            this.weaponMenu.toggle();
        } else {
            this.upgradeMenu.toggle();
        }
        this.onOver();
    }

    onMouseDown() {
        this.setFrame(2, false, false);
    }

    onOver() {
        this.setFrame(1, false, false);
        if(this.weapon) {
            this.weapon.onOver()
        }
    }

    onOut() {       
        this.setFrame(0, false, false);
        if(this.weapon) {
            this.weapon.onOut()
        }
    }

    update(time, delta) {

    }

    onWeaponSelected(item) {
        for (let i = 0; i < WeaponSlot.weapons.length; i++) {
            const weapon = WeaponSlot.weapons[i];
            if (item.key === weapon.key) {
                this.setWeapon(weapon)
                this.weaponMenu.close();
                return;
            }
        }
        console.log('Invalid weapon');
        this.weaponMenu.close();
    }

    onUpgradeWeapon (item) {
        if (item.key === 'SELL') {
            this.sellWeapon();
            // this.upgradeMenu.close();
        } else {
            this.weapon.upgrade(this.money);
            this.updateUpgradeMenuItem();
            // this.upgradeMenu.close();
        }
    }

    setWeapon (weapon) {
        console.log('setWeapon()');
        this.money.use(weapon.getBuyPrice());
        this.weapon = this.scene.add.existing(new weapon(this.scene, this.x, this.y, this.enemies));
        this.weapon.setWeaponRotation(this.defaultAngle);
        this.updateUpgradeMenuItem();
        this.setAlpha(0.001); // HACK;
    }

    sellWeapon () {
        console.log('sellWeapon()');
        this.money.add(this.weapon.constructor.getBuyPrice() * 0.75);
        this.weapon.destroy();
        this.weapon = null;
        this.upgradeMenu.close();
        this.setAlpha(1);
    }
}