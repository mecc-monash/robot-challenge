
let update_time = 5000; // ms
// let hrs = min = sec = mil = dt = ps = pt = tt = t = 0;

class Stopwatch {
    constructor(div_id) {
        this.display = document.getElementById(div_id);
        this.update = this.update.bind(this)
        this.running = false;
    }

    update() {
        if (this.running) {
            this.t = performance.now() * 0.001;
            this.dt += this.t - this.pt;
            this.pt = this.t;
            this.tt = Math.floor(this.dt);
            let mil = this.dt - this.tt;
            // MIL.textContent = (mil).toFixed(3).slice(-3);
            let sec = this.tt%60;
            // if ( sec == this.ps ) return;
            this.ps  = sec;
            let min = Math.floor(this.tt/60)%60;
            let hrs = Math.floor(this.tt/3600);
            // HRS.textContent = ('0'+hrs).slice(-2);
            // MIN.textContent = ('0'+min).slice(-2);
            // SEC.textContent = ('0'+sec).slice(-2);
            let timeString = 'Time: ' + ('0'+min).slice(-2) + ':' + ('0'+sec).slice(-2) + '.' + (mil).toFixed(3).slice(-3);
            
            this.display.textContent = timeString;
        }
    }

    start() {
        if (!this.running) {
            this.t = this.pt = performance.now() * 0.001;
        }
        this.running = true;   
    }

    stop() {
        this.running = false;
    }

    reset() {
        this.dt = this.ps = 0;
        let timeString = 'Time: 00:00:00';
        this.display.textContent = timeString;
    }
}

export default Stopwatch