interface Options {
    targetPath?: string;
    force?: boolean;
    cliHome: string;
}
declare function init(options: Options): Promise<void>;
export default init;
