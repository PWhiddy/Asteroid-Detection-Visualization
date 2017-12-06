import * as THREE from './three.module.js'; 

class RawImage {

  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.pixelCount = w*h;
    this.buf = new Float32Array(this.pixelCount);
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
  	  this.buf[i] = randomNorm(mean, sigma);
  	}
  }

  makeMesh() {
  	let 
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

}

function loadShaders(vertexSource, fragmentSource) {
  // Asynchronicity is pain :(
  let vertLoaded = false;
  let fragLoaded = false;
  let continued = false;
  let vs = '';
  let fs = '';

  let vertLoader = new XMLHttpRequest();
  vertLoader.open("GET", vertexSource, false);
  vertLoader.onreadystatechange = function() {
  	if (vertLoader.readyState === 4) {
  	  vs = vertLoader.responseText;
  	  vertLoaded = true;
  	  if (vertLoaded && fragLoaded && !continued) {
  	    initMaterial(vs,fs);
  		continued = true;
  	  }
  	}
  }

  let fragLoader = new XMLHttpRequest();
  fragLoader.open("GET", fragmentSource, false);
  fragLoader.onreadystatechange = function() {
  	if (fragLoader.readyState === 4) {
  	  fs = fragLoader.responseText;
  	  fragLoaded = true;
  	  if (vertLoaded && fragLoaded && !continued) {
  	    initMaterial(vs, fs);
  	    continued = true;
  	  }
  	}
  }

}

function initMaterial(vs, fs) {
  
}


export { RawImage };