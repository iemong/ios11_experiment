import isSP from './lib/device';
import micWave from './lib/micWave';
import MicRecording from './lib/MicRecording';
import locationParams from './lib/locationParams';
import SupportedAudioContext from './lib/SupportedAudioContext';

const medias = {audio : true, video : false};
const recorderButton = document.querySelector('.js-recorder-button');
const listRoot = document.querySelector('.js-list-root');
const button = document.querySelector('.js-microphone-button');

const successCallback = (stream) => {
    if(isSP) {
        button.addEventListener('touchend', () => {
            init(stream);
        });
    } else {
        button.addEventListener('click', () => {
            init(stream);
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

    micWave(stream, audioContext, sourceNode);

    const micRecording = new MicRecording({
        type: locationParams.type ? `audio/${locationParams.type}` : null,
        source: sourceNode
    });
    
    recorderButton.addEventListener('click', () => {
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
            });
        }
    });
    enableButton();
}

function createAudioElement (url) {
    const li = document.createElement('li');
    listRoot.appendChild(li);
    
    const audio = new Audio(url);
    audio.controls = true;
    li.appendChild(audio);

    li.appendChild(document.createElement('br'));

    const downloadLink = document.createElement('a');
    downloadLink.innerHTML = 'download';
    downloadLink.href = url;
    downloadLink.download = 'output.wav';
    li.appendChild(downloadLink);
}

function enableButton (isPause) {
    recorderButton.innerHTML = isPause ? '録音停止' : '録音開始';
    recorderButton.style.pointerEvents = '';
    recorderButton.style.opacity = '';
}

function disableButton () {
    recorderButton.style.pointerEvents = 'none';
    recorderButton.style.opacity = 0.5;
}
