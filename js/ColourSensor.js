import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';

class ColourSensor extends THREE.Object3D {
    constructor(car, mountPos, board, showSensor) {
        super();
        car.add(this);
        this.position.copy(mountPos);
        if (showSensor) {
            this.add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshLambertMaterial({ color: 'green' })));
        }
        this.car = car;
        this.board = board;
    }

    readRGB() {
        let currPos = new THREE.Vector3();
        this.getWorldPosition(currPos);
        return this.board.readRGB(currPos);
    }
}

export default ColourSensor;