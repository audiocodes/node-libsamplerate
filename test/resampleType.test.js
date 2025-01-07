const SampleRate = require('../index.js');
const helper = require('./testHelpers');
const assert = require('assert');
const sinon = require('sinon');

describe('SampleRate resample type', function () {

    let resample;
    let gen;
    let nullStream

    afterEach(function () {
        resample.destroy();
        gen.destroy();
        nullStream.destroy();
    });

    it('should resample witn SRC_SINC_BEST_QUALITY', function (done) {
        this.timeout(10000);
        let eventSpy = sinon.spy();
        let opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        opts.type = SampleRate.SRC_SINC_BEST_QUALITY;
        let genTotal = 0;
        let resampleTotal = 0;
        let ratio = opts.toRate / opts.fromRate;

        let doAssert = () => {
            let testRatio = resampleTotal / genTotal;
            assert.deepEqual(Number.parseFloat(ratio).toFixed(2), Number.parseFloat(testRatio).toFixed(2));
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
            assert(eventSpy.calledOnce, 'Event fired more than once');
            done();
        }
        
        resample = helper.getResampler(opts);
        gen = helper.getGenerator(opts);
        nullStream = helper.getNullstream();
        
        gen.on('end', () => {
            resample.end();
        });

        gen.on('data', (data) => {
            genTotal += data.length;
        });

        resample.on('data', (data) => {
            resampleTotal += data.length;
        })

        nullStream.on('end', doAssert);

        resample.on('end', () => {
            eventSpy();
        });

        gen.pipe(resample).pipe(nullStream);
    });

    it('should resample witn SRC_SINC_MEDIUM_QUALITY', function (done) {
        this.timeout(10000);
        let eventSpy = sinon.spy();
        let opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        opts.type = SampleRate.SRC_SINC_MEDIUM_QUALITY;
        let genTotal = 0;
        let resampleTotal = 0;
        let ratio = opts.toRate / opts.fromRate;

        let doAssert = () => {
            let testRatio = resampleTotal / genTotal;
            assert.deepEqual(Number.parseFloat(ratio).toFixed(2), Number.parseFloat(testRatio).toFixed(2));
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
            assert(eventSpy.calledOnce, 'Event fired more than once');
            done();
        }
        
        resample = helper.getResampler(opts);
        gen = helper.getGenerator(opts);
        nullStream = helper.getNullstream();
        
        gen.on('end', () => {
            resample.end();
        });

        gen.on('data', (data) => {
            genTotal += data.length;
        });

        resample.on('data', (data) => {
            resampleTotal += data.length;
        })

        nullStream.on('end', doAssert);

        resample.on('end', () => {
            eventSpy();
        });

        gen.pipe(resample).pipe(nullStream);
    });

    it('should resample witn SRC_SINC_FASTEST', function (done) {
        this.timeout(10000);
        let eventSpy = sinon.spy();
        let opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        opts.type = SampleRate.SRC_SINC_FASTEST;
        let genTotal = 0;
        let resampleTotal = 0;
        let ratio = opts.toRate / opts.fromRate;

        let doAssert = () => {
            let testRatio = resampleTotal / genTotal;
            assert.deepEqual(Number.parseFloat(ratio).toFixed(2), Number.parseFloat(testRatio).toFixed(2));
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
            assert(eventSpy.calledOnce, 'Event fired more than once');
            done();
        }
        
        resample = helper.getResampler(opts);
        gen = helper.getGenerator(opts);
        nullStream = helper.getNullstream();
        
        gen.on('end', () => {
            resample.end();
        });

        gen.on('data', (data) => {
            genTotal += data.length;
        });

        resample.on('data', (data) => {
            resampleTotal += data.length;
        })

        nullStream.on('end', doAssert);

        resample.on('end', () => {
            eventSpy();
        });

        gen.pipe(resample).pipe(nullStream);
    });

    it('should resample witn SRC_ZERO_ORDER_HOLD', function (done) {
        this.timeout(10000);
        let eventSpy = sinon.spy();
        let opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        opts.type = SampleRate.SRC_ZERO_ORDER_HOLD;
        let genTotal = 0;
        let resampleTotal = 0;
        let ratio = opts.toRate / opts.fromRate;

        let doAssert = () => {
            let testRatio = resampleTotal / genTotal;
            assert.deepEqual(Number.parseFloat(ratio).toFixed(2), Number.parseFloat(testRatio).toFixed(2));
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
            assert(eventSpy.calledOnce, 'Event fired more than once');
            done();
        }
        
        resample = helper.getResampler(opts);
        gen = helper.getGenerator(opts);
        nullStream = helper.getNullstream();
        
        gen.on('end', () => {
            resample.end();
        });

        gen.on('data', (data) => {
            genTotal += data.length;
        });

        resample.on('data', (data) => {
            resampleTotal += data.length;
        })

        nullStream.on('end', doAssert);

        resample.on('end', () => {
            eventSpy();
        });

        gen.pipe(resample).pipe(nullStream);
    });

    it('should resample witn SRC_LINEAR', function (done) {
        this.timeout(10000);
        let eventSpy = sinon.spy();
        let opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        opts.type = SampleRate.SRC_LINEAR;
        let genTotal = 0;
        let resampleTotal = 0;
        let ratio = opts.toRate / opts.fromRate;

        let doAssert = () => {
            let testRatio = resampleTotal / genTotal;
            assert.deepEqual(Number.parseFloat(ratio).toFixed(2), Number.parseFloat(testRatio).toFixed(2));
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
            assert(eventSpy.calledOnce, 'Event fired more than once');
            done();
        }
        
        resample = helper.getResampler(opts);
        gen = helper.getGenerator(opts);
        nullStream = helper.getNullstream();
        
        gen.on('end', () => {
            resample.end();
        });

        gen.on('data', (data) => {
            genTotal += data.length;
        });

        resample.on('data', (data) => {
            resampleTotal += data.length;
        })

        nullStream.on('end', doAssert);

        resample.on('end', () => {
            eventSpy();
        });

        gen.pipe(resample).pipe(nullStream);
    });

});