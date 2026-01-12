import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockData = {
  nodes: [],
  edges: [],
};

vi.mock('@utils/electronBridge', () => ({
  electronAPI: {
    fs: {
      readFile: vi.fn(() => JSON.stringify(mockData)),
    },
  },
}));

// Need to import fresh each test to avoid memoization issues
let getAssetData;

describe('getAssetData', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset module to clear memoization
    vi.resetModules();
    const module = await import('../getAssetData');
    getAssetData = module.default;
  });

  it('can load a json network', async () => {
    const source = '/dev/null/myMockSource.json';
    const type = 'network';

    const data = await getAssetData(source, type);
    expect(data).toEqual(mockData);
  });

  it('it caches responses', async () => {
    const source = '/dev/null/myMockSource.json';
    const type = 'network';

    const results = await Promise.all([
      getAssetData(source, type),
      getAssetData(source, type),
    ]);

    const isSameObject = results.every(
      (result, index, all) => result === all[0],
    );

    expect(isSameObject).toBe(true);
  });
});
