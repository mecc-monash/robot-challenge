
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
    }

    loop() {
        // Your code goes here. This function will be run over and over again
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