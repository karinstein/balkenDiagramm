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

    const zeichneDiagramm = array => {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'green';
        ctx.fillRect(10, 10, 10, h);
        // ctx.stroke();
        // if (fillStyle) {
        //     ctx.fillStyle = fillStyle;
        //     ctx.fill();
        // }
        let arrayNorm = findeMinMax(array);
        let k = arrayNorm.k, b = arrayNorm.b;
        array.forEach((elem, ind) => {
            ctx.fillStyle = 'green';
            let val = k*elem + b;
            ctx.fillRect(val, 10, 10, h);
            console.log(elem,val);
        });
        // ctx.beginPath();
        // ctx.moveTo(20, 20);
        // ctx.lineTo(20, 100);
        // ctx.lineTo(70, 100);
        // ctx.strokeStyle = "red";
        // ctx.stroke();
    }

    const manageData = json => {
        // let arr = Array.from(json).slice(0,10);
        let arr = json.slice(0,50);
        console.log(arr);
        zeichneDiagramm(arr);
    }


    const readJson = () => {
        // fetch('./data/gerichte.json')
        fetch('./data/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            console.log(response);
            return response.json();
        })
        .then(json => {
            manageData(json);
        })
        .catch(function () {
            console.log('Some fetch error...');;
        })
    }


    const init = () => {
        readJson();
    }

    // EVENT-LISTENERS
    // myCanvas.addEventListener('click', naechsterZug);

    // INIT
    init();

});
