import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Sprite = ({
  src,
  animate,
  ...styles
}) => {
  const style = {
    ...styles,
    backgroundImage: `url(${src})`,
  };

  return (
    <motion.div
      className="sprite"
      style={style}
      animate={animate}
    />
  );
};

Sprite.propTypes = {
  src: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  animate: PropTypes.object,
};

Sprite.defaultProps = {
  animate: {},
};

export default Sprite;
