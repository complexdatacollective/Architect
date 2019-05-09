/* eslint-disable global-require */
import { ipcRenderer } from 'electron';

const preview = (protocol = {}, stageId = 0) => {
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
