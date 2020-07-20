
class Micro {
    constructor(car) {
        this.car = car;
        this.startTime = Date.now();
    }

    setup() {
        this.car.setSpeedA(200);
        this.car.setSpeedB(200);
        setTimeout(() => this.car.setSpeedA(250), 1600);
        setTimeout(() => {
            this.car.setSpeedA(0);
            this.car.setSpeedB(0);
        }, 11500);
    }

    loop() {
    }

    millis() {
        let elapsedTime = Date.now() - this.startTime;
        return elapsedTime;
    }
}

export default Micro;