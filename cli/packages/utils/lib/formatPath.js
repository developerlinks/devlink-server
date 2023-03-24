"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
function formatPath(p) {
    const sep = path_1.default.sep;
    // 如果返回 / 则为 macOS
    if (sep === '/') {
        return p;
    }
    else {
        return p.replace(/\\/g, '/');
    }
}
exports.default = formatPath;
