import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/MTLLoader.js';

let carProperties = {
    accelRate: 20,
    turnSpeed: Math.PI * 0.5,
    friction: 0.05,
    diffSpeedScaleFactor: 0.01,
    rotateSpeedScaleFactor: 0.01,
};

export default class Car extends THREE.Object3D {
    constructor(scene, loadingManager, initialPos = new THREE.Vector3(7.5, 0, 7.5), carRotation = new THREE.Euler(0, 0, 0)) {
        super();

        scene.add(this);
        this.cornerMarkers = [];
        for (let i = 0; i < 4; i++) {
            this.cornerMarkers.push(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshLambertMaterial({ color: 'green' })));
            // scene.add(this.cornerMarkers[this.cornerMarkers.length - 1]);
        }

        this.speed = 0;
        this.diffSpeed = { a: 0, b: 0 };
        this.initialPos = initialPos;
        this.initialRotation = carRotation;

        // Load car model and materials
        this.carObj = new THREE.Group();
        this.size = new THREE.Vector3();
        var mtlLoader = new MTLLoader(loadingManager);
        mtlLoader.load('models/cars/taxi.mtl', (materials) => {
            materials.preload();
            var loader = new OBJLoader(loadingManager);
            loader.setMaterials(materials);

            loader.load('models/cars/taxi.obj', (object) => {
                // Get size of main geometry for use in collision detection
                let mainGeometry = object.children[0].geometry;
                mainGeometry.computeBoundingBox();
                mainGeometry.boundingBox.getSize(this.size);

                // Enable shadows for each of the children meshes
                object.traverse(child => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                this.carObj = object;
                scene.add(this);
                this.add(this.carObj);
                this.position.copy(this.initialPos);

                if (carRotation) {
                    this.setRotationFromEuler(this.initialRotation);
                }
            });
        });
    }

    update(keyboard, delta) {
        // arrow-key / RHS keyboard movement inputs
        // Accelerate
        if (keyboard[38] || keyboard[87] || keyboard[73]) { // up arrow / W key / I key
            this.speed += carProperties.accelRate * delta;
        }
        // Decelerate
        if (keyboard[40] || keyboard[83] || keyboard[75]) { // down arrow / S key / K key
            this.speed -= carProperties.accelRate * delta;
        }
        // Turn anticlockwise
        if (keyboard[37] || keyboard[65] || keyboard[74]) { // left arrow / A key / J key
            this.rotation.y += carProperties.turnSpeed * delta;
        }
        // Turn clockwise
        if (keyboard[39] || keyboard[68] || keyboard[76]) { // right arrow / D key / L key
            this.rotation.y -= carProperties.turnSpeed * delta;
        }

        // Differential steering approximation
        if (this.diffSpeed.a !== 0 && this.diffSpeed.b !== 0) {
            this.rotation.y += carProperties.rotateSpeedScaleFactor * (this.diffSpeed.a -  this.diffSpeed.b) / 180;
            this.speed = carProperties.diffSpeedScaleFactor * (this.diffSpeed.a + this.diffSpeed.b) / 2;
        }

        // Integrate velocity
        this.position.x += Math.sin(this.rotation.y) * this.speed * delta;
        this.position.z += Math.cos(this.rotation.y) * this.speed * delta;

        this.speed *= (1 - carProperties.friction);

    }

    corners() {
        let corners = [
            new THREE.Vector3(-this.size.x / 2, 0, -this.size.z / 2),
            new THREE.Vector3(this.size.x / 2, 0, -this.size.z / 2),
            new THREE.Vector3(this.size.x / 2, 0, this.size.z / 2),
            new THREE.Vector3(-this.size.x / 2, 0, this.size.z / 2),
        ];

        // transform corners to world coordinate from
        corners.forEach((point, index) => {
            point.applyMatrix4(this.carObj.matrixWorld);
            this.cornerMarkers[index].position.copy(point)
        });

        return corners;
    }

    reset() {
        // Reset position and velocity
        this.position.copy(this.initialPos);
        this.diffSpeed = { a: 0, b: 0 };
        this.setRotationFromEuler(this.initialRotation);
        this.updateMatrixWorld();
    }
}