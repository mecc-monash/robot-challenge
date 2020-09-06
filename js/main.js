import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js';
import Car from './Car.js';
import Board from './Board.js';
import Lights from './Lights.js';
import Micro from './Micro.js';
import CarConnection from './CarConnection.js';
import ColourSensor from './ColourSensor.js';
import UltrasonicSensor from './UltrasonicSensor.js';
import Road from './Road.js';
import Maze from './Maze.js';

let scene, camera, renderer, lights, car, board, clock;
let keyboard = {}, keyboardControlsEnabled;
let micro, carConn, colourSensor, ultrasonicSensor, road, maze;
let loadingManager;
let paused = false;
let gameOver = false;
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

const INV_MAX_FPS = 1 / 60;
let frameDelta = 0;

// Get level from localStorage if present
let currentLevel = localStorage.getItem('level') || 1;
const levelSelect = document.getElementById('level-select-value');
const levelSelect2 = document.getElementById('level-select-value-2');
levelSelect.innerHTML = levelSelect2.innerHTML = currentLevel;

const initWorldArray = [
    initWorld1, initWorld2, initWorld3, initWorld4, initWorld5
];
const levelCount = initWorldArray.length;

init();
animate();

function init() {
    initThreeJS();
    initWorld();
}

function animate() {
    update(INV_MAX_FPS);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function initThreeJS() {
    // Camera
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
    controls.enableKeys = false;
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

    // Loading manager
    loadingManager = new THREE.LoadingManager(); // keeps track of which models have finished downloading
    loadingManager.onLoad = hideLoadingScreen;

    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    document.getElementById('incLevelButton').addEventListener('click', incrementLevel);
    document.getElementById('decLevelButton').addEventListener('click', decrementLevel);
    document.getElementById('incLevelButton2').addEventListener('click', incrementLevel);
    document.getElementById('decLevelButton2').addEventListener('click', decrementLevel);
}

function hideLoadingScreen() {
    console.log("finished loading")
    document.getElementById('loading-screen').style.display = 'none';
}

function initWorld() {
    initWorldArray[currentLevel - 1]();
}

function initWorld1() { // goal square level
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x232323);
    // scene.add(new THREE.AxesHelper(10));
    board = new Board(scene, 30, 6);
    board.setGoal(4, 4);
    lights = new Lights(scene);
    car = new Car(scene, loadingManager);
    carConn = new CarConnection(car);
    micro = new Micro(carConn);
    const frontLeft = new THREE.Vector3(1.125 / 2, 0, 2.025 / 2);
    colourSensor = new ColourSensor(car, frontLeft, board);
    ultrasonicSensor = new UltrasonicSensor(car, board, scene);
    micro.addColourSensor(colourSensor);
    micro.addUltrasonicSensor(ultrasonicSensor);
    micro.setup();
}
function initWorld2() { // straight road level 
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x232323);
    // scene.add(new THREE.AxesHelper(10));
    const roadPos = new THREE.Vector3(9, 0, 22.5);
    road = new Road(scene, roadPos, loadingManager);
    board = new Board(scene, 30, 6);
    board.setGoal(4, 4);
    board.addRoad(road);
    lights = new Lights(scene);
    car = new Car(scene, loadingManager);
    carConn = new CarConnection(car);
    micro = new Micro(carConn);
    const frontLeft = new THREE.Vector3(1.125 / 2, 0, 2.025 / 2);
    colourSensor = new ColourSensor(car, frontLeft, board);
    ultrasonicSensor = new UltrasonicSensor(car, board, scene);
    micro.addColourSensor(colourSensor);
    micro.addUltrasonicSensor(ultrasonicSensor);
    micro.setup();
}
function initWorld3() { // racetrack level
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x232323);
    // scene.add(new THREE.AxesHelper(10));
    const roadPos = new THREE.Vector3(30, 0, 12.5);
    road = new Road(scene, roadPos, loadingManager, true);
    board = new Board(scene, 40, 8);
    // board.setGoal(5, 5); // no goal on this level
    board.addRoad(road);
    lights = new Lights(scene);
    car = new Car(scene, loadingManager);
    carConn = new CarConnection(car);
    micro = new Micro(carConn);
    const frontLeft = new THREE.Vector3(1.125 / 2, 0, 2.025 / 2);
    colourSensor = new ColourSensor(car, frontLeft, board);
    micro.addColourSensor(colourSensor);
    const frontRight = new THREE.Vector3(-1.125 / 2, 0, 2.025 / 2);
    colourSensor = new ColourSensor(car, frontRight, board);
    ultrasonicSensor = new UltrasonicSensor(car, board, scene);
    micro.addColourSensor(colourSensor);
    micro.addUltrasonicSensor(ultrasonicSensor);
    micro.setup();
}

