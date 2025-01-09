import { Transform, TransformCallback, TransformOptions } from 'stream';
import bindings from 'bindings';
const { SampleRateStream } = bindings('node-libsamplerate');

interface SampleRateOptions extends TransformOptions {
    type?: number;
    channels?: number;
    fromRate?: number;
    fromDepth?: number;
    toRate?: number;
    toDepth?: number;
}

declare class TSampleRateStream {
    constructor(opts: SampleRateOptions);
    setRatio(ratio: number): void;
    reset(): void;
    transform(chunk: any): any;
}

let defaultOpts: SampleRateOptions = {
    type: 2,
    channels: 2,
    fromRate: 48000,
    fromDepth: 16,
    toRate: 44100,
    toDepth: 16
};

export class SampleRate extends Transform {
    private _samplerate: TSampleRateStream;

    constructor(opts?: SampleRateOptions) {
        opts ||= defaultOpts;
        if (!(opts.fromDepth == 16 || opts.fromDepth == 32))
            throw new Error('Invalid source bit depth');
        if (!(opts.toDepth == 16 || opts.toDepth == 32))
            throw new Error('Invalid target bit depth');
        super(opts);
        this._samplerate = new SampleRateStream(opts);
    }

    setRatio(ratio: number) {
        this._samplerate.setRatio(ratio);
    }

    _final(cb: (error?: Error | null) => void): void {
        process.nextTick(() => {
            this._samplerate.reset();
        });
        cb();
    }

    _transform(chunk: any, _encoding: BufferEncoding, cb: TransformCallback) {
        this.push(this._samplerate.transform(chunk));
        cb();
    }
}

export const Interpolation = {
    SINC_BEST_QUALITY: 0,
    SINC_MEDIUM_QUALITY: 1,
    SINC_FASTEST: 2,
    ZERO_ORDER_HOLD: 3,
    LINEAR: 4
};
