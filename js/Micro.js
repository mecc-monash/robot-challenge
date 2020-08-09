
// Your code goes in the setup and loop functions
// You can also create other functions to help you organise your code
class Micro {
    constructor(carConn) {
        this.car = carConn;
        this.startTime = Date.now();
        this.colourSensors = [];
        this.ultrasonicSensors = [];
    }

    addColourSensor(sensor) {
        this.colourSensors.push(sensor);
    }

    addUltrasonicSensor(sensor) {
        this.ultrasonicSensors.push(sensor);
    }

    setup() {
        // Your code goes here. This function will be run once 
        this.car.setSpeedA(560);
        this.car.setSpeedB(460);
    }

    loop() {
        // Your code goes here. This function will be run over and over again
        let rgb = this.colourSensors[0]?.readRGB();
        let distance = this.ultrasonicSensors[0]?.detectForwards();
        if (rgb.g > 128) {
            this.car.setSpeedA(0);
            this.car.setSpeedB(0);
        }
        console.log(rgb)
        console.log(distance);
    }

    millis() {
        let elapsedTime = Date.now() - this.startTime;
        return elapsedTime;
    }

    reset() {
        this.startTime = Date.now();
        this.setup();
    }
}

export default Micro;