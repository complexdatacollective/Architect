import { get } from 'lodash';
import { defaultProps } from 'recompose';

const withDefaults = defaultProps({
  name: 'subject',
  parse: value => ({ type: value, entity: 'edge' }),
  format: value => get(value, 'type'),
});

export default withDefaults;
