import isSP from './lib/device';
import MicWaves from './lib/MicWaves';
import MicRecording from './lib/MicRecording';
import locationParams from './lib/locationParams';
import SupportedAudioContext from './lib/SupportedAudioContext';
import { enableButton, disableButton } from './lib/buttonState';
import createAudioElement from './lib/createAudioElement';

const medias = {audio : true, video : false};
const initializeButton = document.querySelector('.js-microphone-button');
const recorderButton = document.querySelector('.js-recorder-button');
const recordedSetup = document.querySelector('.js-recorded-setup');
let audioBlob = null;

const successCallback = (stream) => {
    const audioContext = new SupportedAudioContext();
    const sourceNode = audioContext.createMediaStreamSource(stream);
    if(isSP) {
        initializeButton.addEventListener('touchend', () => {
            init(stream, audioContext, sourceNode);
            initializeButton.style.pointerEvents = 'none';
            initializeButton.style.opacity = 0.5;
        });
    } else {
        initializeButton.addEventListener('click', () => {
            init(stream, audioContext, sourceNode);
            initializeButton.style.pointerEvents = 'none';
            initializeButton.style.opacity = 0.5;
        });
        // recordedSetup.addEventListener('click', () => {
        //     const recodedSource = audioContext.createBufferSource();
        //     recodedSource.connect(audioContext.destination);
        //     recodedSource.start();
        // });
    }
};

const errorCallback = (err) => {
    new Error(err);
};

navigator.mediaDevices.getUserMedia(medias)
    .then(successCallback)
    .catch(errorCallback);

function init (stream, audioContext, sourceNode) {
    const micRecording = new MicRecording({
        type: locationParams.type ? `audio/${locationParams.type}` : null,
        source: sourceNode
    });
    // マイクの音をそのまま波形で出す
    const micWaves = new MicWaves({
        stream: stream,
        audioContext: audioContext,
        sourceNode: sourceNode
    });
    micWaves.draw();

    enableButton();
    if(isSP) {
        recorderButton.addEventListener('touchend', () => {
            recordFunc();
        });
    } else {
        recorderButton.addEventListener('click', () => {
            recordFunc();
        });
    }
    
    function recordFunc () {
        if (!micRecording.rec) {
            disableButton();
            micRecording.start().then(() => {
                enableButton(true);
            });
        } else {
            disableButton();
            Promise.resolve().then(() => {
                return micRecording.stop();
            }).then((blob) => {
                createAudioElement(
                    (window.URL || window.webkitURL).createObjectURL(blob)
                );
                enableButton();
                // blobを吐き出す
                audioBlob = blob;
            });
        }
    }
}

