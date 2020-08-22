import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js';

class Road extends THREE.Object3D {
    constructor(scene, position, loadingManager) {
        super();

        var loader = new GLTFLoader(loadingManager);
        loader.load('models/roads/straightRoad.glb', (object) => {
            scene.add(object.scene);
            object.scene.position.copy(position);
            this.road = object.scene;
        });
    }
}

export default Road;