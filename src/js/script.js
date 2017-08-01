import isSP from './lib/device';
import micWave from './lib/micWave';
import MicRecording from './lib/MicRecording';
import locationParams from './lib/locationParams';
import SupportedAudioContext from './lib/SupportedAudioContext';
import { enableButton, disableButton } from './lib/buttonState';
import controlRecording from './lib/controlRecording';

const medias = {audio : true, video : false};
const initializeButton = document.querySelector('.js-microphone-button');
const recorderButton = document.querySelector('.js-recorder-button');
const recordedSetup = document.querySelector('.js-recorded-setup');

const successCallback = (stream) => {
    if(isSP) {
        initializeButton.addEventListener('touchend', () => {
            init(stream);
            initializeButton.style.pointerEvents = 'none';
            initializeButton.style.opacity = 0.5;
        });
    } else {
        initializeButton.addEventListener('click', () => {
            init(stream);
            initializeButton.style.pointerEvents = 'none';
            initializeButton.style.opacity = 0.5;
        });
    }
};

const errorCallback = (err) => {
    new Error(err);
};

navigator.mediaDevices.getUserMedia(medias)
    .then(successCallback)
    .catch(errorCallback);

function init (stream) {
    const audioContext = new SupportedAudioContext();
    const sourceNode = audioContext.createMediaStreamSource(stream);

    const micRecording = new MicRecording({
        type: locationParams.type ? `audio/${locationParams.type}` : null,
        source: sourceNode
    });
    // マイクの音をそのまま波形で出す
    micWave(stream, audioContext, sourceNode);

    enableButton();
    if (isSP) {
        recorderButton.addEventListener('touchend', () => {
            controlRecording(micRecording);
        });
    } else {
        recorderButton.addEventListener('click', () => {
            controlRecording(micRecording);
        });
    }
    recordedSetup.addEventListener('click', () => {
        makeSonudfromBuffer(micRecording.getRecodedBuffers());
    });
    
    function makeSonudfromBuffer( buffers ) {
        const newSource = audioContext.createBufferSource();
        const newBuffer = audioContext.createBuffer(2, buffers[0].length, 22050);
        newBuffer.getChannelData(0).set(buffers[0]);
        newBuffer.getChannelData(1).set(buffers[1]);
        newSource.buffer = newBuffer;
        newSource.connect(audioContext.destination);
        newSource.start(0);
    }
}