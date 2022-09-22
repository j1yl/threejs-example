import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";

// debugging
const gui = new dat.GUI();
const parameters = {
    materialColor: '#634f72'
};
gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor);
        particlesMaterial.color.set(parameters.materialColor);
});

// boilerplate
// canvas
const canvas = document.querySelector('canvas.webgl');

// scene
const scene = new THREE.Scene();

// objects
const material = new THREE.MeshToonMaterial({color: parameters.materialColor});
const objectsDistance = 6;

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
);
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
);
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
);

mesh1.position.y = objectsDistance * 0;
mesh2.position.y = objectsDistance * -1;
mesh3.position.y = objectsDistance * -2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

const sectionMeshes = [ mesh1, mesh2, mesh3 ];
scene.add(mesh1, mesh2, mesh3);

// particles
// geometry
const particleCount = 200;
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = objectsDistance * 0.4 - Math.random() * objectsDistance * sectionMeshes.length;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.05
});

// points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// lights
const pointlight = new THREE.PointLight("#ffffff", 1);
pointlight.position.set(1, 1, 0)
scene.add(pointlight);

// sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// camera group for parallax
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
cameraGroup.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// scroll
let scrollY = window.scrollY;

window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
})

// cursor
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", () => {
    // get values from -0.5 -> 0.5
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
})

// animation
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;


    // animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance;

    const parallaxX = cursor.x;
    const parallaxY = -cursor.y;

    // lerping formula
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) / 1.5 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) / 1.5 * deltaTime;

    // animate meshes
    for (const mesh of sectionMeshes) {
        mesh.rotation.x = elapsedTime * 0.1
        mesh.rotation.y = elapsedTime * 0.12
    }

    // render
    renderer.render(scene, camera);

    // call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();