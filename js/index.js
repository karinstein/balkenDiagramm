'use strict';

// VARIABLEN
const body = document.querySelector('body');

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
            console.log('dx: ',dx);
            ctx.fillRect(xVal, h-30, 0.9*kX*dx, -yVal);
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
        let arr = json.slice(0,10000);
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
