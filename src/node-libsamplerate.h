#include <napi.h>
#include <samplerate.h>

class SampleRateStream : public Napi::ObjectWrap<SampleRateStream> {
    public:
        static Napi::Object Init(Napi::Env env, Napi::Object exports);
        static void Destructor(Napi::Env env, void* nativeObject, void* finalize_hint);
        SampleRateStream(const Napi::CallbackInfo& info);
        ~SampleRateStream();

    private:
        static Napi::FunctionReference constructor;
        Napi::Value Transform(const Napi::CallbackInfo& info);
        void SetRatio(const Napi::CallbackInfo& info);
        void Reset(const Napi::CallbackInfo& info);

    SRC_STATE *src_state;
    SRC_DATA data;
};
