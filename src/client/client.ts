import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui';

//Create Scene
var scene = new THREE.Scene();

//Istanzia tipo Target
var lastPlanetClicked: THREE.Object3D<THREE.Object3DEventMap> | null;

var stars = new THREE.Group();
var starsDir: THREE.Vector3[]= [];
//Create camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Create and set a Render
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
window.addEventListener('click', onMouseClick, false);

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function onMouseClick(event: MouseEvent) {
    event.preventDefault();
    // Calcola la posizione del clic nel sistema di coordinate del canvas
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    //Crea un raycaster
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    //oggetti intersecati dal raycaster
    var intersects = raycaster.intersectObjects(scene.children, true);
    console.log(intersects)
    for (var i = 0; i < intersects.length; i++) {
        if (intersects[i].object.type === "Mesh" && intersects[i].object.name!="sun" && intersects[i].object.name!="" ) {
            lastPlanetClicked = intersects[i].object ;
            break;
        }
    }
}
//Create OrbitControls to manage object
const control = new OrbitControls(camera, renderer.domElement);

//Create the Sun
var sunGeometry = new THREE.SphereGeometry(10, 32, 32);
var sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
var sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

//Define the create function for the other planets
function createPlanet(radius: number | undefined, color: number) {
    var geometry = new THREE.SphereGeometry(radius, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: color });
    var planet = new THREE.Mesh(geometry, material);
    return planet;
}

// Define planets radius
var mercuryRadius = 1;
var venusRadius = 2;
var earthRadius = 2;
var marsRadius = 1.5;
var jupiterRadius = 5;
var saturnRadius = 4;
var uranusRadius = 3;
var neptuneRadius = 3;

//Create planets
var mercury = createPlanet(mercuryRadius, 0x999999);
var venus = createPlanet(venusRadius, 0xffaa33);
var earth = createPlanet(earthRadius, 0x3399ff);
var mars = createPlanet(marsRadius, 0xff3300);
var jupiter = createPlanet(jupiterRadius, 0xffaa00);
var saturn = createPlanet(saturnRadius, 0xffddaa);
var uranus = createPlanet(uranusRadius, 0x66ccff);
var neptune = createPlanet(neptuneRadius, 0x3366ff);

// Set distances beetwen planets 
var mercuryOrbitRadius = 15;
var venusOrbitRadius = mercuryOrbitRadius + 25;
var earthOrbitRadius = venusOrbitRadius + 35;
var marsOrbitRadius = earthOrbitRadius + 15;
var jupiterOrbitRadius = marsOrbitRadius + 30;
var saturnOrbitRadius = jupiterOrbitRadius + 40;
var uranusOrbitRadius = saturnOrbitRadius + 20;
var neptuneOrbitRadius = uranusOrbitRadius + 20;

//Load textures
const textureLoader = new THREE.TextureLoader();
var sunTexture = textureLoader.load('img/sun.jpg');
var mercuryTexture = textureLoader.load('img/mercury.png');
var venusTexture = textureLoader.load('img/venus.jpg');
var earthTexture = textureLoader.load('img/earth.jpg');
var marsTexture = textureLoader.load('img/mars.jpg');
var jupiterTexture = textureLoader.load('img/jupiter.jpg');
var saturnTexture = textureLoader.load('img/saturn.jpg');
var uranusTexture = textureLoader.load('img/uranus.jpg');
var neptuneTexture = textureLoader.load('img/neptune.jpg');

//Load galaxy texture
var backgroundTexture = textureLoader.load('img/space.png');

scene.background = backgroundTexture;

//Add textures to planets
sun.material.map = sunTexture;
mercury.material.map = mercuryTexture;
venus.material.map = venusTexture;
earth.material.map = earthTexture;
mars.material.map = marsTexture;
jupiter.material.map = jupiterTexture;
saturn.material.map = saturnTexture;
uranus.material.map = uranusTexture;
neptune.material.map = neptuneTexture;

//Nomi pianeti per controllo click
sun.name="sun";
earth.name="earth";
mars.name="mars";
venus.name="venus";
jupiter.name="jupiter";
saturn.name="saturn"
uranus.name="uranus"
neptune.name="neptune"
// Add planets to Scene
scene.add(mercury, venus, earth, mars, jupiter, saturn, uranus, neptune);

// Set the z-position of the camera
camera.position.z = 20;

//Set function to create Orbits
function createOrbit(orbitRadius: number | undefined) {
    const orbitGeometry = new THREE.CircleGeometry(orbitRadius, 64);
    
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);

    orbit.rotation.x = - Math.PI / 2;

    return orbit;
}

// Create orbits for the planets
var mercuryOrbit = createOrbit(mercuryOrbitRadius);
var venusOrbit = createOrbit(venusOrbitRadius);
var earthOrbit = createOrbit(earthOrbitRadius);
var marsOrbit = createOrbit(marsOrbitRadius);
var jupiterOrbit = createOrbit(jupiterOrbitRadius);
var saturnOrbit = createOrbit(saturnOrbitRadius);
var uranusOrbit = createOrbit(uranusOrbitRadius);
var neptuneOrbit = createOrbit(neptuneOrbitRadius);

// Add orbits to the Scene
scene.add(mercuryOrbit, venusOrbit, earthOrbit, marsOrbit, jupiterOrbit, saturnOrbit, uranusOrbit, neptuneOrbit);

