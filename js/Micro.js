
// Your code goes in the setup and loop functions
// You can also create other functions to help you organise your code
class Micro {
    constructor(carConn) {
        this.car = carConn;
        this.startTime = Date.now();
    }

    setup() {
        // Your code goes here
        this.car.setSpeedA(200);
        this.car.setSpeedB(200);
        setTimeout(() => this.car.setSpeedA(250), 1600);
        setTimeout(() => {
            this.car.setSpeedA(0);
            this.car.setSpeedB(0);
        }, 11500);
    }

    loop() {
        // And here
    }

    millis() {
        let elapsedTime = Date.now() - this.startTime;
        return elapsedTime;
    }
}

export default Micro;