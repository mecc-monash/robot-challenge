import * as THREE from 'https://unpkg.com/three/build/three.module.js';

let BOARD_SIZE = {
    width: 30,
    divisions: 6,
};

export default class Board {
    constructor(scene) {
        let floorCover = new THREE.MeshBasicMaterial({ color: 0x999999 });
        let meshFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(BOARD_SIZE.width, BOARD_SIZE.width, 10, 10),
            floorCover
        );
        meshFloor.position.set(BOARD_SIZE.width / 2, 0, BOARD_SIZE.width / 2);
        meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
        meshFloor.receiveShadow = true;
        scene.add(meshFloor);

        // Grid
        let grid = new THREE.GridHelper(BOARD_SIZE.width, BOARD_SIZE.divisions, 0x333333, 0x333333);
        grid.material.opacity = 0.9;
        grid.material.transparent = true;
        grid.position.set(BOARD_SIZE.width / 2, 0, BOARD_SIZE.width / 2);
        scene.add(grid);

        // Goal tile
        const tileWidth = BOARD_SIZE.width / BOARD_SIZE.divisions;
        var geometry = new THREE.PlaneGeometry(tileWidth, tileWidth, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0xff3019, side: THREE.DoubleSide });
        var plane = new THREE.Mesh(geometry, material);
        plane.rotation.x -= Math.PI / 2;
        plane.position.y += 0.01;
        plane.visible = false;
        this.plane = plane;
        scene.add(plane);
    }

    setGoal(x, y) {
        this.goal = { x: x, y: y };
        const tileWidth = BOARD_SIZE.width / BOARD_SIZE.divisions;
        this.plane.position.set((x + 0.5) * tileWidth, 0.01, (y + 0.5) * tileWidth);
        this.plane.visible = true;
    }

    update(playerPos) {
        if (this.overlapsGoal(playerPos)) {
            this.plane.material.color.setHex(0x0CE112);
        } else {
            this.plane.material.color.setHex(0xff3019);
        }
    }

    overlapsGoal(corners) {
        return corners.every(point => {
            const tileWidth = BOARD_SIZE.width / BOARD_SIZE.divisions;
            const leftBound = this.plane.position.x - tileWidth / 2;
            const rightBound = leftBound + tileWidth;
            const topBound = this.plane.position.z - tileWidth / 2;
            const bottomBound = topBound + tileWidth;
            if (point.x > leftBound && point.x < rightBound && point.z > topBound && point.z < bottomBound) {
                return true;
            } 
            return false;
        })
    }
}
