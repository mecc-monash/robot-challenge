
class CarConnection {
    constructor(car) {
        this.car = car;
    }
    
    setSpeedA(newSpeed) {
        this.car.diffSpeed.a = newSpeed + Math.floor(Math.random() * 31);
    }
    setSpeedB(newSpeed) {
        this.car.diffSpeed.b = newSpeed + Math.floor(Math.random() * 31);;
    }
}

export default CarConnection;
