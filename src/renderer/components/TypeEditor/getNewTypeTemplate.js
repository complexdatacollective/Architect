import { getNextCategoryColor } from '../../ducks/modules/protocol/utils/helpers';

const getNewTypeTemplate = ({ protocol, entity }) => (
  {
    ...(entity.type === 'node' && { iconVariant: 'add-a-person' }),
    color: getNextCategoryColor(protocol, entity),
  }
);

export default getNewTypeTemplate;
