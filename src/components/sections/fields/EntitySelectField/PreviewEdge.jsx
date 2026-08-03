import cx from 'classnames';
import PropTypes from 'prop-types';

import { Icon } from '@codaco/ui';

const PreviewEdge = ({ label, color, onClick, selected }) => (
  <div
    className={cx(
      'preview-edge',
      { 'preview-edge--selected': selected },
      { 'preview-edge--clickable': onClick },
    )}
    style={{ '--edge-color': `var(--${color})` }}
    onClick={!selected ? onClick : undefined}
  >
    <Icon name="links" color={color} />
    {label}
  </div>
);

PreviewEdge.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
};

PreviewEdge.defaultProps = {
  onClick: null,
  selected: false,
};

export default PreviewEdge;
