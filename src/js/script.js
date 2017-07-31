import isSP from './lib/device';
import micWave from './lib/micWave';

const medias = {audio : true, video : false};

const successCallback = (stream) => {
    const button = document.getElementById('button');
    if(isSP) {
        button.addEventListener('touchend', () => {
            micWave(stream);
        });
    } else {
        button.addEventListener('click', () => {
            micWave(stream);
        });
    }
};

const errorCallback = (err) => {
    new Error(err);
};

navigator.mediaDevices.getUserMedia(medias)
    .then(successCallback)
    .catch(errorCallback);