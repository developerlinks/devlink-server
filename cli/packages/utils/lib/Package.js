"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const npminstall_1 = __importDefault(require("npminstall"));
const log_1 = __importDefault(require("./log"));
const npm_1 = require("./npm");
const formatPath_1 = __importDefault(require("./formatPath"));
const useOriginNpm = false;
class Package {
    constructor(options) {
        log_1.default.verbose('options', options);
        this.targetPath = options.targetPath;
        this.storePath = options.storePath;
        this.packageName = options.name;
        this.packageVersion = options.version;
        this.npmFilePathPrefix = this.packageName.replace('/', '_');
    }
    get npmFilePath() {
        return path_1.default.resolve(this.storePath, `_${this.npmFilePathPrefix}@${this.packageVersion}@${this.packageName}`);
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs_1.default.existsSync(this.targetPath)) {
                fs_extra_1.default.mkdirpSync(this.targetPath);
            }
            if (!fs_1.default.existsSync(this.storePath)) {
                fs_extra_1.default.mkdirpSync(this.storePath);
            }
            log_1.default.verbose(this.targetPath);
            log_1.default.verbose('storePath', this.storePath);
            const latestVersion = yield (0, npm_1.getNpmLatestSemverVersion)(this.packageName, this.packageVersion);
            log_1.default.verbose('latestVersion', this.packageName, latestVersion);
            if (latestVersion) {
                this.packageVersion = latestVersion;
            }
        });
    }
    install() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prepare();
            log_1.default.verbose('install', this.packageName, this.packageVersion);
            return (0, npminstall_1.default)({
                root: this.targetPath,
                storeDir: this.storePath,
                registry: (0, npm_1.getNpmRegistry)(useOriginNpm),
                pkgs: [
                    {
                        name: this.packageName,
                        version: this.packageVersion,
                    },
                ],
            });
        });
    }
    exists() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prepare();
            return fs_1.default.existsSync(this.npmFilePath);
        });
    }
    getPackage(isOriginal = false) {
        if (!isOriginal) {
            return fs_extra_1.default.readJsonSync(path_1.default.resolve(this.npmFilePath, 'package.json'));
        }
        return fs_extra_1.default.readJsonSync(path_1.default.resolve(this.storePath, 'package.json'));
    }
    getRootFilePath(isOriginal = false) {
        const pkg = this.getPackage(isOriginal);
        if (pkg) {
            if (!isOriginal) {
                return (0, formatPath_1.default)(path_1.default.resolve(this.npmFilePath, pkg.main));
            }
            return (0, formatPath_1.default)(path_1.default.resolve(this.storePath, pkg.main));
        }
        return null;
    }
    getVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prepare();
            return (yield this.exists()) ? this.getPackage().version : null;
        });
    }
    getLatestVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const version = yield this.getVersion();
            if (version) {
                const latestVersion = yield (0, npm_1.getNpmLatestSemverVersion)(this.packageName, version);
                return latestVersion;
            }
            return null;
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const latestVersion = yield this.getLatestVersion();
            log_1.default.verbose('install', this.packageName, latestVersion);
            return (0, npminstall_1.default)({
                root: this.targetPath,
                storeDir: this.storePath,
                registry: (0, npm_1.getNpmRegistry)(useOriginNpm),
                pkgs: [
                    {
                        name: this.packageName,
                        version: latestVersion,
                    },
                ],
            });
        });
    }
}
exports.default = Package;
