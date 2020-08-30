import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js';

class Road extends THREE.Object3D {
    constructor(scene, position, loadingManager, useRacetrack) {
        super();

        const modelPath = useRacetrack ? 'models/roads/raceTrack.glb' : 'models/roads/straightRoad.glb';

        var loader = new GLTFLoader(loadingManager);
        loader.load(modelPath, (object) => {
            scene.add(object.scene);
            object.scene.position.copy(position);
            this.road = object.scene;
        });
    }
}

export default Road;