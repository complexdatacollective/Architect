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

// Maps for supported asset types within the app. Used by asset chooser.
// Remember to also update getNetworkType when changing these!

export const SUPPORTED_MIME_TYPE_MAP = {
  network: ['application/json', 'text/csv', 'application/vnd.ms-excel'],
  image: ['image/*'],
  audio: ['audio/*'],
  video: ['video/*'],
};

export const SUPPORTED_EXTENSION_TYPE_MAP = {
  network: ['.csv', '.json'],
  image: ['.jpg', '.jpeg', '.gif', '.png'],
  audio: ['.mp3', '.aiff'],
  video: ['.mov', '.mp4'],
};