// example ultrasonics level
function initWorld4() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x232323);
    // scene.add(new THREE.AxesHelper(10));
    const roadPos = new THREE.Vector3(18, 0, 22.5);
    road = new Road(scene, roadPos, loadingManager);
    board = new Board(scene, 30, 6);
    board.setGoal(4, 4);
    board.addRoad(road);
    board.addObstacle(27.5, 15, 3, 30);
    board.addObstacle(17.5, 12.5, 3, 10);

    lights = new Lights(scene);
    car = new Car(scene, loadingManager);
    carConn = new CarConnection(car);
    micro = new Micro(carConn);
    const frontLeft = new THREE.Vector3(1.125 / 2, 0, 2.025 / 2);
    colourSensor = new ColourSensor(car, frontLeft, board);
    micro.addColourSensor(colourSensor);
    ultrasonicSensor = new UltrasonicSensor(car, board, scene);
    micro.addUltrasonicSensor(ultrasonicSensor);
    micro.setup();
}

function initWorld5() { // maze level
    var wall_thickness = 0.5
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x232323);
    // scene.add(new THREE.AxesHelper(10));
    const roadPos = new THREE.Vector3(18, 0, 22.5);
    //road = new Road(scene, roadPos);
    board = new Board(scene,100,10);
    board.setGoal(6, 5);
    //board.addRoad(road);

    //board.addWalls();
    
    // MAZE
    /*
    board.addObstacle(5, 15, 10, wall_thickness);
    board.addObstacle(10, 25, wall_thickness, 20);
    board.addObstacle(10, 55, wall_thickness, 10);
    board.addObstacle(22.5, 50, 25, wall_thickness);
    board.addObstacle(10, 80, 20, wall_thickness);
    board.addObstacle(20, 75, wall_thickness, 20);
    board.addObstacle(30, 90, wall_thickness, 20);
    board.addObstacle(25, 10, 15, wall_thickness);
    board.addObstacle(25, 20, wall_thickness, 20);
    board.addObstacle(35, 45, wall_thickness, 20);
    board.addObstacle(52, 85, 16, wall_thickness);
    board.addObstacle(70, 80, 20, wall_thickness);
    board.addObstacle(60, 82.5,wall_thickness, 5);
    board.addObstacle(80, 90, wall_thickness,20);
    board.addObstacle(90, 45, 20, wall_thickness);
    board.addObstacle(85, 15, 30, wall_thickness);
    board.addObstacle(85, 30, wall_thickness,5);
    */
    const mazePos = new THREE.Vector3(50, 0, 50);

    maze = new Maze(scene, mazePos, loadingManager);
    board.addModel(maze);
    lights = new Lights(scene);
    car = new Car(scene, loadingManager);
    carConn = new CarConnection(car);
    micro = new Micro(carConn);
    const frontLeft = new THREE.Vector3(1.125 / 2, 0, 2.025 / 2);
    colourSensor = new ColourSensor(car, frontLeft, board);
    micro.addColourSensor(colourSensor);
    ultrasonicSensor = new UltrasonicSensor(car, board, scene);
    micro.addUltrasonicSensor(ultrasonicSensor);
    micro.setup();
}

function update(delta) {
    if (paused || gameOver) {
        return;
    }
    car.update(keyboard, delta);
    micro.loop();
    board.update(car.corners());

    if(micro.ultrasonicSensors[0]?.detectForwards() <= 1 ||
        micro.ultrasonicSensors[0]?.detectBackwards() <= 1 ||
        micro.ultrasonicSensors[0]?.detectLeft() <= 0.5 ||
        micro.ultrasonicSensors[0]?.detectRight() <= 0.5) {
        gameOver = true;
        document.getElementById('lose-menu').style.display = 'flex';
    }

}

function keyDown(event) {
    if (keyboardControlsEnabled?.getValue()) {
        keyboard[event.keyCode] = true;
    }
    if (event.keyCode === 82) { // r key pressed 
        resetWorld();
    }
    else if (event.keyCode === 80) { // p key pressed
        paused = !paused;
        document.getElementById('pause-menu').style.display = (paused && !gameOver) ? 'flex' : 'none';
    }
    else if (event.keyCode === 37) { // left arrow key pressed
        if (gameOver || paused) decrementLevel();
    } else if (event.keyCode === 39) { // right arrow key pressed
        if (gameOver || paused) incrementLevel();
    }
}

function resetWorld() {
    car.reset();
    micro.reset();
    paused = false;
    gameOver = false;
    document.getElementById('pause-menu').style.display = paused ? 'flex' : 'none';
    document.getElementById('lose-menu').style.display = 'none';
}

function keyUp(event) {
    keyboard[event.keyCode] = false;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function storeLevel() {
    localStorage.setItem('level', currentLevel);
}
function incrementLevel() {
    if (currentLevel < levelCount) {
        currentLevel++;
        const levelSelect = document.getElementById('level-select-value');
        const levelSelect2 = document.getElementById('level-select-value-2');
        levelSelect.innerHTML = levelSelect2.innerHTML = currentLevel;
        storeLevel();
    }
    initWorld();
}
function decrementLevel() {
    if (currentLevel - 1 > 0) {
        currentLevel--;
        const levelSelect = document.getElementById('level-select-value');
        const levelSelect2 = document.getElementById('level-select-value-2');
        levelSelect.innerHTML = levelSelect2.innerHTML = currentLevel;
        storeLevel();
    }
    initWorld();
}