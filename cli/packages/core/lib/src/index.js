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
const commander_1 = require("commander");
const safe_1 = __importDefault(require("colors/safe"));
const os_1 = require("os");
const semver_1 = __importDefault(require("semver"));
const cli_utils_1 = require("@devlink/cli-utils");
const package_json_1 = __importDefault(require("../package.json"));
const const_1 = require("./const");
let config;
let args;
function cli() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prepare();
            registerCommand();
        }
        catch (e) {
            cli_utils_1.log.error(e.message);
        }
    });
}
exports.default = cli;
function registerCommand() {
    const program = new commander_1.Command();
    program.version(package_json_1.default.version).usage('<command> [options]');
    program
        .command('init [type]')
        .description('项目初始化')
        .option('--packagePath <packagePath>', '手动指定init包路径')
        .option('--force', '覆盖当前路径文件（谨慎使用）')
        .action((type, { packagePath, force }) => __awaiter(this, void 0, void 0, function* () {
        const packageName = '@devlink/cli-init';
        const packageVersion = yield (0, cli_utils_1.getLatestVersion)(packageName);
        yield execCommand({ packagePath, packageName, packageVersion }, { type, force });
    }));
    program
        .command('clean')
        .description('清空缓存文件')
        .option('-a, --all', '清空全部')
        .option('-d, --dep', '清空依赖文件')
        .action(options => {
        cli_utils_1.log.notice('开始清空缓存文件');
        if (options.all) {
            cleanAll();
        }
        else if (options.dep) {
            const depPath = path_1.default.resolve(config.cliHome, const_1.DEPENDENCIES_PATH);
            if (fs_1.default.existsSync(depPath)) {
                fs_extra_1.default.emptyDirSync(depPath);
                cli_utils_1.log.success('清空依赖文件成功', depPath);
            }
            else {
                cli_utils_1.log.success('文件夹不存在', depPath);
            }
        }
        else {
            cleanAll();
        }
    });
    program.option('--debug', '打开调试模式').parse(process.argv);
    if (args._.length < 1) {
        program.outputHelp();
        console.log();
    }
}
function execCommand({ packagePath, packageName, packageVersion }, extraOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        let rootFile;
        try {
            if (packagePath) {
                const execPackage = new cli_utils_1.Package({
                    targetPath: packagePath,
                    storePath: packagePath,
                    name: packageName,
                    version: packageVersion,
                });
                rootFile = execPackage.getRootFilePath(true);
            }
            else {
                const { cliHome } = config;
                const packageDir = `${const_1.DEPENDENCIES_PATH}`;
                const targetPath = path_1.default.resolve(cliHome, packageDir);
                const storePath = path_1.default.resolve(targetPath, 'node_modules');
                const initPackage = new cli_utils_1.Package({
                    targetPath,
                    storePath,
                    name: packageName,
                    version: packageVersion,
                });
                if (yield initPackage.exists()) {
                    cli_utils_1.log.verbose('更新 package');
                    yield initPackage.update();
                }
                else {
                    cli_utils_1.log.verbose('安装 package');
                    yield initPackage.install();
                }
                rootFile = initPackage.getRootFilePath();
            }
            const _config = Object.assign({}, config, extraOptions);
            if (fs_1.default.existsSync(rootFile)) {
                const code = `require('${rootFile}')(${JSON.stringify(_config)})`;
                const p = (0, cli_utils_1.exec)('node', ['-e', code], { stdio: 'inherit' });
                p.on('error', e => {
                    cli_utils_1.log.verbose('命令执行失败：', e);
                    handleError(e);
                    process.exit(1);
                });
                p.on('exit', c => {
                    cli_utils_1.log.verbose('命令执行成功', c);
                    process.exit(c);
                });
            }
            else {
                throw new Error('入口文件不存在，请重试！');
            }
        }
        catch (e) {
            cli_utils_1.log.error(e.message);
        }
    });
}
function handleError(e) {
    cli_utils_1.log.error('Error', e.message);
    cli_utils_1.log.error('stack', e.stack);
    process.exit(1);
}
function cleanAll() {
    if (fs_1.default.existsSync(config.cliHome)) {
        fs_extra_1.default.emptyDirSync(config.cliHome);
        cli_utils_1.log.success('清空全部缓存文件成功', config.cliHome);
    }
    else {
        cli_utils_1.log.success('文件夹不存在', config.cliHome);
    }
}
function prepare() {
    return __awaiter(this, void 0, void 0, function* () {
        checkPkgVersion(); // 检查当前运行版本
        checkNodeVersion(); // 检查 node 版本
        checkRoot(); // 检查是否为 root 启动
        checkUserHome(); // 检查用户主目录
        checkInputArgs(); // 检查用户输入参数
        checkEnv(); // 检查环境变量
        yield checkGlobalUpdate(); // 检查工具是否需要更新
    });
}
function checkGlobalUpdate() {
    return __awaiter(this, void 0, void 0, function* () {
        cli_utils_1.log.verbose('检查 @devlink/cli 最新版本');
        const currentVersion = package_json_1.default.version;
        const lastVersion = yield (0, cli_utils_1.getNpmLatestSemverVersion)(const_1.NPM_NAME, currentVersion);
        if (semver_1.default.gt(lastVersion, currentVersion)) {
            cli_utils_1.log.warn(safe_1.default.yellow(`请手动更新 ${const_1.NPM_NAME}，当前版本：${package_json_1.default.version}，最新版本：${lastVersion}
                更新命令： npm install -g ${const_1.NPM_NAME}`));
        }
    });
}
function checkEnv() {
    cli_utils_1.log.verbose('开始检查环境变量');
    const dotenv = require('dotenv');
    dotenv.config({
        path: path_1.default.resolve((0, os_1.homedir)(), '.env'),
    });
    config = createCliConfig(); // 准备基础配置
    cli_utils_1.log.verbose('环境变量', config);
}
function createCliConfig() {
    const cliConfig = {
        home: (0, os_1.homedir)(),
    };
    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path_1.default.join((0, os_1.homedir)(), process.env.CLI_HOME);
    }
    else {
        cliConfig['cliHome'] = path_1.default.join((0, os_1.homedir)(), const_1.DEFAULT_CLI_HOME);
    }
    return cliConfig;
}
function checkInputArgs() {
    cli_utils_1.log.verbose('开始校验输入参数');
    const minimist = require('minimist');
    args = minimist(process.argv.slice(2)); // 解析查询参数
    checkArgs(args); // 校验参数
    cli_utils_1.log.verbose('输入参数', args);
}
function checkArgs(args) {
    if (args.debug) {
        process.env.LOG_LEVEL = 'verbose';
    }
    else {
        process.env.LOG_LEVEL = 'info';
    }
    cli_utils_1.log.level = process.env.LOG_LEVEL;
}
function checkUserHome() {
    if (!(0, os_1.homedir)() || !fs_1.default.existsSync((0, os_1.homedir)())) {
        throw new Error(safe_1.default.red('当前登录用户主目录不存在！'));
    }
}
function checkRoot() {
    const rootCheck = require('root-check');
    rootCheck(safe_1.default.red('请避免使用 root 账户启动本应用'));
}
function checkNodeVersion() {
    const semver = require('semver');
    if (!semver.gte(process.version, const_1.LOWEST_NODE_VERSION)) {
        throw new Error(safe_1.default.red(`devlink-cli 需要安装 v${const_1.LOWEST_NODE_VERSION} 以上版本的 Node.js`));
    }
}
function checkPkgVersion() {
    cli_utils_1.log.success('今天又是美好的一天');
    cli_utils_1.log.success('当前运行版本', package_json_1.default.version);
}
