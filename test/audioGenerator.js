const { Readable } = require('stream');

function signed (n) {
    if (isNaN(n)) return 0;
    let b = Math.pow(2, 15);
    return n > 0
        ? Math.min(b - 1, Math.floor((b * n) - 1))
        : Math.max(-b, Math.ceil((b * n) - 1))
    ;
}

class AudioGenerator extends Readable {
    constructor(fn, opts) {
        super();
        this.readable = true;
        this.rate = opts.rate || 44000;
        this.byteDepth = opts.bitDepth / 8;
        this.duration = opts.duration;
        this._fn = fn;
        this.t = 0;
        this.i = 0;
        this._ticks = 0;
    }

    _read(bytes) {
        if (!bytes) bytes = 4096;

        const buf = Buffer.alloc(Math.floor(bytes));
        function clamp (x) {
            return Math.max(Math.min(x, Math.pow(2,15)-1), -Math.pow(2,15));
        }

        for (let i = 0; i < buf.length; i += this.byteDepth) {
            let t = this.t + Math.floor(i / this.byteDepth) / this.rate;
            let counter = this.i + Math.floor(i / this.byteDepth);

            let n = this._fn(t, counter);
            if (isNaN(n)) n = 0;
            n = clamp(signed(n))
            switch (this.bitDepth) {
                case 8:
                    buf.writeInt8(n, i);
                    break;
                case 16:
                    buf.writeInt16LE(n, i);
                    break;
                case 32:
                    buf.writeInt32LE(n, i);
                    break;
            }
        }

        this.i += buf.length / this.byteDepth;
        this.t += buf.length / this.byteDepth / this.rate;

        this._ticks ++;
        if (!this._ended) {
            if (this._ticks % 50)
                this.push(buf);
            else
                process.nextTick(() => this.push(buf));
            if (this.t >= this.duration)
                this.end();
        }
    }

    end() {
        this._ended = true;
        super.push(null);
    }
}

module.exports = {
  AudioGenerator
};
