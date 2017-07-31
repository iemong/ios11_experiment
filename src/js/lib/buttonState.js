const recorderButton = document.querySelector('.js-recorder-button');

export const enableButton = (isPause) => {
    recorderButton.innerHTML = isPause ? '録音停止' : '録音開始';
    recorderButton.style.pointerEvents = '';
    recorderButton.style.opacity = '';
};

export const disableButton = () => {
    recorderButton.style.pointerEvents = 'none';
    recorderButton.style.opacity = 0.5;
};