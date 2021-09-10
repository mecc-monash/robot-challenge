import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/OBJLoader.js';


class Maze extends THREE.Object3D {
    constructor(scene, position, loadingManager) {
        super();

        const modelPath = 'models/maze/Maze.obj';

        this.initialPos = position;
        this.maze = new THREE.Group();

        var loader = new OBJLoader(loadingManager);
        var material = new THREE.MeshPhongMaterial({ color: 0x111111, wireframe: false });
        
        loader.load(modelPath, (object) => {
            for (let i = 0; i < object.children.length; i++) {
                        
                var mesh = new THREE.Mesh(object.children[i].geometry, material);
                mesh.scale.set(0.1, 0.1, 0.1);
                mesh.position.copy(this.initialPos);
                var rotOffset = -Math.PI/2
                mesh.rotation.set(rotOffset,0,0);
                scene.add(mesh);
                this.children[i] = mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
            }
        });
    }
}

export default Maze;