import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//Application
(() => {
  // three-js variables
  let scene, renderer, camera, controls;
  let stats;
  let gui;
  let guiCamera;
  let guiShot;

  let index;
  let beginShot;
  let sampleShotdata = {
    points : [],
  };

  let cylinderGeom, cylinerMaterial, cylinder, line;

  let shotCtrl = {
    ballSpeed: 60,
    launchAngle: 10,
    directionAngle: 1,
    action: shotFunc,
  };

  // three-js elements
  let cube
  let sphere;

  const init = () => {
    console.log("initialize scene");
    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(20));

    console.log("initialize renderer");
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x3f67b5);
    document.body.appendChild(renderer.domElement);

    console.log("initialize camera");
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-40, 10, 60);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 500;

    stats = new Stats();
    document.body.appendChild(stats.domElement);

    gui = new GUI();
    guiCamera = gui.addFolder('Camera');
    guiCamera.add(camera.position, 'z', 0, 10);
    guiCamera.open();

    guiShot = gui.addFolder('Shot');
    guiShot.add(shotCtrl, 'ballSpeed', 0, 100, 1);
    guiShot.add(shotCtrl, 'launchAngle', 0, 50, 1);
    guiShot.add(shotCtrl, 'directionAngle', 0, 50, 1);
    guiShot.add(shotCtrl, 'action');
    guiShot.open();

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
    const sphereMaterial = new THREE.MeshNormalMaterial();
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

    if (beginShot) {
      updateShot();
    }
  }

  function shotFunc() {
    // sample
    fetch('../asset/sample.json')
      .then(response => response.json())
      .then(data => {
        console.log("json data: ", data);
        sampleShotdata = data;

        // ... init points here
        // create line segments
        const points = [];
        sampleShotdata.points.forEach(element => {
          console.log(element.x, element.z, element.y);
          points.push(new THREE.Vector3(element.x, element.z, element.y));
        });
        const material = new THREE.LineBasicMaterial({
          color: 0xff3311
        });
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        line = new THREE.Line(geometry, material);
        line.geometry.setDrawRange(0, 0);
        scene.add(line);

      })
      .catch(error => console.log(error));


    // const lineGeomtry = new lineGeomtry();
    // lineGeomtry.setPositions(positions

    beginShot = true;
    index = 0;

    cylinderGeom = new THREE.CylinderGeometry(2, 2, 5, 20);
    cylinerMaterial = new THREE.MeshBasicMaterial({ color: 0xff3300 });
    cylinder = new THREE.Mesh(cylinderGeom, cylinerMaterial);
    scene.add(cylinder);
  }

  function updateShot() {
    line.geometry.setDrawRange(0, index++);
    /*
    cylinder.position.x = sampleShotdata.points[index].x;
    cylinder.position.y = sampleShotdata.points[index].z;
    cylinder.position.z = sampleShotdata.points[index].y;
    */

    /*
    index += 1;
    const cylinderNew = new THREE.Mesh(cylinderGeom, cylinerMaterial);
    cylinderNew.position.x = sampleShotdata.points[index].x;
    cylinderNew.position.y = sampleShotdata.points[index].z;
    cylinderNew.position.z = sampleShotdata.points[index].y;
    scene.add(cylinderNew);
    //cylinder.rotation.x+=0.01;
    */
  }

  init();
  animate();

})();