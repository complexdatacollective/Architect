import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { motion } from 'framer-motion';
import { Icon } from '@codaco/ui';

const Group = ({
  children,
  color,
  icon,
  className,
}) => {
  const styles = {
    backgroundColor: `var(--color-${color})`,
  };

  const classes = cx(
    'home-group',
    className,
    { 'home-group--icon': icon },
  );

  return (
    <div className={classes} style={styles}>
      { icon &&
        <motion.div
          className="home-group__icon"
          initial={{ opacity: 0, translateY: '25%' }}
          animate={{ opacity: 1, translateY: '0%' }}
          transition={{ delay: 0.5 }}
        >
          <Icon name={icon} />
        </motion.div>
      }
      {children}
    </div>
  );
};

Group.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.string,
};

Group.defaultProps = {
  children: null,
  className: null,
  color: 'platinum--dark',
  icon: null,
};

export default Group;
