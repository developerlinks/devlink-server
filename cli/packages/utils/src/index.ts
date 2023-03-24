import log from './log';
import request from './request';
import { getNpmRegistry, getNpmInfo, getLatestVersion, getNpmLatestSemverVersion } from './npm';
import inquirer from './inquirer';
import spinner from './spinner';
import formatPath from './formatPath';

import Package from './Package';

function sleep(timeout: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

function exec(
  command: string,
  args: string[],
  options?: object,
): ReturnType<typeof import('child_process').spawn> {
  const win32 = process.platform === 'win32';

  const cmd = win32 ? 'cmd' : command;
  const cmdArgs = win32 ? ['/c'].concat(command, args) : args;

  return require('child_process').spawn(cmd, cmdArgs, options || {});
}

export { log, request, getNpmRegistry, getNpmInfo, getLatestVersion, getNpmLatestSemverVersion, inquirer, spinner, Package, sleep, exec, formatPath };
