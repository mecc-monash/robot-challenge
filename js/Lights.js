import * as THREE from 'https://unpkg.com/three/build/three.module.js';

export default class Lights {
    constructor(scene) {
        let light = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
        light.position.set(0, 200, 0);
        scene.add(light);

        light = new THREE.DirectionalLight(0xffffff, 0.2);
        light.position.set(40, 40, 40);
        light.castShadow = true;
        // Following parameters can be used to fine-tune the shadows
        // light.shadow.camera.top = 180;
        // light.shadow.camera.bottom = - 100;
        // light.shadow.camera.left = - 120;
        // light.shadow.camera.right = 120;
        scene.add(light);

        light = new THREE.DirectionalLight(0xffffff, 0.2);
        light.position.set(-40, 40, -40);
        light.castShadow = true;
        scene.add(light);

        // Uncomment the helper to see the position and direction of the light
        // var helper = new THREE.DirectionalLightHelper(light, 5);
        // scene.add(helper);
    }
}
