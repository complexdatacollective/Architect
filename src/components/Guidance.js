import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, defaultProps } from 'recompose';
import { actionCreators as guidedActionCreators } from '../ducks/modules/guidance';

const mapDispatchToProps = {
  setGuidance: guidedActionCreators.setGuidance,
  unsetGuidance: guidedActionCreators.unsetGuidance,
};

const guidanceSetters = connect(null, mapDispatchToProps);

const interactionHandlers = withHandlers(
  ({ focus, setGuidance, unsetGuidance }) => {
    const focusType = focus ? 'focus' : 'mouse';
    const handleSet = ({ contentId }) =>
      () => setGuidance(contentId, focusType);
    const handleUnset = () => () => unsetGuidance(focusType);

    if (focus) {
      return {
        onFocus: handleSet,
        onBlur: handleUnset,
      };
    }

    return {
      onMouseEnter: handleSet,
      onMouseLeave: handleUnset,
    };
  },
);

const withGuidance = compose(
  defaultProps({ focus: false }),
  guidanceSetters,
  interactionHandlers,
);

const Guidance = ({
  setGuidance,
  unsetGuidance,
  focus,
  contentId,
  children,
  ...props
}) => (
  <div {...props}>
    {children}
  </div>
);

export { withGuidance };

export default withGuidance(Guidance);
