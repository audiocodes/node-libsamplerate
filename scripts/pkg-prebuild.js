#!/usr/bin/env node

const { execFileSync } = require('child_process');

const isLinux = process.platform === 'linux';
const nodeCmd = process.execPath;
const cmakeJsBin = require.resolve('cmake-js/bin/cmake-js');
const pkgPrebuildsCopyBin = require.resolve('pkg-prebuilds/bin/copy.mjs');

function detectLibc() {
    if (!isLinux) return null;
    if (process.env.LIBC) return process.env.LIBC;

    const report = process.report && typeof process.report.getReport === 'function'
        ? process.report.getReport()
        : null;

    if (report && report.header && report.header.glibcVersionRuntime) {
        return 'glibc';
    }

    return 'musl';
}

function run(cmd, args, env) {
    execFileSync(cmd, args, {
        stdio: 'inherit',
        env
    });
}

const napiVersion = process.env.npm_config_napi_version || process.versions.napi;
const runtime = process.env.npm_config_runtime || 'node';
const arch = process.env.npm_config_arch || process.arch;
const platform = process.env.npm_config_platform || process.platform;
const libc = detectLibc();

run(nodeCmd, [cmakeJsBin, 'compile', '-p', '4'], process.env);

const copyArgs = [
    pkgPrebuildsCopyBin,
    '--baseDir', 'build/Release',
    '--source', 'libsamplerate.node',
    '--name', 'libsamplerate',
    '--strip',
    '--napi_version', String(napiVersion),
    '--runtime', runtime,
    '--arch', arch,
    '--platform', platform
];

if (libc) {
    copyArgs.push('--libc', libc);
}

run(nodeCmd, copyArgs, process.env);
