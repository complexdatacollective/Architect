/* eslint-disable import/prefer-default-export */

export const LABEL_VARIABLE_TYPES = new Set([
  'text',
  'number',
  'datetime',
]);

// Color palette sizes, they follow the pattern: ord-color-seq-1...ord-color-seq-n
export const COLOR_PALETTES = {
  'ord-color-seq': 8,
  'node-color-seq': 10,
  'edge-color-seq': 8,
};

export const COLOR_PALETTE_BY_ENTITY = {
  ordinal: 'ord-color-seq',
  node: 'node-color-seq',
  edge: 'edge-color-seq',
};

// Target protocol schema version. Used to determine compatibility & migration
export const APP_SCHEMA_VERSION = 8;

export const SAMPLE_PROTOCOL_URL = 'https://assets.networkcanvas.com/public/protocols/Sample%20Protocol%20v4.netcanvas';

// Maps for supported asset types within the app. Used by asset chooser.
export const SUPPORTED_EXTENSION_TYPE_MAP = {
  network: ['.csv', '.json'],
  image: ['.jpg', '.jpeg', '.gif', '.png'],
  audio: ['.mp3', '.aiff', '.m4a'],
  video: ['.mov', '.mp4'],
  geojson: ['.geojson'],
};
