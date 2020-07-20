
class CarConnection {
    constructor(car) {
        this.car = car;
    }
    
    setSpeedA(newSpeed) {
        this.car.diffSpeed.a = newSpeed;
    }
    setSpeedB(newSpeed) {
        this.car.diffSpeed.b = newSpeed;
    }
}

export default CarConnection;