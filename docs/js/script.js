(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var medias = { audio: true, video: false };
var audio = document.getElementById('audio');
var canvas = document.querySelector('#canvas');
var drawContext = canvas.getContext('2d');
var cw = canvas.width;
var ch = canvas.height;

// const successCallback = (stream) => {
//     audio.srcObject = stream;
// };
var successCallback = function successCallback(stream) {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();
    var sourceNode = audioContext.createMediaStreamSource(stream);
    var analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    sourceNode.connect(analyserNode);
    sourceNode.connect(audioContext.destination);
    function draw() {
        var barWidth = canvas.width / analyserNode.fftSize;
        var array = new Uint8Array(analyserNode.fftSize);
        analyserNode.getByteTimeDomainData(array);
        drawContext.fillStyle = 'rgba(0, 0, 0, 1)';
        drawContext.fillRect(0, 0, canvas.width, ch);

        for (var i = 0; i < analyserNode.fftSize; ++i) {
            var value = array[i];
            var percent = value / 255;
            var height = canvas.height * percent;
            var offset = canvas.height - height;

            drawContext.fillStyle = 'lime';
            drawContext.fillRect(i * barWidth, offset, barWidth, 2);
        }

        requestAnimationFrame(draw);
    }

    draw();
};

var errorCallback = function errorCallback(err) {
    console.log(err);
};

navigator.mediaDevices.getUserMedia(medias).then(successCallback).catch(errorCallback);

},{}]},{},[1]);
