import { getNextCategoryColor } from '../../ducks/modules/protocol/utils/helpers';

const getNewTypeTemplate = ({ protocol, entity }) => ({
  ...(entity.type === 'node' && { icon: 'add-a-person' }),
  ...(entity.type === 'node' && { shape: { default: 'circle' } }),
  color: getNextCategoryColor(protocol, entity),
});

export default getNewTypeTemplate;
