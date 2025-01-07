const helper = require('./testHelpers');
const assert = require('assert');
const sinon = require('sinon');



describe('SampleRate misc tests', function () {

    let resample;
    let gen;
    let nullStream;

    afterEach(function () {

    });

    it('should apply new ratio', function (done) {
        this.timeout(10000);
        let eventSpy = sinon.spy();
        let opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        let genTotal = 0;
        let resampleTotal = 0;
        let ratio = 0.5;

        let doAssert = () => {
            let testRatio = resampleTotal / genTotal;
            assert.deepEqual(Number.parseFloat(ratio).toFixed(2), Number.parseFloat(testRatio).toFixed(2));
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
            assert(eventSpy.calledOnce, 'Event fired more than once');
            resample.destroy();
            gen.destroy();
            nullStream.destroy();
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

        resample.on('pipe', () => {
            resample.setRatio(0.5);
        })

        resample.on('data', (data) => {
            resampleTotal += data.length;
        })

        nullStream.on('end', doAssert);

        resample.on('end', () => {
            eventSpy();
        });

        gen.pipe(resample).pipe(nullStream);
    });

    it('should throw error with invalid fromDepth', function (done) {
        let opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        opts.fromDepth = 20;
        assert.throws(() => { helper.getResampler(opts) }, Error);
        done();
    });

    it('should throw error with invalid toDepth', function (done) {
        let opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        opts.toDepth = 20;
        assert.throws(() => { helper.getResampler(opts) }, Error);
        done();
    });
});
