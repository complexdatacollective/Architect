import { connect } from 'react-redux';
import { getExternalDataPropertyOptions } from './selectors';

/**
 * Provides `externalDataPropertyOptions` (options) prop
 */
const mapStateToProps = (state, props) => ({
  externalDataPropertyOptions: getExternalDataPropertyOptions(state, props),
});

const withExternalDataPropertyOptions = connect(mapStateToProps);

export default withExternalDataPropertyOptions;
