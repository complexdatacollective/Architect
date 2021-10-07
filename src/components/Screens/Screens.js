import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { motion } from 'framer-motion';
import { get } from 'lodash';
import Window from '@codaco/ui/lib/components/window';
import { getCSSVariableAsNumber } from '@codaco/ui/lib/utils/CSSVariables';
import { getScreensStack } from '@selectors/ui';
import { actionCreators as uiActions } from '@modules/ui';
import { getScreenComponent } from './screenIndex';

/**
 * Screen manager for Architect.
 *
 * Any screens present in the `screens` redux state will be rendered by this
 * component.
 *
 * Screens can be opened and closed using the screen module actions:
 * - `openScreen(name, params)`:
 *    `name` is used to find the screen component (screens are listed by name in screenIndex),
 *     and `params` are passed to screen component itself
 *    This will be rendered as `<ScreenComponent {...params} />`
 * - `closeScreen(name, params)`
 */
const Screens = (props) => {
  const screens = props.screens.map(({ screen, params }, index) => {
    const ScreenComponent = getScreenComponent(screen);
    const onComplete = (result) => props.closeScreen(screen, result);

    const zIndex = getCSSVariableAsNumber('--z-panel') + index;

    return (
      <ScreenComponent
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...params}
        zIndex={zIndex}
        layoutId={params.id}
        onComplete={onComplete}
      />
    );
  });

  return screens;
};

Screens.propTypes = {
// eslint-disable-next-line react/forbid-prop-types
screens: PropTypes.array.isRequired,
closeScreen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
screens: getScreensStack(state),
});

const mapDispatchToProps = {
closeScreen: uiActions.closeScreen,
};

export { Screens };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  Window,
)(Screens);
