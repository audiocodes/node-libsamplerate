const { SampleRate, SRC_SINC_MEDIUM_QUALITY } = require('../index.js');
const fs = require('fs');
const header = require('./waveheader.js');


let options = {
    type: SRC_SINC_MEDIUM_QUALITY,
    channels: 2, 
    fromRate: 44100, 
    fromDepth: 16,
    toRate: 48000, 
    toDepth: 32
}

const resample = new SampleRate(options);
// Start read at byte 44 to avoid WAV header data
let rs = fs.createReadStream('infile.wav', {start: 44});
let ws = fs.createWriteStream('outfile.wav');

ws.write(header(0, {
    bitDepth: options.toDepth,
    sampleRate: options.toRate,
    channels: options.channels
}));


resample.on('pipe', () => {
    console.log('PIPE Event')
})
resample.on('unpipe', () => {
    console.log('UNPIPE Event')
})
resample.on('finish', () => {
    console.log('FINISH Event ')
})

resample.on('error', () => {
    console.log('ERROR Event ')
})
resample.on('end', () => {
    console.log('END Event')
    ws.end();
})

rs.pipe(resample).pipe(ws);
