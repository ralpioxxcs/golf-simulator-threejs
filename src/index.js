import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Application
(() => {
  "use strict";

  function Application (){
    this.threejs = {
      scene : null,
      renderer,
      camera,
      controls,
      stats,
      gui,
      guiCamera,
      guiShot,
      cube,
      sphere,
      cylinderGeom,
      cylinerMaterial,
      cylinder,
      line,
    };

    this.shotdata = {
      index,
      sampleShotdata: {
        points: [],
      },
    };

    this.state = {
      beginShot,
    };

    this.shotCtrl = {
      ballSpeed: 60,
      launchAngle: 10,
      directionAngle: 1,
      action: shotFunc,
    };

    let shotFunc = function () {
      // sample
      fetch("../asset/sample.json")
        .then((response) => response.json())
        .then((data) => {
          console.log("json data: ", data);
          sampleShotdata = data;

          // ... init points here
          // create line segments
          const points = [];
          sampleShotdata.points.forEach((element) => {
            console.log(element.x, element.z, element.y);
            points.push(new THREE.Vector3(element.x, element.z, element.y));
          });
          const material = new THREE.LineBasicMaterial({
            color: 0xff3311,
            linewidth: 10,
          });
          const geometry = new THREE.BufferGeometry().setFromPoints(points);

          line = new THREE.Line(geometry, material);
          line.geometry.setDrawRange(0, 0);
          scene.add(line);
        })
        .catch((error) => console.log(error));

      // const lineGeomtry = new lineGeomtry();
      // lineGeomtry.setPositions(positions

      beginShot = true;
      index = 0;

      cylinderGeom = new THREE.CylinderGeometry(2, 2, 5, 20);
      cylinerMaterial = new THREE.MeshBasicMaterial({ color: 0xff3300 });
      cylinder = new THREE.Mesh(cylinderGeom, cylinerMaterial);
      scene.add(cylinder);
    };

    let updateShot = function () {
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
    };
  };

  let app = new Application();
  app.init();
  app.render();

  Application.prototype.init = () => {
    console.log("initialize scene");
    this.threejs.scene = new THREE.Scene();
    this.threejs.scene.add(new THREE.AxesHelper(20));

    console.log("initialize renderer");
    this.threejs.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.threejs.renderer.setSize(window.innerWidth, window.innerHeight);
    this.threejs.renderer.setClearColor(0x3f67b5);
    document.body.appendChild(this.threejs.renderer.domElement);

    console.log("initialize camera");
    this.threejs.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.threejs.camera.position.set(-40, 10, 60);

    this.threejs.controls = new OrbitControls(
      this.threejs.camera,
      renderer.domElement
    );
    this.threejs.controls.minDistance = 10;
    this.threejs.controls.maxDistance = 500;

    this.threejs.stats = new Stats();
    document.body.appendChild(this.threejs.stats.domElement);

    this.threejs.gui = new GUI();
    this.threejs.guiCamera = this.threejs.gui.addFolder("Camera");
    this.threejs.guiCamera.add(this.threejs.camera.position, "z", 0, 10);
    this.threejs.guiCamera.open();

    this.threejs.guiShot = this.threejs.gui.addFolder("Shot");
    this.threejs.guiShot.add(shotCtrl, "ballSpeed", 0, 100, 1);
    this.threejs.guiShot.add(shotCtrl, "launchAngle", 0, 50, 1);
    this.threejs.guiShot.add(shotCtrl, "directionAngle", 0, 50, 1);
    this.threejs.guiShot.add(shotCtrl, "action");
    this.threejs.guiShot.open();

    // elements (grid)
    const gridSize = 10;
    const gridDiv = 10;
    const gridHelper = new THREE.GridHelper(gridSize, gridDiv);
    this.threejs.scene.add(gridHelper);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.threejs.cube = new THREE.Mesh(geometry, material);
    this.threejs.scene.add(this.threejs.cube);

    const sphereGeometry = new THREE.SphereGeometry(2, 50, 32);
    const sphereMaterial = new THREE.MeshNormalMaterial();
    sphereMaterial.flatShading = true;

    this.threejs.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.threejs.sphere.position.x = 10;
    this.threejs.scene.add(this.threejs.sphere);
  };

  Application.prototype.render = () => {
    requestAnimationFrame(render);

    this.threejs.sphere.rotation.x += 0.01;
    this.threejs.sphere.rotation.y += 0.01;

    this.threejs.controls.update();
    this.threejs.stats.update();

    this.threejs.renderer.render(this.threejs.scene, this.threejs.camera);

    if (beginShot) {
      this.updateShot();
    }
  };
})();
