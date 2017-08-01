import EventEmitter from 'events';
import Recorder from './recorderjs';
import SupportedAudioContext from './SupportedAudioContext';

export default class MicRecording extends EventEmitter {
    constructor (opts = {}) {
        super();
        this.type = opts.type || 'audio/wav';
        this.sourceNode = opts.source;
        this.recordedBuffers = null;
    }

    start () {
        return new Promise((resolve, reject) => {
            const input = this.sourceNode;
            const rec = new Recorder(input, {
                sampleRate: 16000,
                scale: 1
            });
            rec.record();
            this.rec = rec;
            resolve();
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
                rec.getBuffer((buffers) => {
                    this.recordedBuffers = buffers;
                });
                resolve(blob);
            }, this.type);
        });
    }
    getRecodedBuffers() {
        return this.recordedBuffers;
    }
}
