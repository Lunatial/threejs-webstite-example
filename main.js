import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const myTextureLoader = new THREE.TextureLoader()

// Setup
// ez az alap container
const scene = new THREE.Scene();
// PerspectiveCameraaz mimiceli, hogy egy emberi szem mit látna
// Első paraméter, hogy hány fokos szögből látszódik a 360-ból. https://youtu.be/Q7AOvWpIVHU?t=246
// Második az arány, ami a felhasználó böngészője ad ki
// Utolsó kettő, hogy mit lát a kamera (közel és távol)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Hová renderelje a cuccot, melyik canvasra
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

// Meg kell mondani a renderernek a pixelRatio-t
renderer.setPixelRatio(window.devicePixelRatio);
// Egész képernyőre rendereljen
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);
camera.position.setX(-3);
// Ez rajzolja ki, rendereli le végső soron
renderer.render(scene, camera);

// Torus 3 lépésből lehet végül hozzáadni a scene-hez
// Itt még adott lenne egy fekete háttér, ezért oda torus geometriát kell rakni https://youtu.be/Q7AOvWpIVHU?t=311
// pl.: https://threejs.org/docs/#api/en/geometries/BoxGeometry
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// Ez adja a felszínét, ez olyan amihez nem kell éppen fényforrás MeshBasicMaterial
// A MeshStandardMaterial reagál a fényre
// const material = new THREE.MeshStandardMaterial({color: '#33A8DB', wireframe: true});
const material = new THREE.MeshStandardMaterial({color: '#33A8DB'});
// Összerakja a kettőt
const torus = new THREE.Mesh(geometry, material);
// végül hozzáadjuk a scene-hez
scene.add(torus);

// EZ Nagyon szépe és jó, de ez folyamatosan renderelgetni kell. Hogy ez meglegyen infinite loopba kell rakni, itt jön a képbe az "animate" funkciónk

// Lights
// Mint egy égő, ami egyetlen egy fénypontból ad fényt
const pointLight = new THREE.PointLight('#FAD16B');
// Elpakolva a fényforrást a centertől x y z coordinátákkal https://youtu.be/Q7AOvWpIVHU?t=486
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight('0xffffff');
scene.add(pointLight, ambientLight);

// Helpers https://youtu.be/Q7AOvWpIVHU?t=527
// a pointLight pozícióját mutatja meg
// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

// Csillagok

// radius, width/ height
const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
const starMaterial = new THREE.MeshStandardMaterial({color: 'yellow'});

function addStar() {
    const star = new THREE.Mesh(starGeometry, starMaterial);
    // Minden egyes csillagnak egy random generált x y z coordináta kell
    const [x, y, z] = Array(3)
        .fill()
        // - és + floatokkal tölti fel a határ a range
        .map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x, y, z);
    scene.add(star);
}

// itt adjuk meg a csillagok számát
Array(200).fill().forEach(addStar);

// Background
// Háttér adása
// itt callback functiont lehetne adni, hogy mikor töltődött be és ez alapján akár loadingot kirakni
const spaceTexture = myTextureLoader.load('./space.jpg');
scene.background = spaceTexture;

// Avatar

const mirkoTexture = myTextureLoader.load('./mirko.png');

const mirko = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshBasicMaterial({map: mirkoTexture})
);

scene.add(mirko);

// Moon

const moonTexture = myTextureLoader.load('./moon.jpg');
const normalTexture = myTextureLoader.load('./normal.jpg');

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({
        map: moonTexture,
        normalMap: normalTexture,
    })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

mirko.position.z = -5;
mirko.position.x = 2;

// Scroll Animation

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;

    mirko.rotation.y += 0.01;
    mirko.rotation.z += 0.01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
    requestAnimationFrame(animate);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    moon.rotation.x += 0.005;

    // controls.update();

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera);
}