//Update Orbits position
function updateOrbit(orbit: THREE.Line<THREE.CircleGeometry, THREE.LineBasicMaterial, THREE.Object3DEventMap>, orbitRadius: number | undefined) {
   
    const orbitGeometry = new THREE.CircleGeometry(orbitRadius, 64);

    orbit.geometry.dispose(); 
    orbit.geometry = orbitGeometry;

    orbit.rotation.x = - Math.PI / 2; 
}

//Update Planets position
function updatePosition(planet: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>, orbitRadius: number, speed: number) {
    var angle = rotationAngle * speed;
    planet.position.set(
        Math.cos(angle) * orbitRadius,
        0,
        Math.sin(angle) * orbitRadius
    );
}

function hideAllOrbits() {
    const orbits = [mercuryOrbit, venusOrbit, earthOrbit, marsOrbit, jupiterOrbit, saturnOrbit, uranusOrbit, neptuneOrbit];

    for (const orbit of orbits) {
        orbit.visible = false;
    }
}

function showAllOrbits() {
    const orbits = [mercuryOrbit, venusOrbit, earthOrbit, marsOrbit, jupiterOrbit, saturnOrbit, uranusOrbit, neptuneOrbit];

    for (const orbit of orbits) {
        orbit.visible = true;
    }
}

function addStars(numStars: number, radius: number) {
    const starGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < numStars; i++) {
        const star = new THREE.Mesh(starGeometry, starMaterial);

        // Genera posizioni casuali per le stelle all'interno del volume specificato dal raggio
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;

        star.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        //Fissa una direzione random iniziale per ogni stella
        starsDir[i]= randomDirection(["x","y","z","-x","-y","-z"]);
        stars.add(star);
    }

    scene.add(stars);
}

function updateStars(){
    for (let i = 0; i < stars.children.length; i++) {
        var star= stars.children[i];
        star.position.add(starsDir[i]);

}
}
//Scelta Random tra le possibili direzioni
function randomDirection(directions:Array<String>) {
    var dir = directions[Math.floor(Math.random()*directions.length)];
    var force=0.01;
    switch (dir) {
        case "x":
            return new THREE.Vector3(force,0,0);
        case "y":
            return new THREE.Vector3(0,force,0);
        case "z":
            return new THREE.Vector3(0,0,force);
        case "-x":
            return new THREE.Vector3(force*-1,0,0);
        case "-y":
            return new THREE.Vector3(0,force*-1,0);
        case "-z":
            return new THREE.Vector3(0,0,force*-1);
        default:
            return new THREE.Vector3(0,0,0);
    }
}

const gui = new GUI();
const folder = gui.addFolder('Orbits');
const comandi = gui.addFolder('Command');
gui.domElement.style.fontSize = 'large';
comandi.domElement.style.fontSize = 'large';
folder.domElement.style.fontSize = 'large';
comandi.add({ "Stop following": function() {lastPlanetClicked=null}}, 'Stop following')

function toggleOrbitVisibility(show: boolean): void {
    const orbits = [mercuryOrbit, venusOrbit, earthOrbit, marsOrbit, jupiterOrbit, saturnOrbit, uranusOrbit, neptuneOrbit];

    for (const orbit of orbits) {
        orbit.visible = show;
    }
}

folder.add({ toggleOrbits: () => toggleOrbitVisibility(true) }, 'toggleOrbits').name('Show orbits');
folder.add({ toggleOrbits: () => toggleOrbitVisibility(false) }, 'toggleOrbits').name('Hide orbits');

const stats = new Stats();
document.body.appendChild(stats.dom);

addStars(10000,500);

// Animate
function animate() {
    requestAnimationFrame(animate);

    rotationAngle += 1.0;

    updatePosition(mercury, mercuryOrbitRadius, 0.01);
    updatePosition(venus, venusOrbitRadius, 0.008);
    updatePosition(earth, earthOrbitRadius, 0.005);
    updatePosition(mars, marsOrbitRadius, 0.004);
    updatePosition(jupiter, jupiterOrbitRadius, 0.001);
    updatePosition(saturn, saturnOrbitRadius, 0.0008);
    updatePosition(uranus, uranusOrbitRadius, 0.0005);
    updatePosition(neptune, neptuneOrbitRadius, 0.0003);

    updateOrbit(mercuryOrbit, mercuryOrbitRadius);
    updateOrbit(venusOrbit, venusOrbitRadius);
    updateOrbit(earthOrbit, earthOrbitRadius);
    updateOrbit(marsOrbit, marsOrbitRadius);
    updateOrbit(jupiterOrbit, jupiterOrbitRadius);
    updateOrbit(saturnOrbit, saturnOrbitRadius);
    updateOrbit(uranusOrbit, uranusOrbitRadius);
    updateOrbit(neptuneOrbit, neptuneOrbitRadius);


    updateStars();

    if(lastPlanetClicked!=null){
    camera.lookAt(sun.position)
    var WHERE = new THREE.Vector3(-lastPlanetClicked.position.x, lastPlanetClicked.position.y+20,-lastPlanetClicked.position.z)
    WHERE= WHERE.multiplyScalar(-1.5)
    camera.position.set(WHERE.x,WHERE.y*-1,WHERE.z); 
}
    stats.update();
    render();
}

function render(){
    renderer.render(scene, camera);
}

var rotationAngle = 0;

animate();
