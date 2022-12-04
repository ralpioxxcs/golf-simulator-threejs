import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import './tailwind.css';

import checkerboardImg from '../assets/checkerboard.jpg';
import grassImg from '../assets/grass.jpg';
import { sampleData } from './sample';

import { check } from "prettier";

// Application
(() => {
  "use strict";

  const AXIS_SIZE = 30;

  class Application {

    constructor() {
      this.three = {
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

      this.objects = {
        floor: null,
      }

      this.shotdata = {
        index: 0,
      };

      this.state = {
        beginShot: false,
      };

      this.shotCtrl = {
        ballSpeed: 60,
        launchAngle: 10,
        directionAngle: 1,
        backSpin: 4000,
        sideSpin: 1000,
        shooting: Shooting,
      };
    }

    updateShot() {
      this.three.line.geometry.setDrawRange(0, this.shotdata.index++);
    }

    shooting() {
      const points = [];
      sampleData.points.forEach((element) => {
        console.log(element.x, element.z, element.y);
        points.push(new THREE.Vector3(element.x, element.z, -element.y));
      });

      const material = new THREE.LineBasicMaterial({
        color: 0xff3311,
        linewidth: 10,
      });
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      this.three.line = new THREE.Line(geometry, material);
      this.three.line.geometry.setDrawRange(0, 0);
      this.three.scene.add(this.three.line);

      this.state.beginShot = true;
      this.shotdata.index = 0;
    };

    init() {
      console.log("initialize scene");
      this.three.scene = new THREE.Scene();
      this.three.scene.add(new THREE.AxesHelper(AXIS_SIZE));

      console.log("initialize renderer");
      this.three.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.three.renderer.setSize(window.innerWidth, window.innerHeight);
      this.three.renderer.setClearColor(0x3f67b5);

      document.getElementById('render-container').appendChild(this.three.renderer.domElement);

      console.log("initialize camera");
      this.three.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      this.three.camera.position.set(0, 150, 400);
      this.three.camera.lookAt(this.three.scene.position)

      this.three.controls = new OrbitControls(
        this.three.camera,
        this.three.renderer.domElement
      );
      this.three.controls.minDistance = 10;
      this.three.controls.maxDistance = 500;

      this.three.stats = new Stats();
      document.body.appendChild(this.three.stats.domElement);

      this.three.gui = new GUI();
      this.three.guiCamera = this.three.gui.addFolder("Camera setting");
      this.three.guiCamera.add(this.three.camera.position, "z", 0, 10);
      this.three.guiCamera.open();

      this.three.guiPanel = this.three.gui.addFolder("Shot setting");
      this.three.guiPanel.add(this.shotCtrl, "ballSpeed", 0, 100, 1);
      this.three.guiPanel.add(this.shotCtrl, "launchAngle", 0, 50, 1);
      this.three.guiPanel.add(this.shotCtrl, "directionAngle", 0, 50, 1);
      this.three.guiPanel.add(this.shotCtrl, "shooting");
      this.three.guiPanel.open();

      // elements (grid)
      const gridSize = 10;
      const gridDiv = 10;
      const gridHelper = new THREE.GridHelper(gridSize, gridDiv);
      this.three.scene.add(gridHelper);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      this.three.cube = new THREE.Mesh(geometry, material);
      this.three.scene.add(this.three.cube);

      const sphereGeometry = new THREE.SphereGeometry(2, 50, 32);
      const sphereMaterial = new THREE.MeshNormalMaterial();
      sphereMaterial.flatShading = true;

      this.three.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      this.three.sphere.position.x = 10;
      this.three.scene.add(this.three.sphere);

      // Floor(grass)
      const tex = new THREE.TextureLoader().load(grassImg);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(50, 50);
      const floorMaterial = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide
      });
      const floorGeometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.y=-0.5;
      floor.rotateX(-Math.PI/2);
      this.three.scene.add(floor);
    };

    render() {
      requestAnimationFrame(Animate);

      this.three.sphere.rotation.x += 0.01;
      this.three.sphere.rotation.y += 0.01;

      this.three.controls.update();
      this.three.stats.update();

      this.three.renderer.render(this.three.scene, this.three.camera);

      if (this.state.beginShot) {
        this.updateShot();
      }
    };
  }

  function Shooting() {
    app.shooting();
  }

  function Animate() {
    app.render();
  }

  let app = new Application();
  app.init();
  app.render();

})();
