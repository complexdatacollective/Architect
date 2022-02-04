import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';
import { motion, useAnimation } from 'framer-motion';

const Tip = ({ type, icon, children }) => {
  const classes = cx('tip', `tip__${type}`);

  const animation = useAnimation();

  return (
    <div className={classes}>
      { icon
        && (
          <motion.div
            animate={animation}
            style={{
              transformOrigin: 'center',
            }}
            onViewportEnter={() => animation.start({
              rotate: [-15, 10, -7, 0],
              scale: [1, 1.2, 1],
              transition: {
                delay: 0.5,
              },
            })}
          >
            <Icon name={type} />
          </motion.div>
        )}
      <div className="tip__content">
        {children}
      </div>
    </div>
  );
};

Tip.propTypes = {
  type: PropTypes.oneOf(['info', 'warning', 'error']),
  icon: PropTypes.bool,
  children: PropTypes.node,
};

Tip.defaultProps = {
  type: 'info',
  icon: true,
  children: null,
};

export default Tip;
