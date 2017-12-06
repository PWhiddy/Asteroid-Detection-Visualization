import * as THREE from './three.module.js'; 

class RawImage {

  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.pixelCount = w*h;
    this.buf = new Float32Array(this.pixelCount);
    this.hasMesh = false;
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
      this.buf[i] = this.randomNorm(mean, sigma);
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
 
  makeMesh() {
    this.hasMesh = true;
  }

}


export { RawImage };