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
    window.addEventListener('click touchend', () => {
        ocillatorNode.start();
    });
};

const errorCallback = (err) => {
    console.log(err);
};

navigator.mediaDevices.getUserMedia(medias)
    .then(successCallback)
    .catch(errorCallback);