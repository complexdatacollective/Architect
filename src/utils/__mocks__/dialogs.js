import { vi } from 'vitest';

const openProtocolDialog = vi.fn(() => Promise.resolve('/dev/null/fake/user/explored/path'));
const saveProtocolDialog = vi.fn(() => Promise.resolve('/dev/null/fake/user/save/path'));

export {
  openProtocolDialog,
  saveProtocolDialog,
};
