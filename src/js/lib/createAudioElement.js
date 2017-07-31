const listRoot = document.querySelector('.js-list-root');

export default function createAudioElement (url) {
    const li = document.createElement('li');
    listRoot.appendChild(li);
    
    const audio = new Audio(url);
    audio.controls = true;
    audio.classList.add('js-recorded-sound');
    li.appendChild(audio);

    li.appendChild(document.createElement('br'));

    const downloadLink = document.createElement('a');
    downloadLink.innerHTML = 'download';
    downloadLink.href = url;
    downloadLink.download = 'output.wav';
    li.appendChild(downloadLink);
}