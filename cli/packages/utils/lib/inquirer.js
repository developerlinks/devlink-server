"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
function default_1({ choices, defaultValue, message, type = 'list', require = true }) {
    const options = {
        type,
        name: 'name',
        message,
        default: defaultValue,
        require,
    };
    if (type === 'list') {
        options.choices = choices;
    }
    return inquirer_1.default.prompt(options).then(answer => answer.name);
}
exports.default = default_1;
