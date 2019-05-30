import initSaveCopy from './initSaveCopy';
import initConfirmClose from './initConfirmClose';

const initIPCListeners = () => {
  initConfirmClose();
  initSaveCopy();
};

export default initIPCListeners;
