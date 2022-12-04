import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import './tailwind.css';

// Application
(() => {
  "use strict";

  class Application {
    constructor() {
      this.threejs = {
        scene: null,
        renderer: null,
        camera: null,
        controls: null,
        stats: null,
        gui: null,
        guiCamera: null,
        guiPanel: null,
        cube: null,
        sphere: null,
        cylinderGeom: null,
        cylinerMaterial: null,
        cylinder: null,
        line: null,
      };

      this.shotdata = {
        index: null,
        sampleShotdata: {
          points: [],
        },
      };

      this.state = {
        beginShot: null,
      };

      this.shotCtrl = {
        ballSpeed: 60,
        launchAngle: 10,
        directionAngle: 1,
        backSpin: 4000,
        sideSpin: 1000,
        shooting: this.shootingFunc,
      };
    }

    updateShot() {
      this.threejs.line.geometry.setDrawRange(0, index++);
    }

    shootingFunc() {
      // sample
      fetch("../asset/sample.json")
        .then((response) => response.json())
        .then((data) => {
          console.log("json data: ", data);
          sampleshotdata = data;

          // ... init points here
          // create line segments
          const points = [];
          sampleshotdata.points.foreach((element) => {
            console.log(element.x, element.z, element.y);
            points.push(new three.vector3(element.x, element.z, element.y));
          });
          const material = new three.linebasicmaterial({
            color: 0xff3311,
            linewidth: 10,
          });
          const geometry = new three.buffergeometry().setfrompoints(points);

          line = new three.line(geometry, material);
          line.geometry.setdrawrange(0, 0);
          scene.add(line);
        })
        .catch((error) => console.log(error));

      // const linegeomtry = new linegeomtry();
      // linegeomtry.setpositions(positions

      beginshot = true;
      index = 0;

      cylindergeom = new three.cylindergeometry(2, 2, 5, 20);
      cylinermaterial = new three.meshbasicmaterial({ color: 0xff3300 });
      cylinder = new three.mesh(cylindergeom, cylinermaterial);
      scene.add(cylinder);
    };

    init() {
      console.log("initialize scene");
      this.threejs.scene = new THREE.Scene();
      this.threejs.scene.add(new THREE.AxesHelper(20));

      console.log("initialize renderer");
      this.threejs.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.threejs.renderer.setSize(window.innerWidth, window.innerHeight);
      this.threejs.renderer.setClearColor(0x3f67b5);

      document.getElementById('render-container').appendChild(this.threejs.renderer.domElement);

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
        this.threejs.renderer.domElement
      );
      this.threejs.controls.minDistance = 10;
      this.threejs.controls.maxDistance = 500;

      this.threejs.stats = new Stats();
      document.body.appendChild(this.threejs.stats.domElement);

      this.threejs.gui = new GUI();
      this.threejs.guiCamera = this.threejs.gui.addFolder("Camera setting");
      this.threejs.guiCamera.add(this.threejs.camera.position, "z", 0, 10);
      this.threejs.guiCamera.open();

      this.threejs.guiPanel = this.threejs.gui.addFolder("Shot setting");
      this.threejs.guiPanel.add(this.shotCtrl, "ballSpeed", 0, 100, 1);
      this.threejs.guiPanel.add(this.shotCtrl, "launchAngle", 0, 50, 1);
      this.threejs.guiPanel.add(this.shotCtrl, "directionAngle", 0, 50, 1);
      this.threejs.guiPanel.add(this.shotCtrl, "shooting");
      this.threejs.guiPanel.open();

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

    render() {
      requestAnimationFrame(Animate);

      this.threejs.sphere.rotation.x += 0.01;
      this.threejs.sphere.rotation.y += 0.01;

      this.threejs.controls.update();
      this.threejs.stats.update();

      this.threejs.renderer.render(this.threejs.scene, this.threejs.camera);

      if (this.state.beginShot) {
        this.updateShot();
      }
    };
  }

  function Animate() {
    app.render();
  }

  let app = new Application();
  app.init();
  app.render();
})();
