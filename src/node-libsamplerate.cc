#include <thread>
#include <iostream>
#include <memory>
#include <math.h>
#include <samplerate.h>

#include "node-libsamplerate.h"

void s24_to_float_array(const int *in, float *out, int len)
{
    while (len--)
        out[len] = (float)(in[len] / (8.0 * 0x200000));
}

void float_to_s24_array(const float *in, int *out, int len)
{
    while (len--) {
        double scaled_value = in[len] * (8.0 * 0x200000);
        if (scaled_value >= (1.0 * 0x7FFFFF)) {
            out[len] = 0x7fffff;
            continue;
        }
        if (scaled_value <= (-8.0 * 0x200000)) {
            out[len] = -1 - 0x7fffff;
            continue;
        }

        out[len] = lrint(scaled_value);
    }
}

Napi::FunctionReference SampleRateStream::constructor;

Napi::Object SampleRateStream::Init(Napi::Env env, Napi::Object exports)
{
    Napi::HandleScope scope(env);
    Napi::Function transform = DefineClass(env, "SampleRateStream",
                                           {InstanceMethod("transform", &SampleRateStream::Transform),
                                            InstanceMethod("setRatio", &SampleRateStream::SetRatio),
                                            InstanceMethod("reset", &SampleRateStream::Reset)});

    constructor = Napi::Persistent(transform);
    constructor.SuppressDestruct();

    exports.Set("SampleRateStream", transform);
    return exports;
}

SampleRateStream::SampleRateStream(const Napi::CallbackInfo &info)
    : Napi::ObjectWrap<SampleRateStream>(info)
{
    Napi::Env env = info.Env();
    Napi::Object inProps = info[0].As<Napi::Object>();
    Napi::Array propNames = inProps.GetPropertyNames();
    int len = propNames.Length();
    memset(&data, 0, sizeof(data));

    Napi::Object props = info.This().As<Napi::Object>();
    for (int i = 0; i < len; i++) {
        napi_value e;
        napi_get_element(env, propNames, i, &e);
        std::string key = Napi::String(env, e).Utf8Value();
        uint32_t value = inProps.Get(key).As<Napi::Number>().Uint32Value();
        props.Set(Napi::String::New(env, key), value);
    }
    uint32_t type = inProps.Get("type").As<Napi::Number>().Uint32Value();
    uint32_t channels = inProps.Get("channels").As<Napi::Number>().Uint32Value();
    uint32_t fromRate = inProps.Get("fromRate").As<Napi::Number>().Uint32Value();
    uint32_t toRate = inProps.Get("toRate").As<Napi::Number>().Uint32Value();
    double ratio = (double)toRate / (double)fromRate;
    data.src_ratio = ratio;
    int error;
    src_state = src_new(type, channels, &error);
    if (!src_state)
        throw Napi::Error::New(info.Env(), src_strerror(error));
}

SampleRateStream::~SampleRateStream() {
    if (src_state)
        src_delete(src_state);
}

Napi::Value SampleRateStream::Transform(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    void *inputBuffer;
    size_t lengthIn;
    napi_get_buffer_info(env, info[0].As<Napi::Buffer<char>>(), &inputBuffer, &lengthIn);

    Napi::Object props = info.This().As<Napi::Object>();

    uint32_t fromDepth = props.Get("fromDepth").As<Napi::Number>().Uint32Value();
    uint32_t toDepth = props.Get("toDepth").As<Napi::Number>().Uint32Value();
    uint32_t channels = props.Get("channels").As<Napi::Number>().Uint32Value();

    // Frame length 2 for 16bit, 4 for 32bit and 24bit, for each channel
    unsigned int depth = fromDepth == 24 ? 32 : fromDepth;
    unsigned int inputFrames = (int)floor(lengthIn / (channels * (depth / 8)));
    unsigned int outputFrames = (int)(data.src_ratio * inputFrames) + 1;
    unsigned int lengthOut = (int)floor(data.src_ratio * lengthIn);

    if (fromDepth == 16 && toDepth != 16)
        lengthOut *= 2;

    lengthIn /= (depth / 8); // From this point, lengthIn refers to array items
    std::unique_ptr<float[]> dataOutFloat(new float[lengthOut]);
    std::unique_ptr<float[]> dataInFloat(new float[lengthIn]);

    if (fromDepth == 16)
        src_short_to_float_array((short *)inputBuffer, dataInFloat.get(), (int)lengthIn);
    if (fromDepth == 24)
        s24_to_float_array((int *)inputBuffer, dataInFloat.get(), (int)lengthIn);
    if (fromDepth == 32)
        src_int_to_float_array((int *)inputBuffer, dataInFloat.get(), (int)lengthIn);

    data.data_in = dataInFloat.get();
    data.data_out = dataOutFloat.get();
    data.input_frames = inputFrames;
    data.output_frames = outputFrames;

    const int error = src_process(src_state, &data);
    if (error)
        throw Napi::Error::New(info.Env(), src_strerror(error));

    depth = toDepth == 24 ? 32 : toDepth;
    lengthOut = data.output_frames_gen * channels * (depth / 8);
    int *dataOut = new int[lengthOut];
    int inFramesUsed = data.input_frames_used;
    int frameDiff = data.input_frames - data.input_frames_used;
    if (frameDiff != 0)
        std::cout << "outframes differs from inframes by " << frameDiff << std::endl;

    if (toDepth == 16)
        src_float_to_short_array(dataOutFloat.get(), (short *)dataOut, lengthOut);
    if (toDepth == 24)
        float_to_s24_array(dataOutFloat.get(), (int *)dataOut, lengthOut);
    if (toDepth == 32)
        src_float_to_int_array(dataOutFloat.get(), (int *)dataOut, lengthOut);

    return Napi::Buffer<char>::New(env, (char *)dataOut, lengthOut, [](Napi::Env env, char *finalizeData) {
        delete[] finalizeData;
    });
}

void SampleRateStream::SetRatio(const Napi::CallbackInfo &info)
{
    double ratio = info[0].As<Napi::Number>().DoubleValue();
    data.src_ratio = ratio;
}

void SampleRateStream::Reset(const Napi::CallbackInfo &info)
{
    int error = src_reset(src_state);
    if (error)
        throw Napi::Error::New(info.Env(), src_strerror(error));
}
