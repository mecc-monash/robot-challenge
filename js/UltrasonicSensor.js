import * as THREE from 'https://unpkg.com/three/build/three.module.js';
var raycaster = new THREE.Raycaster();


class UltrasonicSensor extends THREE.Object3D {
    constructor(car, mountPos, board, scene) {
        super();
        car.add(this);
        this.position.copy(car.position);
        this.add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshLambertMaterial({ color: 'green' })));
        this.car = car;
        this.board = board;
        this.scene = scene;
    }

    detectForwards() {
        let dist = 100;
        let currPos = new THREE.Vector3();
        this.getWorldPosition(currPos);

        let from = new THREE.Vector3(currPos.x,1,currPos.z);
        let direction = new THREE.Vector3(0,0,1).applyAxisAngle(new THREE.Vector3(0,1,0), this.car.rotation.y);

        raycaster.set(from, direction);
            
        //console.log(from);
        //console.log(direction);
        // -----------------visualise raycast----------------
        // let to = new THREE.Vector3(currPos.x,1,currPos.z).add(new THREE.Vector3(0,0,10).applyAxisAngle(new THREE.Vector3(0,1,0),  this.car.rotation.y));
        // //to = from.add(direction);
        // //console.log(to);
        // var material = new THREE.LineBasicMaterial({ color: 0xFF0000 });
        // var geometry = new THREE.Geometry();

        // geometry.vertices.push(from);
        // geometry.vertices.push(to);

        // let line = new THREE.Line( geometry, material );
        // this.scene.add(line);
        // -------------------------------------------------------
        
        var raycast = raycaster.intersectObjects(this.board.obstacles);
        if (raycast.length)
        {
            dist = raycast[0].distance;
        }
        return dist;
    }

    detectLeft() {
        let dist = 100;
        let currPos = new THREE.Vector3();
        this.getWorldPosition(currPos);

        let from = new THREE.Vector3(currPos.x,1,currPos.z);
        let direction = new THREE.Vector3(1,0,0).applyAxisAngle(new THREE.Vector3(0,1,0), this.car.rotation.y);

        raycaster.set(from, direction);
        
        var raycast = raycaster.intersectObjects(this.board.obstacles);
        if (raycast.length)
        {
            dist = raycast[0].distance;
        }
        return dist;
    }

    detectRight() {
        let dist = 100;
        let currPos = new THREE.Vector3();
        this.getWorldPosition(currPos);

        let from = new THREE.Vector3(currPos.x,1,currPos.z);
        let direction = new THREE.Vector3(-1,0,0).applyAxisAngle(new THREE.Vector3(0,1,0), this.car.rotation.y);

        raycaster.set(from, direction);
        
        var raycast = raycaster.intersectObjects(this.board.obstacles);
        if (raycast.length)
        {
            dist = raycast[0].distance;
        }
        return dist;
    }

    detectBackwards() {
        let dist = 100;
        let currPos = new THREE.Vector3();
        this.getWorldPosition(currPos);

        let from = new THREE.Vector3(currPos.x,1,currPos.z);
        let direction = new THREE.Vector3(0,0,-1).applyAxisAngle(new THREE.Vector3(0,1,0), this.car.rotation.y);

        raycaster.set(from, direction);
        
        var raycast = raycaster.intersectObjects(this.board.obstacles);
        if (raycast.length)
        {
            dist = raycast[0].distance;
        }
        return dist;
    }

    
}

export default UltrasonicSensor;