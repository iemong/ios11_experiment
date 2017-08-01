import { enableButton, disableButton } from './buttonState';
import createAudioElement from './createAudioElement';

export default function controlRecording (micRecording) {
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
}