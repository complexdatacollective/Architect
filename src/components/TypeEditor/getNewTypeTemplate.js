import { size, get } from 'lodash';
import { COLOR_PALETTE_BY_ENTITY, COLOR_PALETTES } from '../../config';

const getNextCategoryColor = ({ protocol, category }) => {
  if (!protocol || !category) { return null; }
  const paletteName = category === 'edge' ?
    COLOR_PALETTE_BY_ENTITY.edge :
    COLOR_PALETTE_BY_ENTITY.node;
  const paletteSize = COLOR_PALETTES[paletteName];
  const typeCount = size(get(protocol, ['variableRegistry', category], {}));
  const nextNumber = (typeCount % paletteSize) + 1;
  const nextColor = `${paletteName}-${nextNumber}`;

  return nextColor;
};

const getNewTypeTemplate = ({ protocol, category }) => ({
  iconVariant: 'add-a-person',
  color: getNextCategoryColor({ protocol, category }),
});

export default getNewTypeTemplate;
