/**
 * Preview functionality is disabled pending modernization of the network-canvas submodule.
 * The submodule requires its own security updates (context isolation, preload scripts)
 * before preview can be safely re-enabled.
 */

const PREVIEW_DISABLED_MESSAGE = 'Preview is currently unavailable. The network-canvas submodule requires modernization to support Electron security features.';

const preview = () => {
  // eslint-disable-next-line no-console
  console.warn(PREVIEW_DISABLED_MESSAGE);
};

const close = () => {
  // No-op: preview is disabled
};

const clear = () => {
  // No-op: preview is disabled
};

const driver = {
  preview,
  close,
  clear,
  isDisabled: true,
  disabledMessage: PREVIEW_DISABLED_MESSAGE,
};

export default driver;
