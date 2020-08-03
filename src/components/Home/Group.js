import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { motion } from 'framer-motion';
import { Icon } from '@codaco/ui';

const baseVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const Group = ({
  children,
  color,
  icon,
  tada,
  className,
  center,
}) => {
  const styles = {
    backgroundColor: `var(--color-${color})`,
  };

  const classes = cx(
    'home-group',
    className,
    {
      'home-group--icon': icon,
      'home-group--center': center,
    },
  );

  const iconVariant = tada ?
    {
      ...baseVariant,
      animate: { opacity: [1, 1], rotate: [-15, 10, -7, 0] },
    } :
    baseVariant;

  return (
    <motion.div className={classes} style={styles}>
      { icon &&
        <motion.div
          className="home-group__icon"
          variants={iconVariant}
        >
          <Icon name={icon} />
        </motion.div>
      }
      {children}
    </motion.div>
  );
};

Group.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.string,
  tada: PropTypes.bool,
  center: PropTypes.bool,
};

Group.defaultProps = {
  children: null,
  className: null,
  color: 'platinum--dark',
  icon: null,
  tada: false,
  center: false,
};

export default Group;
