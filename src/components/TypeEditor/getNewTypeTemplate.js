import { getNextCategoryColor } from '../../ducks/modules/protocol/utils';

const getNewTypeTemplate = ({ protocol, category }) => ({
  iconVariant: 'add-a-person',
  color: getNextCategoryColor(protocol, category),
});

export default getNewTypeTemplate;
