"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const log_1 = __importDefault(require("./log"));
const BASE_URL = 'http://localhost:13000/api';
const service = axios_1.default.create({
    baseURL: BASE_URL,
    timeout: 5000,
});
service.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});
service.interceptors.response.use((response) => {
    log_1.default.verbose('response', response.data);
    return response.data;
}, (error) => {
    return Promise.reject(error);
});
exports.default = service;
