export default class MicWaves {
    constructor(opts={}){
        this._audioContext = opts.audioContext;
        this._sourceNode = opts.sourceNode;
        this._analyserNode = null;
        this._canvas = opts.canvas;
        this._drawContext = this._canvas.getContext('2d');
        this._cw = this._canvas.width;
        this._ch = this._canvas.height;
        this._init();
    }
    _init() {
        this._analyserNode = this._audioContext.createAnalyser();
        this._analyserNode.fftSize = 1024;
        this._sourceNode.connect(this._analyserNode);
        this._draw();
    }
    _draw() {
        const barWidth = this._cw / this._analyserNode.fftSize;
        const array = new Uint8Array(this._analyserNode.fftSize);
        this._analyserNode.getByteTimeDomainData(array);
        this._drawContext.fillStyle = 'rgba(0, 0, 0, 1)';
        this._drawContext.fillRect(0, 0, this._cw, this._ch);

        for (let i = 0; i < this._analyserNode.fftSize; ++i) {
            const value = array[i];
            const percent = value / 255;
            const height = this._ch * percent;
            const offset = this._ch - height;

            this._drawContext.fillStyle = 'lime';
            this._drawContext.fillRect(i * barWidth, offset, barWidth, 2);
        }
        requestAnimationFrame(() => {
            this._draw();
        });
    }
}