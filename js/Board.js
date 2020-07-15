import * as THREE from 'https://unpkg.com/three/build/three.module.js';

let BOARD_SIZE = {
    length: 30,
    width: 30,
};

export default class Board {
    constructor(scene) {
        let floorCover = new THREE.MeshBasicMaterial({ color: 0x999999 });
        let meshFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(BOARD_SIZE.width, BOARD_SIZE.length, 10, 10),
            floorCover
        );
        meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
        meshFloor.receiveShadow = true;
        scene.add(meshFloor);

        // Grid
        let grid = new THREE.GridHelper(30, 6, 0x333333, 0x333333);
        grid.material.opacity = 0.9;
        grid.material.transparent = true;
        scene.add(grid);
    }


}