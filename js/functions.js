'use strict';

// FUNKTIONEN

// finds min and max values for an array
const findeMinMax = array => {
  let minVal = 10e7, maxVal = -10e7;
  array.forEach((item, ind) => {
      if (item > maxVal) maxVal = item;
      if (item < minVal) minVal = item;
  });
  return {
    minVal: minVal,
    maxVal: maxVal
  }
}

// finds normalization koefficients for a given value range and a canvas range
const koeffX = (xMin,xMax,x1,x2) => {
    let k = (x2 - x1)/(xMax - xMin);
    let b = x1 - k*xMin;
    return {
        k: k,
        b: b
    }
}

// makes binned array out of a simple data array with given xMin, xMax and nBins
const bereiteDatenVor = (array,nBins,xMin,xMax) => {
    // console.log(nBins,xMin,xMax);
    // initialize binned data array
    let binnedArrayX = new Array(nBins);
    let binnedArrayY = new Array(nBins);
    let binnedMap = {};
    for (let i=0; i<nBins; i++){
      binnedArrayY[i] = 0;
    }

    // fill in binned data array
    xMax++;
    let dx = (xMax - xMin)/nBins;
    array.forEach(xi => {
        let i = ~~((xi-xMin)/dx);
        binnedArrayY[i]++;
    });
    for (let i=0; i<nBins; i++){
        let xi0 = xMin + i*dx;
        console.log(i,xi0);
        binnedMap[xi0] = binnedArrayY[i];
        binnedArrayX[i] = xi0;
    }
    return {
      binnedArrayX: binnedArrayX,
      binnedArrayY: binnedArrayY,
      binnedMap: binnedMap,
      nBins: nBins,
      xMin: xMin,
      xMax: xMax,
      dx: dx
    };
}

// const erzeugeZahl = (min, max) => ~~(Math.random()*(max + 1 - min)) + min;
