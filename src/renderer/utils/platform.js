/* eslint-disable import/prefer-default-export */

// Platform is exposed synchronously through preload script
const { platform } = window.electronAPI;

export const isMacOS = () => platform === 'darwin';

export const isWindows = () => platform === 'win32';

export const isLinux = () => platform === 'linux';
