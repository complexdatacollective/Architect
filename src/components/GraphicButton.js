import React from 'react';
import PropTypes from 'prop-types';

const GraphicButton = ({
  children,
  color,
  graphic,
  graphicPosition,
  graphicSize,
  labelPosition,
  onClick,
}) => {
  const styles = {
    backgroundColor: `var(--color-${color})`,
    backgroundImage: `url(${graphic})`,
    backgroundPosition: graphicPosition,
    backgroundSize: graphicSize,
  };

  const labelStyles = {
    ...labelPosition,
  };

  return (
    <div
      className="graphic-button"
      style={styles}
      onClick={onClick}
    >
      <div
        className="graphic-button__label"
        style={labelStyles}
      >
        {children}
      </div>
    </div>
  );
};

GraphicButton.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  graphic: PropTypes.string,
  graphicPosition: PropTypes.string,
  graphicSize: PropTypes.string,
  labelPosition: PropTypes.object,
  onClick: PropTypes.func.isRequired,
};

GraphicButton.defaultProps = {
  color: 'sea-green',
  graphic: null,
  graphicPosition: '50% 50%',
  graphicSize: 'contain',
  labelPosition: {},
};

export default GraphicButton;
