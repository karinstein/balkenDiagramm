'use strict';

// VARIABLEN
const body = document.querySelector('body');

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

// EVENT-LISTENERS

// INIT

document.addEventListener("DOMContentLoaded", evt => {

    // myCanvas
    const myCanvas = document.querySelector('#myCanvas');
    const ctx = myCanvas.getContext('2d');
    // console.log(document.querySelector('#main').getBoundingClientRect());
    myCanvas.width = 0.99*document.querySelector('#main').offsetWidth;
    myCanvas.height = 400;

    // Intermediates
    let w = myCanvas.width, h = myCanvas.height, d = 10;
    // console.log(w,h,d);

    // Buttons
    // const firstButton = document.querySelector('#firstButton');
    // const secondButton = document.querySelector('#secondButton');

    // FUNKTIONEN

// plots all data points as a rectangle diagram
    const zeichneEinfachesDiagramm = (array,minVal,maxVal) => {
        ctx.clearRect(0, 0, w, h);
        let linKoeff = koeffX(minVal,maxVal,d,w-2*d);
        let k = linKoeff.k, b = linKoeff.b;
        ctx.fillStyle = 'green';
        array.forEach((elem, i) => {
            let val = k*elem + b;
            ctx.fillRect(val, h-30, 10, -h);
        });
        ctx.font = "20px Arial";
        ctx.fillStyle = 'black';
        ctx.fillText(`${minVal}`, 0, h);
        let txt = `${maxVal}`;
        ctx.fillText(txt, w-ctx.measureText(txt).width, h);
    }

// draws binned array as a rectangle diagram
    const zeichneDiagramm = binnedArray => {
        ctx.clearRect(0, 0, w, h);
        let dataMap = binnedArray.binnedMap;
        let xMin = binnedArray.xMin;
        let xMax = binnedArray.xMax;
        let dx = binnedArray.dx;

        // resize in the X-dimention
        let linKoeffX = koeffX(xMin,xMax,d,w-2*d);
        let kX = linKoeffX.k, bX = linKoeffX.b;

        // resize in the Y-dimention
        let minMaxY = findeMinMax(binnedArray.binnedArrayY);
        let linKoeffY = koeffX(minMaxY.minVal,minMaxY.maxVal,0,h);
        let kY = linKoeffY.k, bY = linKoeffY.b;

        ctx.fillStyle = 'green';

        for (const [key, value] of Object.entries(dataMap)) {
            console.log(`${key}: ${value}`);
            let xVal = kX*key + bX;
            let yVal = kY*value + bY;
            console.log(xVal);
            ctx.fillRect(xVal, h-30, 2*d, -yVal);
        }
        ctx.font = "20px Arial";
        ctx.fillStyle = 'black';
        ctx.fillText(`${xMin}`, 0, h);
        let txt = `${xMax}`;
        ctx.fillText(txt, w-ctx.measureText(txt).width, h);
        ctx.fillText(`${minMaxY.maxVal}`, 0, 2*d);
    }

    const manageData = json => {
        // let arr = Array.from(json).slice(0,10);
        let arr = json.slice(0,100);
        let minMax = findeMinMax(arr);
        // zeichneEinfachesDiagramm(arr,minMax.minVal,minMax.maxVal);
        let binnedArray = bereiteDatenVor(arr,20,minMax.minVal,minMax.maxVal);
        zeichneDiagramm(binnedArray);
        console.log(binnedArray);
    }


    const readJson = () => {
        fetch('./data/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            // console.log(response);
            return response.json();
        })
        .then(json => {
            manageData(json);
        })
        // .catch(function () {
        //     console.log('Some unknown error...');;
        // })
    }

    // EVENT-LISTENERS

    // INIT
    readJson();

});
