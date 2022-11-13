import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

//Application
(() => {
  // three-js variables
  let scene;
  let renderer;
  let camera;
  let controls;
  let stats;

  // three-js elements
  let cube
  let sphere;

  const init = () => {
    console.log("initialize scene");
    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(100));

    console.log("initialize renderer");
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x3f67b5);
    document.body.appendChild(renderer.domElement);

    console.log("initialize camera");
    const near = 0.1;
    const far = 1000.0;
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, near, far);
    camera.position.set(0, 0, 5);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    stats = new Stats();
    document.body.appendChild(stats.dom);

    // elements (grid)
    const gridSize = 10;
    const gridDiv = 10;
    const gridHelper = new THREE.GridHelper(gridSize, gridDiv);
    scene.add(gridHelper);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(2, 50, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true
    })
    sphereMaterial.flatShading = true;

    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.position.x = 10
    scene.add(sphere)
  };

  const animate = () => {
    requestAnimationFrame(animate);

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    controls.update();
    stats.update();

    renderer.render(scene, camera);
  }

  init();
  animate();

})();