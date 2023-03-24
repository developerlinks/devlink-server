"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNpmLatestSemverVersion = exports.getLatestVersion = exports.getNpmInfo = exports.getNpmRegistry = void 0;
const axios_1 = __importDefault(require("axios"));
const url_join_1 = __importDefault(require("url-join"));
const semver_1 = __importDefault(require("semver"));
const log_1 = __importDefault(require("./log"));
// 获取 registry 信息
function getNpmRegistry(isOriginal = true) {
    return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org';
}
exports.getNpmRegistry = getNpmRegistry;
// 从 registry 获取 npm 的信息
function getNpmInfo(npm, registry) {
    const register = registry || getNpmRegistry();
    const url = (0, url_join_1.default)(register, npm);
    log_1.default.verbose('getNpmInfo', url);
    return axios_1.default.get(url).then(function (response) {
        try {
            if (response.status === 200) {
                return response.data;
            }
        }
        catch (error) {
            log_1.default.verbose('error', error);
            return Promise.reject(error);
        }
    });
}
exports.getNpmInfo = getNpmInfo;
// 获取某个 npm 的最新版本号
function getLatestVersion(npm, registry) {
    return getNpmInfo(npm, registry).then(function (data) {
        if (!data['dist-tags'] || !data['dist-tags'].latest) {
            console.error('没有 latest 版本号', data);
            return Promise.reject(new Error('Error: 没有 latest 版本号'));
        }
        const latestVersion = data['dist-tags'].latest;
        return latestVersion;
    });
}
exports.getLatestVersion = getLatestVersion;
// 获取某个 npm 的所有版本号
function getVersions(npm, registry) {
    return getNpmInfo(npm, registry).then(function (body) {
        const versions = Object.keys(body.versions);
        return versions;
    });
}
// 根据指定 version 获取符合 semver 规范的最新版本号
function getLatestSemverVersion(baseVersion, versions) {
    versions = versions
        .filter(function (version) {
        return semver_1.default.satisfies(version, '^' + baseVersion);
    })
        .sort(function (a, b) {
        return semver_1.default.gt(b, a);
    });
    return versions[0];
}
// 根据指定 version 和包名获取符合 semver 规范的最新版本号
function getNpmLatestSemverVersion(npm, baseVersion, registry) {
    return getVersions(npm, registry).then(function (versions) {
        return getLatestSemverVersion(baseVersion, versions);
    });
}
exports.getNpmLatestSemverVersion = getNpmLatestSemverVersion;
