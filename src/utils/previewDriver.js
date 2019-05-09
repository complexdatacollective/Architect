/* eslint-disable global-require */
import { ipcRenderer } from 'electron';

const preview = (protocol = {}, stageId = 0) => {
  console.log('ipc send, preview:preview', protocol, stageId);
  ipcRenderer.send('preview:preview', protocol, stageId);
};

const close = () => {
  ipcRenderer.send('preview:close');
};

const driver = {
  preview,
  close,
};

export default driver;
