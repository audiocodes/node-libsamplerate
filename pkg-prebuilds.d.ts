declare module 'pkg-prebuilds' {
    interface BindingOptions {
        name: string;
        napi_versions?: number[];
        armv?: boolean;
    }

    interface NativeBinding {
        SampleRateStream: new (opts: unknown) => any;
    }

    export default function pkgPrebuilds(baseDir: string, options: BindingOptions): NativeBinding;
}
