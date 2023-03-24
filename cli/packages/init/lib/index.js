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
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const cli_utils_1 = require("@devlink/cli-utils");
const getProjectTemplate_1 = require("./getProjectTemplate");
function init(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 设置 targetPath
            let targetPath = process.cwd();
            if (!options.targetPath) {
                options.targetPath = targetPath;
            }
            cli_utils_1.log.verbose('init', options);
            // 完成项目初始化的准备和校验工作
            const result = yield prepare(options);
            if (!result) {
                cli_utils_1.log.info('创建项目终止');
                return;
            }
            // 获取项目模板列表
            const { templateList } = result;
            // 缓存项目模板文件
            const template = yield downloadTemplate(templateList, options);
            cli_utils_1.log.verbose('template', template);
            // 安装项目模板
            yield installTemplate(template, options);
        }
        catch (e) {
            cli_utils_1.log.error('Error:', e.message);
        }
    });
}
function npminstall(targetPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const p = (0, cli_utils_1.exec)('npm', ['install'], { stdio: 'inherit', cwd: targetPath });
            p.on('error', e => {
                reject(e);
                cli_utils_1.log.notice('如果是 cnpm 报的错，请安装 cnpm');
            });
            p.on('exit', c => {
                resolve(c);
            });
        });
    });
}
function execStartCommand(targetPath, startCommand) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const p = (0, cli_utils_1.exec)(startCommand[0], startCommand.slice(1), { stdio: 'inherit', cwd: targetPath });
            p.on('error', e => {
                reject(e);
            });
            p.on('exit', c => {
                resolve(c);
            });
        });
    });
}
function installTemplate(template, options) {
    return __awaiter(this, void 0, void 0, function* () {
        // 安装模板
        let spinnerStart = (0, cli_utils_1.spinner)(`正在安装模板...`);
        yield (0, cli_utils_1.sleep)(1000);
        const sourceDir = template.path;
        const targetDir = options.targetPath;
        fs_extra_1.default.copySync(sourceDir, targetDir);
        spinnerStart.stop(true);
        cli_utils_1.log.success('模板安装成功');
        // 安装依赖文件
        cli_utils_1.log.notice('开始安装依赖');
        yield npminstall(targetDir);
        cli_utils_1.log.success('依赖安装成功');
        // 启动代码
        if (template.startCommand) {
            const startCommand = template.startCommand.split(' ');
            yield execStartCommand(targetDir, startCommand);
        }
    });
}
function downloadTemplate(templateList, options) {
    return __awaiter(this, void 0, void 0, function* () {
        // 用户交互选择
        const templateName = yield (0, cli_utils_1.inquirer)({
            choices: createTemplateChoice(templateList),
            message: '请选择项目模板',
        });
        cli_utils_1.log.verbose('template', templateName);
        const selectedTemplate = templateList.find(item => item.npmName === templateName);
        cli_utils_1.log.verbose('selected template', selectedTemplate);
        const { cliHome } = options;
        const targetPath = path_1.default.resolve(cliHome, 'template');
        // 基于模板生成 Package 对象
        const templatePkg = new cli_utils_1.Package({
            targetPath,
            storePath: targetPath,
            name: selectedTemplate.npmName,
            version: selectedTemplate.version,
        });
        // 如果模板不存在则进行下载
        if (!(yield templatePkg.exists())) {
            let spinnerStart = (0, cli_utils_1.spinner)(`正在下载模板...`);
            yield (0, cli_utils_1.sleep)(1000);
            yield templatePkg.install();
            spinnerStart.stop(true);
            cli_utils_1.log.success('下载模板成功');
        }
        else {
            cli_utils_1.log.notice('模板已存在', `${selectedTemplate.npmName}@${selectedTemplate.version}`);
            cli_utils_1.log.notice('模板路径', `${targetPath}`);
        }
        // 生成模板路径
        const templatePath = path_1.default.resolve(templatePkg.npmFilePath, 'template');
        cli_utils_1.log.verbose('template path', templatePath);
        if (!fs_1.default.existsSync(templatePath)) {
            throw new Error(`[${templateName}]项目模板不存在！`);
        }
        const template = Object.assign(Object.assign({}, selectedTemplate), { path: templatePath });
        return template;
    });
}
function prepare(options) {
    return __awaiter(this, void 0, void 0, function* () {
        let fileList = fs_1.default.readdirSync(process.cwd());
        fileList = fileList.filter(file => ['node_modules', '.git', '.DS_Store'].indexOf(file) < 0);
        cli_utils_1.log.verbose('fileList', fileList);
        let continueWhenDirNotEmpty = true;
        if (fileList && fileList.length > 0) {
            continueWhenDirNotEmpty = yield (0, cli_utils_1.inquirer)({
                type: 'confirm',
                message: '当前文件夹不为空，是否继续创建项目？',
                defaultValue: false,
            });
        }
        cli_utils_1.log.verbose('continueWhenDirNotEmpty', continueWhenDirNotEmpty);
        if (!continueWhenDirNotEmpty) {
            return { templateList: [] };
        }
        cli_utils_1.log.verbose('options', options);
        if (options.force) {
            const targetDir = options.targetPath;
            cli_utils_1.log.verbose('prepare targetDir', targetDir);
            const confirmEmptyDir = yield (0, cli_utils_1.inquirer)({
                type: 'confirm',
                message: '是否确认清空当下目录下的文件',
                defaultValue: false,
            });
            if (confirmEmptyDir) {
                fs_extra_1.default.emptyDirSync(targetDir);
            }
        }
        cli_utils_1.log.verbose('before getProjectTemplate');
        const data = yield (0, getProjectTemplate_1.fetchMaterials)();
        cli_utils_1.log.verbose('templateList', data.data.length, data.data);
        if (data.data.length === 0) {
            throw new Error('项目模板列表获取失败');
        }
        return {
            templateList: data.data,
        };
    });
}
function createTemplateChoice(list) {
    return list.map(item => ({
        value: item.npmName,
        name: item.name,
    }));
}
exports.default = init;
