import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/MTLLoader.js';

let carProperties = {
    accelRate: 60,
    turnSpeed: Math.PI * 5,
    friction: 0.05,
    diffSpeedScaleFactor: 0.01,
    rotateSpeedScaleFactor: 0.01,
};

export default class Car extends THREE.Object3D {
    constructor(scene) {
        super();
        this.speed = 0;
        this.diffSpeed = { a: 0, b: 0 };
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
                        // let bbox = new THREE.BoxHelper(child);
                        // scene.add(bbox)
                    }
                });
                let boundingBox = new THREE.BoxHelper(object);
                scene.add(boundingBox)
                this.car = object;
                scene.add(this.car);
            });
        });
    }

    setSpeedA(newSpeed) {
        this.diffSpeed.a = newSpeed;
    }
    setSpeedB(newSpeed) {
        this.diffSpeed.b = newSpeed;
    }

    update(keyboard, delta) {
        // RHS Keyboard movement inputs
        // Accelerate
        if (keyboard[75]) { // K key
            this.speed -= carProperties.accelRate * delta;
        }
        // Decelerate
        if (keyboard[73]) { // I key
            this.speed += carProperties.accelRate * delta;
        }
        // Turn anticlockwise
        if (keyboard[74]) { // J key
            this.car.rotation.y += carProperties.turnSpeed * delta;
        }
        // Turn clockwise
        if (keyboard[76]) { // L key
            this.car.rotation.y -= carProperties.turnSpeed * delta;
        }

        // Differential steering approximation
        if (this.diffSpeed.a !== 0 && this.diffSpeed.b !== 0) {
            this.car.rotation.y += carProperties.rotateSpeedScaleFactor * this.diffSpeed.a / this.diffSpeed.b;
            this.speed = carProperties.diffSpeedScaleFactor * (this.diffSpeed.a + this.diffSpeed.b)/2;
        }

        // Integrate velocity
        this.car.position.x += Math.sin(this.car.rotation.y) * this.speed * delta;
        this.car.position.z += Math.cos(this.car.rotation.y) * this.speed * delta;

        this.speed *= (1 - carProperties.friction);
    }
}