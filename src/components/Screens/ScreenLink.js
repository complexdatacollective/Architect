import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionCreators as screenActions } from '@modules/ui/screens';
import InternalLink from '@components/Link';

const ScreenLink = ({
  children,
  screen,
  openScreen,
  closeExisting,
  closeScreen,
  onClick,
  ...options
}) => {
  const handleOpenStage = useCallback(() => {
    if (closeExisting) {
      closeScreen(closeExisting);
    }
    openScreen(screen, options);
    if (onClick) { onClick(); }
  }, ['openScreen', 'onClick']);

  return (
    <InternalLink onClick={handleOpenStage}>
      {children}
    </InternalLink>
  );
};

ScreenLink.propTypes = {
  openScreen: PropTypes.func.isRequired,
  closeScreen: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  screen: PropTypes.string.isRequired,
  closeExisting: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ScreenLink.defaultProps = {
  onClick: null,
  closeExisting: null,
};

const mapDispatchToProps = {
  openScreen: screenActions.openScreen,
  closeScreen: screenActions.closeScreen,
};

export default connect(null, mapDispatchToProps)(ScreenLink);
