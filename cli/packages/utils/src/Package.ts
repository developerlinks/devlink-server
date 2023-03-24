import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import npminstall from 'npminstall';
import log from './log';
import { getNpmLatestSemverVersion, getNpmRegistry } from './npm';
import formatPath from './formatPath';

const useOriginNpm = false;

interface PackageOptions {
  targetPath: string;
  storePath: string;
  name: string;
  version: string;
}

class Package {
  private targetPath: string;
  private storePath: string;
  private packageName: string;
  private packageVersion: string;
  private npmFilePathPrefix: string;

  constructor(options: PackageOptions) {
    log.verbose('options', options);
    this.targetPath = options.targetPath;
    this.storePath = options.storePath;
    this.packageName = options.name;
    this.packageVersion = options.version;
    this.npmFilePathPrefix = this.packageName.replace('/', '_');
  }

  get npmFilePath(): string {
    return path.resolve(
      this.storePath,
      `_${this.npmFilePathPrefix}@${this.packageVersion}@${this.packageName}`,
    );
  }

  async prepare(): Promise<void> {
    if (!fs.existsSync(this.targetPath)) {
      fse.mkdirpSync(this.targetPath);
    }
    if (!fs.existsSync(this.storePath)) {
      fse.mkdirpSync(this.storePath);
    }
    log.verbose(this.targetPath);
    log.verbose('storePath', this.storePath);
    const latestVersion = await getNpmLatestSemverVersion(
      this.packageName,
      this.packageVersion,
    );
    log.verbose('latestVersion', this.packageName, latestVersion);
    if (latestVersion) {
      this.packageVersion = latestVersion;
    }
  }

  async install(): Promise<void> {
    await this.prepare();
    log.verbose('install', this.packageName, this.packageVersion);
    return npminstall({
      root: this.targetPath,
      storeDir: this.storePath,
      registry: getNpmRegistry(useOriginNpm),
      pkgs: [
        {
          name: this.packageName,
          version: this.packageVersion,
        },
      ],
    });
  }

  async exists(): Promise<boolean> {
    await this.prepare();
    return fs.existsSync(this.npmFilePath);
  }

  getPackage(isOriginal = false): Record<string, any> {
    if (!isOriginal) {
      return fse.readJsonSync(path.resolve(this.npmFilePath, 'package.json'));
    }
    return fse.readJsonSync(path.resolve(this.storePath, 'package.json'));
  }

  getRootFilePath(isOriginal = false): string | null {
    const pkg = this.getPackage(isOriginal);
    if (pkg) {
      if (!isOriginal) {
        return formatPath(path.resolve(this.npmFilePath, pkg.main));
      }
      return formatPath(path.resolve(this.storePath, pkg.main));
    }
    return null;
  }

  async getVersion(): Promise<string | null> {
    await this.prepare();
    return (await this.exists()) ? this.getPackage().version : null;
  }

  async getLatestVersion(): Promise<string | null> {
    const version = await this.getVersion();
    if (version) {
      const latestVersion = await getNpmLatestSemverVersion(this.packageName, version);
      return latestVersion;
    }
    return null;
  }

  async update(): Promise<void> {
    const latestVersion = await this.getLatestVersion();
    log.verbose('install', this.packageName, latestVersion);
    return npminstall({
      root: this.targetPath,
      storeDir: this.storePath,
      registry: getNpmRegistry(useOriginNpm),
      pkgs: [
        {
          name: this.packageName,
          version: latestVersion,
        },
      ],
    });
  }
}
export default Package;
