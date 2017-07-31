(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// UA
var userAgent = navigator.userAgent;
var isSP = userAgent.indexOf('iPhone') >= 0 || userAgent.indexOf('iPad') >= 0 || userAgent.indexOf('Android') >= 0;
exports.default = isSP;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = micWave;
var canvas = document.querySelector('#canvas');
var drawContext = canvas.getContext('2d');
var cw = canvas.width;
var ch = canvas.height;

function micWave(stream) {
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var sourceNode = audioContext.createMediaStreamSource(stream);
    var analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 1024;
    sourceNode.connect(analyserNode);
    var draw = function draw() {
        var barWidth = canvas.width / analyserNode.fftSize;
        var array = new Uint8Array(analyserNode.fftSize);
        analyserNode.getByteTimeDomainData(array);
        drawContext.fillStyle = 'rgba(0, 0, 0, 1)';
        drawContext.fillRect(0, 0, cw, ch);

        for (var i = 0; i < analyserNode.fftSize; ++i) {
            var value = array[i];
            var percent = value / 255;
            var height = canvas.height * percent;
            var offset = canvas.height - height;

            drawContext.fillStyle = 'lime';
            drawContext.fillRect(i * barWidth, offset, barWidth, 2);
        }

        requestAnimationFrame(draw);
    };
    draw();
}

},{}],3:[function(require,module,exports){
'use strict';

var _device = require('./lib/device');

var _device2 = _interopRequireDefault(_device);

var _micWave = require('./lib/micWave');

var _micWave2 = _interopRequireDefault(_micWave);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var medias = { audio: true, video: false };

var successCallback = function successCallback(stream) {
    var button = document.getElementById('button');
    if (_device2.default) {
        button.addEventListener('touchend', function () {
            (0, _micWave2.default)(stream);
        });
    } else {
        button.addEventListener('click', function () {
            (0, _micWave2.default)(stream);
        });
    }
};

var errorCallback = function errorCallback(err) {
    new Error(err);
};

navigator.mediaDevices.getUserMedia(medias).then(successCallback).catch(errorCallback);

},{"./lib/device":1,"./lib/micWave":2}]},{},[3]);
