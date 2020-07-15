import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/MTLLoader.js';

var player = {
    height: 1.8,
    speed: 0.2,
    turnSpeed: Math.PI * 0.05,
};

export default class Car {
    constructor(scene) {
        // Load car model and materials
        this.car = new THREE.Group();
        var mtlLoader = new MTLLoader();
        mtlLoader.load('models/cars/taxi.mtl', (materials) => {
            materials.preload();
            var loader = new OBJLoader();
            loader.setMaterials(materials);

            loader.load('models/cars/taxi.obj', (object) => {
                object.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                this.car.add(object);
            });

            scene.add(this.car);
        });
    }

    setSpeedA(speed) {

    }

    setSpeedB(speed) {

    }

    update(keyboard) {
        // RHS Keyboard movement inputs
        if (keyboard[75]) { // K key
            this.car.position.x -= Math.sin(this.car.rotation.y) * player.speed;
            this.car.position.z -= Math.cos(this.car.rotation.y) * player.speed;
        }
        if (keyboard[73]) { // I key
            this.car.position.x += Math.sin(this.car.rotation.y) * player.speed;
            this.car.position.z += Math.cos(this.car.rotation.y) * player.speed;
        }
        if (keyboard[74]) { // J key
            this.car.rotation.y += player.turnSpeed;
        }
        if (keyboard[76]) { // L key
            this.car.rotation.y -= player.turnSpeed;
        }
    }
}