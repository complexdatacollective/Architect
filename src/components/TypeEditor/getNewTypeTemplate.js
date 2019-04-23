import { getNextCategoryColor } from '../../ducks/modules/protocol/utils';

const getNewTypeTemplate = ({ protocol, entity }) => ({
  iconVariant: 'add-a-person',
  color: getNextCategoryColor(protocol, entity),
});

export default getNewTypeTemplate;
