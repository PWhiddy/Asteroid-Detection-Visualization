
import * as THREE from './three.module.js';
import { RawImage } from './Image.js';

var camera, scene, renderer, stats;
var mesh;

loadShaders('../shaders/image_grid.vertex', '../shaders/image_grid.frag');

function init(vs, fs) {
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 10;
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );
  //let geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );

  let mat = new THREE.RawShaderMaterial({
  	uniforms: { tileScale: { value: 0.8 } },
  	vertexShader: vs,
  	fragmentShader: fs
  });

  /*
	// geometry
	let instances = 500;
	let bufferGeometry = new THREE.BoxBufferGeometry( 0.5, 0.5, 0.5 );
	// copying data from a simple box geometry, but you can specify a custom geometry if you want
	let geo = new THREE.InstancedBufferGeometry();
	geo.index = bufferGeometry.index;
	geo.attributes.position = bufferGeometry.attributes.position;
	// per instance data
	var offsets = [];
  var colors = [];

	for ( let i = 0; i < instances; i ++ ) {
    let vector = new THREE.Vector4();
    let x, y, z, w;

		// offsets
		x = Math.random() * 10 - 5;
		y = Math.random() * 10 - 5;
		z = Math.random() * 10 - 5;
		vector.set( x, y, z, 0 ).normalize();
		vector.multiplyScalar( 4 ); // move out at least 5 units from center in current direction
		offsets.push( x + vector.x, y + vector.y, z + vector.z );

    x = Math.random();
    y = Math.random();
    z = Math.random();
    colors.push(x,y,z,1);
	}
	let offsetAttribute =
    new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 );
  let colorAttribute =
    new THREE.InstancedBufferAttribute( new Float32Array( colors ), 4);
	geo.addAttribute( 'offset', offsetAttribute );
  geo.addAttribute( 'color', colorAttribute );
  */
  ///

  //let material = new THREE.MeshBasicMaterial({color:0x882244});

  //mesh = new THREE.Mesh( geo, mat );

  let img = new RawImage(15, 10);
  img.makeNoise(0.0, 5.0);
  img.makeMesh(mat);

  mesh = img.mesh;

  scene.add( mesh );
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  //
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

function animate() {
  requestAnimationFrame( animate );
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;
  renderer.render( scene, camera );
  stats.update();
}