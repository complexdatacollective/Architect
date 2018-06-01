import PropTypes from 'prop-types';

const propTypes = {
  isActive: PropTypes.bool,
  anyActive: PropTypes.bool,
  showGuidance: PropTypes.func,
  toggleGuidance: PropTypes.func,
  resetGuidance: PropTypes.func,
};

const defaultProps = {
  isActive: false,
  anyActive: false,
  showGuidance: () => {},
  toggleGuidance: () => {},
  resetGuidance: () => {},
};

export {
  propTypes,
  defaultProps,
};
