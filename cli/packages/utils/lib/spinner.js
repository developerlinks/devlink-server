"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_spinner_1 = require("cli-spinner");
function startSpinner(msg, spinnerString = '|/-\\') {
    const spinner = new cli_spinner_1.Spinner(`${msg}.. %s`);
    spinner.setSpinnerString(spinnerString);
    spinner.start();
    return spinner;
}
exports.default = startSpinner;
