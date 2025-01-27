const { Interpolation } = require('../index.js');
const helper = require('./testHelpers');
const assert = require('assert');
const sinon = require('sinon');

describe('SampleRate upconvert tests', function () {

    let resample;
    let gen;
    let nullStream

    afterEach(function () {
        resample.destroy();
        gen.destroy();
        nullStream.destroy();
    });

    it('should upconvert and downsample', function (done) {
        this.timeout(10000);
        let eventSpy = sinon.spy();
        let opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        opts.type = Interpolation.SINC_MEDIUM_QUALITY;
        opts.toDepth = 32;
        let genTotal = 0;
        let resampleTotal = 0;
        let ratio = opts.toRate / opts.fromRate;

        let doAssert = () => {
            // Total samples post resample will be double the size
            resampleTotal = resampleTotal / 2;
            
            let testRatio = resampleTotal / genTotal;
            assert.deepEqual(Number.parseFloat(ratio).toFixed(2), Number.parseFloat(testRatio).toFixed(2));
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
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

    it('should upconvert and upsample', function (done) {
        this.timeout(10000);
        let eventSpy = sinon.spy();
        let opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        opts.type = Interpolation.SINC_MEDIUM_QUALITY;
        opts.toDepth = 32;
        opts.toRate = 88200;
        let genTotal = 0;
        let resampleTotal = 0;
        let ratio = opts.toRate / opts.fromRate;

        let doAssert = () => {
            // Total samples post resample will be double the size
            resampleTotal = resampleTotal / 2;
            
            let testRatio = resampleTotal / genTotal;
            assert.deepEqual(Number.parseFloat(ratio).toFixed(2), Number.parseFloat(testRatio).toFixed(2));
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
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
