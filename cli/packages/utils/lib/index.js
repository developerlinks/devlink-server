"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPath = exports.exec = exports.sleep = exports.Package = exports.spinner = exports.inquirer = exports.getNpmLatestSemverVersion = exports.getLatestVersion = exports.getNpmInfo = exports.getNpmRegistry = exports.request = exports.log = void 0;
const log_1 = __importDefault(require("./log"));
exports.log = log_1.default;
const request_1 = __importDefault(require("./request"));
exports.request = request_1.default;
const npm_1 = require("./npm");
Object.defineProperty(exports, "getNpmRegistry", { enumerable: true, get: function () { return npm_1.getNpmRegistry; } });
Object.defineProperty(exports, "getNpmInfo", { enumerable: true, get: function () { return npm_1.getNpmInfo; } });
Object.defineProperty(exports, "getLatestVersion", { enumerable: true, get: function () { return npm_1.getLatestVersion; } });
Object.defineProperty(exports, "getNpmLatestSemverVersion", { enumerable: true, get: function () { return npm_1.getNpmLatestSemverVersion; } });
const inquirer_1 = __importDefault(require("./inquirer"));
exports.inquirer = inquirer_1.default;
const spinner_1 = __importDefault(require("./spinner"));
exports.spinner = spinner_1.default;
const formatPath_1 = __importDefault(require("./formatPath"));
exports.formatPath = formatPath_1.default;
const Package_1 = __importDefault(require("./Package"));
exports.Package = Package_1.default;
function sleep(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
exports.sleep = sleep;
function exec(command, args, options) {
    const win32 = process.platform === 'win32';
    const cmd = win32 ? 'cmd' : command;
    const cmdArgs = win32 ? ['/c'].concat(command, args) : args;
    return require('child_process').spawn(cmd, cmdArgs, options || {});
}
exports.exec = exec;
