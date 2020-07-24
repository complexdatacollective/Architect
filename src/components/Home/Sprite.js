import React from 'react';
import PropTypes from 'prop-types';

const Sprite = ({
  src,
  ...styles
}) => {
  const style = {
    ...styles,
    backgroundImage: `url(${src})`,
  };

  return <div className="sprite" style={style} />;
};

Sprite.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Sprite;
