import * as THREE from "three";

import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

import './tailwind.css';

import checkerboardImg from '../assets/checkerboard.jpg';
import grassImg from '../assets/grass.jpg';
import { sampleData } from './sample';

import { check } from "prettier";

// Application
(() => {
  "use strict";

  const AXIS_SIZE = 10;
  const GRID_SIZE = 10;
  const FOV = 65;
  const NEAR = 1;
  const FAR = 500;

  const BALL_DIAMETER = 0.043;
  const GRAVITY = 30;

  const THREE_CONTAINER = document.getElementById('render-container');

  const clock = new THREE.Clock();

  class Application {

    constructor() {
      this.three = {
        scene: THREE.Scene,
        renderer: THREE.WebGLRenderer,
        camera: THREE.PerspectiveCamera,
        ctrl: OrbitControls, // orbit control
        ctrl2: FirstPersonControls, // orbit control
        stats: Stats,
        gui: GUI,
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
        ball: THREE.Mesh,
        floor: THREE.Mesh,
      }

      this.shotdata = {
        index: 0,
      };

      this.state = {
        beginShot: false,
        keyInput: {}
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
        color: new THREE.Color(THREE.MathUtils.randFloat(0.0, 1.0), THREE.MathUtils.randFloat(0.0, 1.0), THREE.MathUtils.randFloat(0.0, 1.0)),
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
      // Scene
      console.debug("initialize scene");
      this.three.scene = new THREE.Scene();
      this.three.scene.add(new THREE.AxesHelper(AXIS_SIZE));
      this.three.scene.add(new THREE.AmbientLight(0x505050));

      // Renderer
      console.debug("initialize renderer");
      this.three.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.three.renderer.setSize(window.innerWidth, window.innerHeight);
      this.three.renderer.setClearColor(0x808080);
      this.three.renderer.shadowMap.enabled = true;
      this.three.renderer.shadowMap.type = THREE.VSMShadowMap;
      // this.three.renderer.outputEncoding = THREE.sRGBEncoding;
      // this.three.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      THREE_CONTAINER.appendChild(this.three.renderer.domElement);

      // Camera
      console.log("initialize camera");
      this.three.camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, NEAR, FAR);
      this.three.camera.position.set(0, 2.0, 5);
      this.three.camera.lookAt(new THREE.Vector3(0, 1.8, 5));

      // Lights
      const ambLight = new THREE.AmbientLight(0x404040, 0.7);
      this.three.scene.add(ambLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
      dirLight.position.set(1, 0.5, 0);
      dirLight.castShadow = true;
      dirLight.shadow.camera.near = 0.01;
      dirLight.shadow.camera.far = 100;
      this.three.scene.add(dirLight);

      // const helper = new THREE.CameraHelper(dirLight.shadow.camera);
      // this.three.scene.add(helper);

      // Controls (world view)
      this.three.ctrl = new OrbitControls(this.three.camera, this.three.renderer.domElement);
      this.three.ctrl.target.set(0, 1, 0);
      this.three.ctrl.minPolarAngle = THREE.MathUtils.degToRad(0);
      this.three.ctrl.maxPolarAngle = THREE.MathUtils.degToRad(95);
      this.three.ctrl.minDistance = 0;
      this.three.ctrl.maxDistance = 500;

      this.three.ctrl2 = new FirstPersonControls(this.three.camera, this.three.renderer.domElement);
      this.three.ctrl2.awctiveLook = false;
      this.three.ctrl2.autoForward = false;
      // this.three.ctrl.domElement = this.three.renderer.domElement;

      // Stats
      this.three.stats = new Stats();
      this.three.stats.domElement.style.position = 'absolute';
      this.three.stats.domElement.style.position = '0px';
      THREE_CONTAINER.appendChild(this.three.stats.domElement);

      // GUI
      this.three.gui = new GUI();
      this.three.guiCamera = this.three.gui.addFolder("Camera setting");
      this.three.guiCamera.add(this.three.camera.position, "x", -100, 100);
      this.three.guiCamera.add(this.three.camera.position, "y", 0, 50);
      this.three.guiCamera.add(this.three.camera.position, "z", 0, 200);
      this.three.guiCamera.open();

      this.three.guiPanel = this.three.gui.addFolder("Shot setting");
      this.three.guiPanel.add(this.shotCtrl, "ballSpeed", 0, 100, 1);
      this.three.guiPanel.add(this.shotCtrl, "launchAngle", 0, 50, 1);
      this.three.guiPanel.add(this.shotCtrl, "directionAngle", 0, 50, 1);
      this.three.guiPanel.add(this.shotCtrl, "shooting");
      this.three.guiPanel.open();

      // Objects
      // Grid
      this.three.scene.add(new THREE.GridHelper(GRID_SIZE, 10));

      // Ready ball
      const readyBallGeometry = new THREE.SphereGeometry(BALL_DIAMETER, 32, 16); // diameter : 4.3cm
      const readyBallMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, flatShading: true, clearcoat: 0.5 })
      this.objects.ball = new THREE.Mesh(readyBallGeometry, readyBallMaterial);
      this.objects.ball.position.x = 0;
      this.objects.ball.position.y = BALL_DIAMETER / 2;
      this.objects.ball.position.z = 0;
      this.three.scene.add(this.objects.ball);

      // Floor (grass)
      const tex = new THREE.TextureLoader().load(grassImg);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1000, 1000);
      const floorMaterial = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide,
      });
      const floorGeometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
      this.objects.floor = new THREE.Mesh(floorGeometry, floorMaterial);
      this.objects.floor.y = -0.5;
      this.objects.floor.rotateX(-Math.PI / 2);
      this.objects.floor.receiveShadow = true;
      this.three.scene.add(this.objects.floor);

      // Events
      let self = this;
      document.addEventListener('keydown', (ev) => {
        self.state.keyInput[ev.code] = true;
      });
      document.addEventListener('keyup', (ev) => {
        self.state.keyInput[ev.code] = false;
      });
      window.addEventListener('resize', onWindowResize);
    };

    onWindowResize() {
      this.three.camera.aspect = window.innerWidth / window.innerHeight;
      this.three.camera.updateProjectionMatrix();
      this.three.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
      let delta = clock.getDelta();

      //updateControls();
      // if(this.state.keyInput['KeyW']) {
      //   this.three.camera.position.z -= 0.01;
      // }
      // if(this.state.keyInput['KeyA']) {
      //   this.three.camera.position.x -= 0.01;
      // }
      // if(this.state.keyInput['KeyS']) {
      //   this.three.camera.position.x += 0.01;
      // }
      // if(this.state.keyInput['KeyD']) {
      //   this.three.camera.position.z += 0.01;
      // }

      this.three.ctrl.update();
      this.three.ctrl2.update(delta);

      if (this.state.beginShot) {
        this.updateShot();
      }

      this.three.renderer.render(this.three.scene, this.three.camera);
      this.three.stats.update();
      requestAnimationFrame(Animate);
    };
  }

  function Shooting() {
    app.shooting();
  }

  function Animate() {
    app.render();
  }

  function onWindowResize() {
    app.onWindowResize();
  }

  let app = new Application();

  app.init();
  app.render();

})();
