"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMaterials = void 0;
const cli_utils_1 = require("@devlink/cli-utils");
function fetchMaterials() {
    return (0, cli_utils_1.request)({
        url: '/material',
    });
}
exports.fetchMaterials = fetchMaterials;
