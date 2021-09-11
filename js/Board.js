import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';

// The board is contains the grid that makes up the ground and the roads.
// It is responsible for calculating colour values to read by the colour sensor.
export default class Board {
    constructor(scene,width, divisions, goalFunction) {
        this.roads = [];
        this.obstacles = [];
        this.raycaster = new THREE.Raycaster();
        this.goalReached = false;
        this.goalFunction = goalFunction;
        this.scene = scene;
        this.width = width;
        this.divisions = divisions;
        this.wall_Thickness = 0.5;
        // Grey board
        let floorCover = new THREE.MeshBasicMaterial({ color: 0x999999 });
        let meshFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(this.width, this.width, 10, 10),
            floorCover
        );
        meshFloor.position.set(this .width / 2, 0, this .width / 2);
        meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
        meshFloor.receiveShadow = true;
        meshFloor.matrixAutoUpdate = false; // Disable auto-updating, as we know the state will not change
        meshFloor.updateMatrix();
        scene.add(meshFloor);

        // Grid
        let grid = new THREE.GridHelper(this .width, this .divisions, 0x333333, 0x333333);
        grid.material.opacity = 0.9;
        grid.material.transparent = true;
        grid.position.set(this .width / 2, 0.01, this .width / 2);
        scene.add(grid);

        // Goal tile
        const tileWidth = this .width / this .divisions;
        var geometry = new THREE.PlaneGeometry(tileWidth, tileWidth, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0xff3019, side: THREE.DoubleSide });
        var plane = new THREE.Mesh(geometry, material);
        plane.rotation.x -= Math.PI / 2;
        plane.position.y += 0.01;
        plane.visible = false;
        this.plane = plane;
        scene.add(plane);
    }

    addRoad(road) {
        this.roads.push(road);
    }

    addObstacle(xPos, yPos, xSize, ySize) {
        var geometry = new THREE.BoxGeometry(xSize, 1.5, ySize);
        var material = new THREE.MeshPhongMaterial({ color: 0x111111, wireframe: false });
        var cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
        this.obstacles.push(cube);
        this.obstacles[this.obstacles.length-1].position.x = xPos;
        this.obstacles[this.obstacles.length-1].position.y = 0.75;
        this.obstacles[this.obstacles.length-1].position.z = yPos;
    }

    startCollision() {
        this.obstacles.forEach(mesh => {
           mesh.material.color.setHex(0x8c0000);
        });
    }
    endCollision() {
        this.obstacles.forEach(mesh => {
           mesh.material.color.setHex(0x111111);
        });
    }

    addModel(model){
        this.obstacles = model.children;
    }

    setGoal(x, y) {
        this.goal = { x: x, y: y };
        const tileWidth = this .width / this .divisions;
        this.plane.position.set((x + 0.5) * tileWidth, 0.01, (y + 0.5) * tileWidth);
        this.plane.visible = true;
    }

    update(playerPos) {
        if (this.overlapsGoal(playerPos)) {
            if (!this.goalReached) {
                this.plane.material.color.setHex(0x0CE112);
                this.goalReached = true;
                this.goalFunction()
            }
        } else {
            if (this.goalReached) {
                this.plane.material.color.setHex(0xff3019);
                this.goalReached = false;
            }
        }
    }

    overlapsGoal(corners) {
        // checks the array of 3D points for overlap with the goal tile
        return corners.every(point => {
            const tileWidth = this .width / this .divisions;
            const leftBound = this.plane.position.x - tileWidth / 2;
            const rightBound = leftBound + tileWidth;
            const topBound = this.plane.position.z - tileWidth / 2;
            const bottomBound = topBound + tileWidth;
            if (point.x > leftBound && point.x < rightBound && point.z > topBound && point.z < bottomBound) {
                return true;
            }
            return false;
        });
    }

    readRGB(pos) {
        let rgb = { r: 123, g: 123, b: 123 }; // grey colour of board
        if (this.overlapsGoal([pos])) {
            if (this.goalReached) {
                return { r: 0, g: 255, b: 0 }; // red goal tile
            } else {
                return { r: 255, g: 0, b: 0 }; // green goal reached tile
            }
        }

        // Check for overlap with roads and road lines
        this.roads.forEach(road => {
            // Cast a ray from the colour sensor to the children of the road object.
            // Raycasting in the upward direction seems to pick out the road lines. 
            // Most likely the road lines are slightly above the colour sensor.
            const upwards = new THREE.Vector3(0, 1, 0);
            this.raycaster.set(pos, upwards, 0, 0.1);
            const roadChildren = road?.road?.children[0].children;
            if (roadChildren) {
                const intersects = this.raycaster.intersectObjects(roadChildren);
                if (intersects.length > 0) {
                    const color = intersects[0].object.material.color; // the first intersection is the closest to the sensor
                    const color255 = { r: color.r * 255, g: color.g * 255, b: color.b * 255 };
                    rgb = color255;
                }
            }
        });

        return rgb;
    }

    addWalls(){
        this.addObstacle(0, this.width/2, this.wall_Thickness, this.width);
        this.addObstacle(this.width, this.width/2, this.wall_Thickness, this.width);
        this.addObstacle(this.width/2, 0, this.width, this.wall_Thickness);
        this.addObstacle(this.width/2, this.width, this.width, this.wall_Thickness);
    }
}
