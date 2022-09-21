import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";

// debugging
const gui = new dat.GUI();
const parameters = {
    materialColor: '#ffeded'
};
gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor);
});

// boilerplate
// canvas
const canvas = document.querySelector('canvas.webgl');

// scene
const scene = new THREE.Scene();

// objects
const material = new THREE.MeshToonMaterial({color: parameters.materialColor});
const objectsDistance = 4;

const mesh1 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
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
const sectionMeshes = [ mesh1, mesh2, mesh3 ];
scene.add(mesh1, mesh2, mesh3);

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

// camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// scroll
let scrollY = window.scrollY;

// animation
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

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