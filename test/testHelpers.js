const { SampleRate } = require('../index.js');
const { Writable } = require('stream');
const { AudioGenerator } = require('./audioGenerator.js');

let defaultOpts = {
    duration: 5,
    type: 4,
    channels: 2,
    fromRate: 48000,
    fromDepth: 16,
    toRate: 44100,
    toDepth: 16
}

let genFunc = (time) => {
    return [
        Math.sin(Math.PI * 2 * time * 439), //channel 1
        Math.sin(Math.PI * 2 * time * 441), //channel 2
    ]
}

let getResampler = (opts) => {
    return new SampleRate(opts);
}

let getGenerator = (opts) => {
    let generatorOpts = {
        duration: opts.duration,
        bitDepth: opts.fromDepth,
        rate: opts.fromRate,
    }
    return new AudioGenerator(genFunc, generatorOpts);
}

let getNullstream = () => {
    return new Writable({
        write(chunk, encoding, cb) {
            cb();
        },
        final() {
            process.nextTick(() => {
                this.emit('end');
            });
        }
    });
}

let _sincBestAvailability;

let isSincBestAvailable = () => {
    if (_sincBestAvailability !== undefined) {
        return _sincBestAvailability;
    }

    let probeOpts = {
        type: 0,
        channels: 2,
        fromRate: 48000,
        fromDepth: 16,
        toRate: 44100,
        toDepth: 16
    };

    try {
        let probe = new SampleRate(probeOpts);
        probe.destroy();
        _sincBestAvailability = true;
    } catch (err) {
        const message = String(err && err.message);
        if (message.includes('SINC_BEST_QUALITY is not available') || message.includes('Bad converter number')) {
            _sincBestAvailability = false;
        } else {
            throw err;
        }
    }

    return _sincBestAvailability;
}

module.exports = {
    defaultOpts,
    getResampler,
    getGenerator,
    getNullstream,
    isSincBestAvailable
}
