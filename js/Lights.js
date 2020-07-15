import * as THREE from 'https://unpkg.com/three/build/three.module.js';

export default class Lights {
    constructor(scene) {
        // let ambientLight = new THREE.AmbientLight();
        // scene.add(ambientLight);
        let light = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
        light.position.set(0, 200, 0);
        scene.add(light);

        // light = new THREE.DirectionalLight(0xffffff, 0.5);
        // light.position.set(0, 200, 100);
        // light.castShadow = true;
        // light.shadow.camera.top = 180;
        // light.shadow.camera.bottom = - 100;
        // light.shadow.camera.left = - 120;
        // light.shadow.camera.right = 120;
        // scene.add(light);
    }
}
