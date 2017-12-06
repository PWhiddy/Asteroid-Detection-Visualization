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
    let bufferGeometry = new THREE.BoxBufferGeometry( 1.0, 1.0, 0.2 );
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


export { RawImage };