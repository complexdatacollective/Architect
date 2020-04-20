import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionCreators as screenActions } from '@modules/ui/screens';

const Link = ({
  children,
  screen,
  openScreen,
  ...options
}) => {
  const handleOpenStage = useCallback(() => {
    openScreen(screen, options);
    onClick();
  }, ['openScreen']);

  return (
    <div onClick={handleOpenStage}>
      {children}
    </div>
  );
};

Link.propTypes = {
  openScreen: PropTypes.func.isRequired,
  screen: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const mapDispatchToProps = {
  openScreen: screenActions.openScreen,
};

export default connect(null, mapDispatchToProps)(Link);
