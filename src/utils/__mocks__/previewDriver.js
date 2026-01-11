import { vi } from 'vitest';

const preview = vi.fn();

const close = vi.fn();

const driver = {
  preview,
  close,
};

export default driver;
