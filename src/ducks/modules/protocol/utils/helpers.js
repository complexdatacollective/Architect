/* eslint-disable import/prefer-default-export */

import { size, get } from 'lodash';
import { COLOR_PALETTE_BY_ENTITY, COLOR_PALETTES } from '../../../../config';

export const getNextCategoryColor = (protocol, entity) => {
  if (!protocol || !entity) { return null; }
  const paletteName = entity === 'edge'
    ? COLOR_PALETTE_BY_ENTITY.edge
    : COLOR_PALETTE_BY_ENTITY.node;
  const paletteSize = COLOR_PALETTES[paletteName];
  const typeCount = size(get(protocol, ['codebook', entity], {}));
  const nextNumber = (typeCount % paletteSize) + 1;
  const nextColor = `${paletteName}-${nextNumber}`;

  return nextColor;
};
