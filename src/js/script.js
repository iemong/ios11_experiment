import isSP from './lib/device';
import micWave from './lib/micWave';
import MicRecording from './lib/MicRecording';
import locationParams from './lib/locationParams';
import SupportedAudioContext from './lib/SupportedAudioContext';
import { enableButton, disableButton } from './lib/buttonState';
import controlRecording from './lib/controlRecording';
import makeSonudfromBuffer from './lib/makeSoundFromBuffer';
import MicWaves from './lib/MicWaves';

const medias = {audio : true, video : false};
const initializeButton = document.querySelector('.js-microphone-button');
const recorderButton = document.querySelector('.js-recorder-button');
const recordedSetup = document.querySelector('.js-recorded-setup');
const currentCanvas = document.querySelector('.js-sound-wave');

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
    const micWaves = new MicWaves({
        audioContext: audioContext,
        sourceNode: sourceNode,
        canvas: currentCanvas
    });

    enableButton();
    if (isSP) {
        touchend();
    } else {
        click();
    }

    function click() {
        recorderButton.addEventListener('click', () => {
            controlRecording(micRecording);
        });
        recordedSetup.addEventListener('click', () => {
            makeSonudfromBuffer(
                audioContext, 
                micRecording.getRecodedBuffers()
            );
        });
    }
    function touchend() {
        recorderButton.addEventListener('touchend', () => {
            controlRecording(micRecording);
        });
        recordedSetup.addEventListener('touchend', () => {
            makeSonudfromBuffer(
                audioContext, 
                micRecording.getRecodedBuffers()
            );
        });
    }
}