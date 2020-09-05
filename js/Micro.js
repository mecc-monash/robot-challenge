let stop, forward_distance, side_distance

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
        stop = false; 
        forward_distance = 15;
        side_distance = 5;
    }

    loop() {
        // Your code goes here. This function will be run over and over again

        // when goal is reached, set speed to 0
        let rgb = this.colourSensors[0]?.readRGB();
        
        // 1) how to instantiate ultrasonics on the car 
        let forward = this.ultrasonicSensors[0]?.detectForwards();
        let right = this.ultrasonicSensors[0]?.detectRight();
        let left = this.ultrasonicSensors[0]?.detectLeft();

        // 2) get them to console log values to see how it works and what values it spits out 
        //console.log(forward);

        // 3) try using just the ultrasonic sensor to drive around
        
        // if there is something in front of the car, turn depending on which wall is closer 
        if (forward < forward_distance && (left>right)){
            this.drive(600,300)
        }

        if (forward < forward_distance && (left<right)){
            this.drive(300,600)
        }

        // if theres nothing in front of the car and walls are more than 5 units away, drive forward
        if (forward > forward_distance && right > side_distance && left > side_distance ){
            this.drive(600,600)
        } // if not drive more to the right
        else if (forward > forward_distance && right < side_distance){
            this.drive(600,300)
        }// if not drive more to the left
        else if (forward > forward_distance && left < side_distance){
            this.drive(300,600)
        }
       
        if (rgb.g > 128 && rgb.r < 10 && rgb.b < 10){
            stop = true;
        }

        if (stop){
            this.car.setSpeedA(0);
            this.car.setSpeedB(0);
        }
    }
    
    drive(Right,Left) {
        this.car.setSpeedA(Right); 
        this.car.setSpeedB(Left); 
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