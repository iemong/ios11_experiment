const medias = {audio : true, video : false};
const audio = document.getElementById('audio');
const canvas = document.querySelector('#canvas');
const drawContext = canvas.getContext('2d');
const cw = canvas.width;
const ch = canvas.height;

// const successCallback = (stream) => {
//     audio.srcObject = stream;
// };

const successCallback = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext);
    const sourceNode = audioContext.createMediaStreamSource(stream);
    const analyserNode = audioContext.createAnalyser();
    const ocillatorNode = audioContext.createOscillator();
    analyserNode.fftSize = 2048;
    ocillatorNode.connect(audioContext.destination);
    ocillatorNode.frequency.value = 440;
    ocillatorNode.start();
    function draw() {
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
    }

    draw();
};

const errorCallback = (err) => {
    console.log(err);
};

navigator.mediaDevices.getUserMedia(medias)
    .then(successCallback)
    .catch(errorCallback);