import RuleText from '@components/Query/Rules/PreviewText';
import withDisplayOptions from '@components/Query/Rules/withDisplayOptions';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

const Rule = ({ type, options }) => <RuleText type={type} options={options} />;

Rule.propTypes = {
  type: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
};

export default compose(withDisplayOptions)(Rule);
