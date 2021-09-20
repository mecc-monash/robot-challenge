
class CarConnection {
    constructor(car) {
        this.car = car;
        this.scaling = 0.5; // max possible percentage of input added to randomness
        this.max_speed = 800;
    }
    
    // only set clamp if input speed exceeds max threshold
    clamp(speed){
        if (speed >= 0){
            return (speed >= this.max_speed) ? this.max_speed : speed;
        }
        else {
            return (speed < -this.max_speed) ? -this.max_speed : speed;
        }
    }

    setSpeedA(newSpeed) {
        if (newSpeed) {
            var driveSpeed = this.clamp(newSpeed);
            this.car.diffSpeed.a = driveSpeed + Math.floor(Math.random() * this.scaling*driveSpeed);
        }
    }
    setSpeedB(newSpeed) {
        if (newSpeed){
            var driveSpeed = this.clamp(newSpeed);
            this.car.diffSpeed.b = driveSpeed + Math.floor(Math.random() * this.scaling*driveSpeed);
        }
    }
}

export default CarConnection;
