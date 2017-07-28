const medias = {audio : false, video : true};
const video = document.getElementById('video');


const successCallback = (stream) => {
    video.srcObject = stream;
};

const errorCallback = (err) => {
    alert(err);
};

navigator.mediaDevices.getUserMedia(medias, successCallback, errorCallback);