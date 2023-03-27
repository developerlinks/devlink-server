interface PackageOptions {
    targetPath: string;
    storePath: string;
    name: string;
    version: string;
}
declare class Package {
    private targetPath;
    private storePath;
    private packageName;
    private packageVersion;
    private npmFilePathPrefix;
    constructor(options: PackageOptions);
    get npmFilePath(): string;
    prepare(): Promise<void>;
    install(): Promise<void>;
    exists(): Promise<boolean>;
    getPackage(isOriginal?: boolean): Record<string, any>;
    getRootFilePath(isOriginal?: boolean): string | null;
    getVersion(): Promise<string | null>;
    getLatestVersion(): Promise<string | null>;
    update(): Promise<any>;
}
export default Package;
