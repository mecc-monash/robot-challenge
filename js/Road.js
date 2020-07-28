import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';

class Road extends THREE.Object3D {
    constructor(scene) {
        super();

        let initialPos = new THREE.Vector3(9, 0, 22.5);
        var loader = new GLTFLoader();
        loader.load('models/roads/straightRoad.glb', (object) => {
            scene.add(object.scene);
            object.scene.position.copy(initialPos);
        });
    }
}

export default Road;