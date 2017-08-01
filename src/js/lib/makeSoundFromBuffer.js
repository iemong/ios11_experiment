export default function makeSonudfromBuffer(audioContext, buffers) {
    const newSource = audioContext.createBufferSource();
    const newBuffer = audioContext.createBuffer(2, buffers[0].length, 22050);
    newBuffer.getChannelData(0).set(buffers[0]);
    newBuffer.getChannelData(1).set(buffers[1]);
    newSource.buffer = newBuffer;
    newSource.connect(audioContext.destination);
    newSource.start(0);
}