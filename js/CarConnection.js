
class CarConnection {
    constructor(car) {
        this.car = car;
    }

    setSpeedA(newSpeed) {
        if (newSpeed === 0) {
            this.car.diffSpeed.a = 0; // don't add randomisation for zero speed
        } else {
            this.car.diffSpeed.a = newSpeed + Math.floor(Math.random() * 31);
        }
    }
    setSpeedB(newSpeed) {
        if (newSpeed === 0) {
            this.car.diffSpeed.b = 0; // don't add randomisation for zero speed
        } else {
            this.car.diffSpeed.b = newSpeed + Math.floor(Math.random() * 31);
        }
    }
}

export default CarConnection;
