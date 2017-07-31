const medias = {audio : true, video : false};
const audio = document.getElementById('audio');
const canvas = document.querySelector('#canvas');
const drawContext = canvas.getContext('2d');
const cw = canvas.width;
const ch = canvas.height;

// UA
const userAgent = navigator.userAgent;
const isSP = userAgent.indexOf('iPhone') >= 0 || userAgent.indexOf('iPad') >= 0 || userAgent.indexOf('Android') >= 0;

const showRealTimeWave = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext);
    const sourceNode = audioContext.createMediaStreamSource(stream);
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
};

const successCallback = (stream) => {
    const button = document.getElementById('button');
    if(isSP) {
        button.addEventListener('touchend', () => {
            showRealTimeWave(stream);
        });
    } else {
        button.addEventListener('click', () => {
            showRealTimeWave(stream);
        });
    }
    
};

const errorCallback = (err) => {
    console.log(err);
};

navigator.mediaDevices.getUserMedia(medias)
    .then(successCallback)
    .catch(errorCallback);