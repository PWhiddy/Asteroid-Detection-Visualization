import * as THREE from './three.module.js'; 

class RawImage {

  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.pixelCount = w*h;
    this.buf = new Float32Array(this.pixelCount);
    this.maxVal = 1.0;
    this.minVal = 0.0;
    this.mesh = null;
  }
  
  setPixel(x, y, value) {
    this.buf[x+y*this.width] = value;
  }

  getPixel(x, y) {
    return this.buf[x+y*this.width];
  }

  getBuf() {
    return this.buf;
  }

  makeNoise(mean, sigma) {
    //for (let pixel of this.buf) pixel = randomNorm(mean, sigma);
    for (let i=0; i<this.pixelCount; i++) {
      let c = this.randomNorm(mean, sigma);
      this.buf[i] = c;
      this.maxVal = Math.max(this.maxVal, c);
      this.minVal = Math.min(this.minVal, c)
    }
  }

  randomNorm(mean, sigma) {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return sigma * 
      Math.sqrt( -2.0 * Math.log( u ) ) *
      Math.cos( 2.0 * Math.PI * v )
      + mean;
  }

  hasMesh() {
    return this.mesh !== null;
  }
 
  makeMesh(material) {
    // geometry
    let bufferGeometry = new THREE.BoxBufferGeometry( 1.0, 1.0, 0.15 );
    // copying data from a simple box geometry, but you can specify a custom geometry if you want
    let geo = new THREE.InstancedBufferGeometry();
    geo.index = bufferGeometry.index;
    geo.attributes.position = bufferGeometry.attributes.position;
    // per instance data
    var offsets = [];
    var colors = [];

    for ( let i = 0; i < this.pixelCount; i ++ ) {
      let x, y, z, w;
      // offsets
      x = i%this.width-this.width/2;
      y = Math.floor(i/this.width)-this.height/2;
      z = 0;
      offsets.push( x, y, z );

      let colVal = (this.buf[i]-this.minVal)/(this.maxVal-this.minVal);
      colVal = colVal*colVal*colVal;
      colors.push( colVal, 0.65*(1.0-colVal), 1.0-colVal, 1);
    }
    let offsetAttribute =
      new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 );
    let colorAttribute =
      new THREE.InstancedBufferAttribute( new Float32Array( colors ), 4);
    geo.addAttribute( 'offset', offsetAttribute );
    geo.addAttribute( 'color', colorAttribute );

    this.mesh = new THREE.Mesh(geo, material);
    //this.hasMesh = true;
  }

}

class SearchCone {

  constructor(minAng, maxAng, stepsAng, minVel, maxVel, stepsVel) {
    this.minAngle = minAng;
    this.maxAngle = maxAng;
    this.stepsAngle = stepsAng;
    this.minVelocity = minVel;
    this.maxVelocity = maxVel;
    this.stepsVelocity = stepsVel;
    this.lines = null;
    this.cone = null;
    this.endpoints = null;
  }

  makeEndPoints(material) {
    //let material = new THREE.MeshBasicMaterial({color:0xff8800});
    let buffergeo = new THREE.SphereBufferGeometry(0.05, 8, 8);

    let geo = new THREE.InstancedBufferGeometry();
    geo.index = buffergeo.index;
    geo.attributes.position = buffergeo.attributes.position;
    // per instance data
    var offsets = [];
    var colors = [];

    let aStep = (this.maxAngle-this.minAngle)/this.stepsAngle;
    let vStep = (this.maxVelocity-this.minVelocity)/this.stepsVelocity;
    for (let a=this.minAngle; a<this.maxAngle; a+=aStep) {
      for (let v=this.minVelocity; v<this.maxVelocity; v+=vStep) {
        offsets.push(v*Math.cos(a), v*Math.sin(a), 0.0);
        colors.push(1.0, 0.65, 0.0, 1.0);
      }
    }

    let offsetAttribute =
      new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 );
    let colorAttribute =
      new THREE.InstancedBufferAttribute( new Float32Array( colors ), 4);
    geo.addAttribute( 'offset', offsetAttribute );
    geo.addAttribute( 'color', colorAttribute );



    this.endpoints = new THREE.Mesh(geo, material);
    this.endpoints.frustumCulled = false;

  }

}


export { RawImage, SearchCone };