import EventEmitter from 'events';
import Recorder from './recorderjs';
import SupportedAudioContext from './SupportedAudioContext';

export default class MicRecording extends EventEmitter {
    constructor (opts = {}) {
        super();
        this.type = opts.type || 'audio/wav';
    }

    start () {
        return new Promise((resolve, reject) => {
            navigator.getUserMedia({
                video: false,
                audio: true
            }, (stream) => {
                const audioContext = new SupportedAudioContext();
                const input = audioContext.createMediaStreamSource(stream);
                // TODO: lowpass filter噛ませたほうがいい
                
                const rec = new Recorder(input, {
                    sampleRate: 16000,
                    scale: 2
                });
                rec.record();
                this.rec = rec;
                resolve();
            }, (err) => {
                reject(new Error('fail in recording.'));
            });
        });
    }

    stop () {
        return new Promise((resolve, reject) => {
            const rec = this.rec;
            if (!rec) {
                reject();
                return;
            }
            
            rec.stop();

            rec.exportWAV((blob) => {
                this.rec = null;
                resolve(blob);
            }, this.type);
        });
    }
};
