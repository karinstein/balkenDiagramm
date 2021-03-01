'use strict';

// VARIABLEN
const body = document.querySelector('body');

// FUNKTIONEN

// const erzeugeZahl = (min, max) => ~~(Math.random()*(max + 1 - min)) + min;

// EVENT-LISTENERS

// INIT

document.addEventListener("DOMContentLoaded", evt => {

    // myCanvas
    const myCanvas = document.querySelector('#myCanvas');
    const ctx = myCanvas.getContext('2d');
    // console.log(document.querySelector('#main').getBoundingClientRect());
    // console.log(document.querySelector('#main').offsetWidth);
    // myCanvas.width = 600;
    myCanvas.width = 0.99*document.querySelector('#main').offsetWidth;
    myCanvas.height = 400;

    // Intermediates
    let w = myCanvas.width, h = myCanvas.height, d = 10;
    // let radius = 0.02*w, dx = 3*radius, dy = 2.5*radius;
    console.log(w,h,d);

    // Buttons
    // const firstButton = document.querySelector('#firstButton');
    // const secondButton = document.querySelector('#secondButton');

    // Header

    // FUNKTIONEN

    const findeMinMax = array => {
      let minVal = 10e7, maxVal = -10e7;
      array.forEach((item, ind) => {
          if (item > maxVal) maxVal = item;
          if (item < minVal) minVal = item;
      });
      let k = (w - 3*d)/(maxVal - minVal);
      let b = d - k*minVal;
      return {
        minVal: minVal,
        maxVal: maxVal,
        k: k,
        b: b
      }
    }

    // let val = k*i + b;
    // ctx.fillRect(val, h-30, 10,-20*elem);

    const zeichneEinfachesDiagramm = array => {
        ctx.clearRect(0, 0, w, h);
        let arrayNorm = findeMinMax(array);
        let k = arrayNorm.k, b = arrayNorm.b;
        let minVal = arrayNorm.minVal, maxVal = arrayNorm.maxVal;
        console.log(arrayNorm);
        ctx.fillStyle = 'green';
        array.forEach((elem, i) => {
            // einfaches Zeichen
            let val = k*elem + b;
            ctx.fillRect(val, h-30, 10, -h);
            // console.log(elem,val);
        });
        ctx.font = "20px Arial";
        ctx.fillStyle = 'black';
        ctx.fillText(`${minVal}`, 0, h);
        let txt = `${maxVal}`;
        ctx.fillText(txt, w-ctx.measureText(txt).width, h);
    }

    const zeichneDiagramm = binnedArray => {
        let dataMap = binnedArray.binnedMap;
        for (const [key, value] of Object.entries(dataMap)) {
            console.log(`${key}: ${value}`);
        }
    }

    const bereiteDatenVor = (array,nBins,xMin,xMax) => {
        // if not specified, use the whole data range to find min and max values
        if (!xMin || !xMax) {
           let minMax = findeMinMax(array);
           xMin = minMax.minVal;
           xMax = minMax.maxVal+1;
        }
        console.log(nBins,xMin,xMax);

        // initialize binned data array
        // versuche später mit Map
        let binnedArrayX = new Array(nBins);
        let binnedArrayY = new Array(nBins);
        let binnedMap = {};
        for (let i=0; i<nBins; i++){
          binnedArrayY[i] = 0;
        }

        // fill in binned data array
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

    const manageData = json => {
        // let arr = Array.from(json).slice(0,10);
        let arr = json.slice(0,50);
        // console.log(arr);
        let binnedArray = bereiteDatenVor(arr,20);
        console.log(binnedArray);
        zeichneEinfachesDiagramm(arr);
        zeichneDiagramm(binnedArray);
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
        .catch(function () {
            console.log('Some unknown error...');;
        })
    }


    const init = () => {
        readJson();
    }

    // EVENT-LISTENERS

    // INIT
    init();

});
