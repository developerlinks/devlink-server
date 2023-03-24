declare function getNpmRegistry(isOriginal?: boolean): string;
declare function getNpmInfo(npm: string, registry?: string): Promise<any>;
declare function getLatestVersion(npm: string, registry?: string): Promise<string>;
declare function getNpmLatestSemverVersion(npm: string, baseVersion: string, registry?: string): Promise<string>;
export { getNpmRegistry, getNpmInfo, getLatestVersion, getNpmLatestSemverVersion, };
