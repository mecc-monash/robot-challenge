import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';
import Car from './Car.js';
import Board from './Board.js';
import Lights from './Lights.js';
import Micro from './Micro.js';
import CarConnection from './CarConnection.js';
import ColourSensor from './ColourSensor.js';
import UltrasonicSensor from './UltrasonicSensor.js';
import Road from './Road.js';

let scene, camera, renderer, lights, car, board, clock;
let keyboard = {}, keyboardControlsEnabled;
let micro, carConn, colourSensor, ultrasonicSensor, road;
let paused = false;
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

let INV_MAX_FPS = 1 / 60;
let frameDelta = 0;

const levelCount = 2;

init();
animate();

function init() {
    initThreeJS();
    initWorld();
}

function animate() {
    frameDelta += clock.getDelta();
    while (frameDelta >= INV_MAX_FPS) {
        update(INV_MAX_FPS);
        frameDelta -= INV_MAX_FPS;
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function initThreeJS() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x232323);
    // scene.add(new THREE.AxesHelper(10));
    camera = new THREE.PerspectiveCamera(400, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 1000);
    camera.position.set(41, 11, 41);

    clock = new THREE.Clock();

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Controls
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = 0.95 * Math.PI / 2;
    controls.enableZoom = true;
    controls.target = new THREE.Vector3(15, 0, 15);
    controls.update();

    // GUI
    let Params = function () {
        this.bgColour = '#232323';
        this.keyboardControls = true;
    };
    let text = new Params();
    let gui = new dat.GUI();
    let bgController = gui.addColor(text, 'bgColour');
    bgController.onChange(value => scene.background = new THREE.Color(value));
    keyboardControlsEnabled = gui.add(text, 'keyboardControls');
    keyboardControlsEnabled.onChange(value => {
        if (value) {
            carConn.setSpeedA(0);
            carConn.setSpeedB(0);
        }
    });

    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    document.getElementById('incLevelButton').addEventListener('click', incrementLevel);
    document.getElementById('decLevelButton').addEventListener('click', decrementLevel);
}

function initWorld() {
    road = new Road(scene);
    board = new Board(scene);
    board.setGoal(4, 4);
    board.addRoad(road);
    board.addObstacle(0, 0);
    lights = new Lights(scene);
    car = new Car(scene);
    carConn = new CarConnection(car);
    colourSensor = new ColourSensor(car, new THREE.Vector3(1.125 / 2, 0, 2.025 / 2), board);
    ultrasonicSensor = new UltrasonicSensor(car, new THREE.Vector3(1.125 / 2, 0, 2.025 / 2), board, scene);
    micro = new Micro(carConn);
    micro.addColourSensor(colourSensor);
    micro.addUltrasonicSensor(ultrasonicSensor);
    micro.setup();

}

function update(delta) {
    if (paused) {
        return;
    }
    car.update(keyboard, delta);
    micro.loop();
    board.update(car.corners());
}

function keyDown(event) {
    if (keyboardControlsEnabled?.getValue()) {
        keyboard[event.keyCode] = true;
    }
    if (event.keyCode === 82) { // r key pressed 
        if (!paused) {
            resetWorld();
        }
    } else if (event.keyCode === 80) { // p key pressed
        paused = !paused;
        document.getElementById('menu-overlay').style.display = paused ? 'flex' : 'none';
    }
}

function resetWorld() {
    car.reset();
    micro.reset();
}

function keyUp(event) {
    keyboard[event.keyCode] = false;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let proposedLevel = 1;
function incrementLevel() {
    if (proposedLevel < levelCount) {
        proposedLevel++;
        const levelSelect = document.getElementById('level-select-value');
        levelSelect.innerHTML = proposedLevel;
    }
}
function decrementLevel() {
    if (proposedLevel - 1 > 0) {
        proposedLevel--;
        const levelSelect = document.getElementById('level-select-value');
        levelSelect.innerHTML = proposedLevel;
    }
}