export default class Money {
    constructor(scene, startMoney = 1000) {
        this.scene = scene;
        this.money = startMoney;
        this.events = this.scene.events;
    }

    getMoney() {
        return this.money;
    }

    add(amount) {
        this.money += amount;
        this.events.emit('moneyAdded', this.money, amount);
    }

    use(amount) {
        if (amount > this.money) {
            return false;
        } else {
            this.money -= amount;
            this.events.emit('moneyUsed', this.money, amount);
            return true;
        }
    }
}