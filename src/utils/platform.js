/* eslint-disable import/prefer-default-export */

export const isMacOS = () => process.platform === 'darwin';

export const isWindows = () => process.platform === 'win32';

export const isLinux = () => process.platform === 'linux';
