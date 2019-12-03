import BaseWeapon from "./weapons/BaseWeapon";
import List from "./ui/List";

export default class WeaponSlot extends Phaser.GameObjects.Graphics {
    static weapons = [
        BaseWeapon
    ]
    constructor(scene, x, y, enemiesGroup, money) {
        super(scene, {x: x, y: y});
        this.enemies = enemiesGroup;
        this.weapon = null;
        this.money = money;
        this.setInteractive({ 
            hitArea: new Phaser.Geom.Circle(0, 0, 32),
            hitAreaCallback: Phaser.Geom.Circle.Contains,
            useHandCursor: true
        });

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
                title: 'Sell [not implemented]',
                enabled: false
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
        this.clear();
        this.fillStyle(0x555555, 1);
        this.lineStyle(2, 0xffffff, 1);
        this.fillCircle(0, 0, 32);
    }

    onOver() {
        this.clear();
        this.fillStyle(0x888888, 1);
        this.lineStyle(2, 0xffffff, 1);
        this.fillCircle(0, 0, 32);
    }

    onOut() {       
        this.clear();
        this.fillStyle(0x111111, 1);
        this.lineStyle(2, 0xffffff, 1);
        this.fillCircle(0, 0, 32);
    }

    update(time, delta) {

    }

    onWeaponSelected(item) {
        switch (item.key) {
            case 'WEAPON_LIGHT':
                this.setWeapon()
                break;
            default:
                console.log('Invalid weapon');
                break;
        }
        this.weaponMenu.close();
    }

    onUpgradeWeapon () {
        this.weapon.upgrade(this.money);
        this.updateUpgradeMenuItem();
        // this.upgradeMenu.close();
    }

    setWeapon () {
        console.log('setWeapon()');
        this.money.use(BaseWeapon.getBuyPrice());
        this.weapon = this.scene.add.existing(new BaseWeapon(this.scene, this.x, this.y, this.enemies));
        this.updateUpgradeMenuItem();
    }
}