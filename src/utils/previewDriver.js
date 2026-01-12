/**
 * Preview driver for Network Canvas Architect.
 *
 * This module provides the interface for controlling the preview window,
 * which displays the Network Canvas interview in a separate window for
 * testing protocols during design.
 */

import { electronAPI } from '@utils/electronBridge';

/**
 * Opens the preview window and sends protocol data to display a specific stage.
 * @param {Object} protocol - The protocol to preview
 * @param {number} stageIndex - The index of the stage to preview
 */
const preview = (protocol, stageIndex) => {
  electronAPI.ipc.send('preview:preview', protocol, stageIndex);
};

/**
 * Closes/hides the preview window.
 */
const close = () => {
  electronAPI.ipc.send('preview:close');
};

/**
 * Clears the preview state without closing the window.
 */
const clear = () => {
  electronAPI.ipc.send('preview:clear');
};

/**
 * Resets the preview window to its initial state.
 */
const reset = () => {
  electronAPI.ipc.send('preview:reset');
};

const driver = {
  preview,
  close,
  clear,
  reset,
  isDisabled: false,
};

export default driver;
