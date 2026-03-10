{
  "targets": [
    {
      "target_name": "libsamplerate",
      "sources": [
        "src/binding.cc",
        "src/node-libsamplerate.cc"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": [
        "NAPI_CPP_EXCEPTIONS"
      ],
      "cflags!": [
        "-fno-exceptions"
      ],
      "cflags_cc": [
        "-std=c++17",
        "-fexceptions"
      ],
      "cflags_cc!": [
        "-fno-exceptions"
      ],
      "conditions": [
        [
          "OS!='win'",
          {
            "cflags": [
              "<!@(pkg-config --cflags samplerate)"
            ],
            "libraries": [
              "<!@(pkg-config --libs samplerate)"
            ]
          }
        ],
        [
          "OS=='mac'",
          {
            "xcode_settings": {
              "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
              "CLANG_CXX_LIBRARY": "libc++",
              "MACOSX_DEPLOYMENT_TARGET": "10.15"
            }
          }
        ],
        [
          "OS=='win'",
          {
            "include_dirs": [
              "deps/libsamplerate/include",
              "deps/libsamplerate/src"
            ],
            "sources": [
              "deps/libsamplerate/src/samplerate.c",
              "deps/libsamplerate/src/src_sinc.c",
              "deps/libsamplerate/src/src_linear.c",
              "deps/libsamplerate/src/src_zoh.c"
            ],
            "defines": [
              "CPU_CLIPS_POSITIVE=0",
              "CPU_CLIPS_NEGATIVE=0",
              "HAVE_STDBOOL_H=1"
            ],
            "msvs_settings": {
              "VCCLCompilerTool": {
                "ExceptionHandling": 1
              }
            }
          }
        ]
      ]
    }
  ]
}
