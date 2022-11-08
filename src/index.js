import * as THREE from 'three';
import { FlatShading } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(10));

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1, 1000
);

//const renderer = new THREE.WebGLRenderer({alpha: true});
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x969696);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement );

camera.position.set(0, 20, 100);
controls.update();

const boxGeometry = new THREE.BoxGeometry();
const sphereGeometry = new THREE.SphereGeometry(2, 50, 32)

const material = new THREE.MeshNormalMaterial();
// const material = new THREE.MeshBasicMaterial({
//   color: 0x00ff00,
//   wireframe: true
// })
material.flatShading = true;

const cube = new THREE.Mesh(boxGeometry, material);
cube.position.x = 5;
scene.add(cube);

const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.position.x = 3
scene.add(sphere)

const stats = Stats()
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  //cube.rotation.x += 0.01;
  //cube.rotation.y += 0.01;

  renderer.render(scene, camera);

  stats.update();
  controls.update();
};

animate();