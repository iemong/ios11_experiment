const canvas = document.querySelector('.js-sound-wave');
const drawContext = canvas.getContext('2d');
const cw = canvas.width;
const ch = canvas.height;

export default function micWave (stream, audioContext, sourceNode){
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 1024;
    sourceNode.connect(analyserNode);

    const draw = () => {
        const barWidth = canvas.width / analyserNode.fftSize;
        const array = new Uint8Array(analyserNode.fftSize);
        analyserNode.getByteTimeDomainData(array);
        drawContext.fillStyle = 'rgba(0, 0, 0, 1)';
        drawContext.fillRect(0, 0, cw, ch);

        for (let i = 0; i < analyserNode.fftSize; ++i) {
            const value = array[i];
            const percent = value / 255;
            const height = canvas.height * percent;
            const offset = canvas.height - height;

            drawContext.fillStyle = 'lime';
            drawContext.fillRect(i * barWidth, offset, barWidth, 2);
        }
        requestAnimationFrame(draw);
    };
    draw();
}