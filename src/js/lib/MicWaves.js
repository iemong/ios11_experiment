const canvas = document.querySelector('.js-sound-wave');
const drawContext = canvas.getContext('2d');
const cw = canvas.width;
const ch = canvas.height;

export default class MicWaves {
    constructor(opts = {}) {
        this._stream = opts.stream;
        this._audioContext = opts.audioContext;
        this._sourceNode = opts.sourceNode;
        this._analyserNode = null;
        this._init();
        this.draw();
    }
    _init() {
        this._analyserNode = this._audioContext.createAnalyser();
        this._analyserNode.fftSize = 1024;
        this._sourceNode.connect(this._analyserNode);
    }
    draw() {
        const barWidth = cw / this._analyserNode.fftSize;
        const array = new Uint8Array(this._analyserNode.fftSize);
        this._analyserNode.getByteTimeDomainData(array);
        drawContext.fillStyle = 'rgba(0, 0, 0, 1)';
        drawContext.fillRect(0, 0, cw, ch);

        for (let i = 0; i < this._analyserNode.fftSize; i++) {
            const value = array[i];
            const percent = value / 255;
            const height = canvas.height * percent;
            const offset = canvas.height - height;

            drawContext.fillStyle = 'lime';
            drawContext.fillRect(i * barWidth, offset, barWidth, 2);
        }
        window.requestAnimationFrame(() => { this.draw(); });
    }
}