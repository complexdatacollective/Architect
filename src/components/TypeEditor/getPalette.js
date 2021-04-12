import { COLOR_PALETTE_BY_ENTITY, COLOR_PALETTES } from '../../config';

const getPalette = (category) => {
  const name = category === 'edge'
    ? COLOR_PALETTE_BY_ENTITY.edge
    : COLOR_PALETTE_BY_ENTITY.node;

  const size = COLOR_PALETTES[name];

  return { name, size };
};

export default getPalette;
