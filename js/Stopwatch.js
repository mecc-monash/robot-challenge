
let update_time = 100;
class Stopwatch {
    constructor(div_id) {
        this.stopped = false;
        this.elapsed = 0;
        this.div_id = div_id;
        this.render()
    }

    update() {
        this.elapsed += update_time;
        this.render()
    }

    start() {
        // this.stopped = false;
        if (!this.interval) {
            this.interval = setInterval(this.update.bind(this), update_time);
        }
    }

    stop() {
        // this.stopped = true;
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = null;
        }
    }

    reset() {
        this.elapsed = 0;
        this.render()
    }

    render() {
        let h = ((this.elapsed / 1000) / 60) / 60
        document.getElementById(this.div_id).innerHTML = 'Time: ' + this.elapsed/100;
    }
}

export default Stopwatch