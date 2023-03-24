"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const npmlog_1 = __importDefault(require("npmlog"));
npmlog_1.default.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';
npmlog_1.default.heading = 'devlink'; // 自定义头部
npmlog_1.default.addLevel('success', 2000, { fg: 'green', bold: true }); // 自定义success日志
npmlog_1.default.addLevel('notice', 2000, { fg: 'blue', bg: 'black' }); // 自定义notice日志
exports.default = npmlog_1.default;
