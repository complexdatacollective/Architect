/* eslint-disable import/prefer-default-export */

import { electronAPI } from '@utils/electronBridge';

export const isMacOS = () => electronAPI.platform === 'darwin';

export const isWindows = () => electronAPI.platform === 'win32';

export const isLinux = () => electronAPI.platform === 'linux';
