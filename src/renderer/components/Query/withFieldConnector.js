import { withProps } from 'recompose';
import { get } from 'lodash';

const withFieldConnector = withProps(
  (props) => ({
    rules: get(props.input.value, 'rules', []),
    join: get(props.input.value, 'join'),
    onChange: props.input.onChange,
    error: props.meta.error,
  }),
);

export default withFieldConnector;
