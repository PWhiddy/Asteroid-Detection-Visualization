
import * as THREE from './three.module.js';
import { RawImage, SearchCone } from './Image.js';
import { OrbitControls } from './OrbitControls.js';

var camera, scene, renderer, controls, stats;
var imageMeshes;

const imgW = 8;
const imgH = 8;
const imgCount = 4;
var imgSpacing = 2;

loadShaders('../shaders/image_grid.vertex', '../shaders/image_grid.frag');

function init(vs, fs) {
  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 10;

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );

  let mat = new THREE.RawShaderMaterial({
  	uniforms: { tileScale: { value: 0.8 } },
  	vertexShader: vs,
  	fragmentShader: fs
  });

  var imgs = [];

  imageMeshes = new THREE.Group();

  for (let i=0; i<imgCount; i++) {
    let img = new RawImage(imgW, imgH);
    img.makeNoise(0.0, 0.5);
    img.makeMesh(mat);
    imageMeshes.add(img.mesh);
    imgs.push(img);
  }

  setSpacing();

  scene.add( imageMeshes );

  let cone = new SearchCone(0.0, 1.5, 8, 3, 10, 8);
  cone.makeEndPoints(mat);
  console.log(cone.endpoints);
  scene.add(cone.endpoints);

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDampening = true;
  controls.dampeningFactor = 0.2;
  
  window.addEventListener( 'resize', onWindowResize, false );

  stats = new Stats();
  document.body.appendChild(stats.dom);

  animate();

}

function loadShaders(vertexSource, fragmentSource) {
  // Asynchronicity is pain :(
  let vertLoaded = false;
  let fragLoaded = false;
  let continued  = false;
  let vs = '';
  let fs = '';

  let vertLoader = new XMLHttpRequest();
  vertLoader.onload = function() {
  	vs = vertLoader.responseText;
  	vertLoaded = true;
  	if (vertLoaded && fragLoaded && !continued) {
      continued = true;
      init(vs,fs);
  	}
  }
  vertLoader.open("GET", vertexSource, true);
  vertLoader.send(null);

  let fragLoader = new XMLHttpRequest();
  fragLoader.onload = function() {
  	fs = fragLoader.responseText;
  	fragLoaded = true;
  	if (vertLoaded && fragLoaded && !continued) {
   	  continued = true;
  	  init(vs, fs);
  	}
  }
  fragLoader.open("GET", fragmentSource, true);
  fragLoader.send(null);
}

function xhrError() { 
    console.error(this.statusText); 
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function setSpacing() {
  for (let i=0; i<imageMeshes.children.length; i++) {
    imageMeshes.children[i].position.z = imgSpacing*i-(imgSpacing*imgCount)/2;
  }
}

function animate() {
  requestAnimationFrame( animate );
  //mesh.rotation.x += 0.005;
  //mesh.rotation.y += 0.01;
  renderer.render( scene, camera );
  stats.update();
}