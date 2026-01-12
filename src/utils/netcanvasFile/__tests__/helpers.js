import { vi } from 'vitest';
import path from 'path';
import { APP_SCHEMA_VERSION } from '@app/config';

const mockProtocolPath = path.join(__dirname, '..', '..', 'network-canvas', 'integration-tests', 'data', 'mock.netcanvas');
const mockProtocol = { description: 'test protocol', schemaVersion: APP_SCHEMA_VERSION };

const mockAndLog = (targets) => {
  const logger = vi.fn();

  Object.keys(targets).forEach((name) => {
    const [target, result] = targets[name];
    let count = 0;
    target.mockImplementation((...args) => {
      logger(name, args);
      count += 1;
      const r = result.length ? result[count] : result;
      if (typeof r === 'function') {
        return r(...args);
      }
      return r;
    });
  });

  return logger;
};

export {
  mockProtocolPath,
  mockProtocol,
  mockAndLog,
};
