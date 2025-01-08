import { Transform, TransformCallback, TransformOptions } from 'stream';
interface SampleRateOptions extends TransformOptions {
    type?: number;
    channels?: number;
    fromRate?: number;
    fromDepth?: number;
    toRate?: number;
    toDepth?: number;
}
export declare class SampleRate extends Transform {
    private _samplerate;
    constructor(opts?: SampleRateOptions);
    setRatio(ratio: number): void;
    _final(cb: (error?: Error | null) => void): void;
    _transform(chunk: any, _encoding: BufferEncoding, cb: TransformCallback): void;
}
export declare const SRC_SINC_BEST_QUALITY = 0;
export declare const SRC_SINC_MEDIUM_QUALITY = 1;
export declare const SRC_SINC_FASTEST = 2;
export declare const SRC_ZERO_ORDER_HOLD = 3;
export declare const SRC_LINEAR = 4;
export {};
