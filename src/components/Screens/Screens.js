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

    // Default animation from center?
    const getOrigin = () => ({
      width: get(params, 'origin.width', 1),
      height: get(params, 'origin.height', 1),
      top: get(params, 'origin.top', window.innerWidth / 2),
      left: get(params, 'origin.left', window.innerHeight / 2),
    });

    const variants = {
      hidden: {
        opacity: 0.5,
      },
      in: () => {
        const origin = getOrigin();
        const scaleY = origin.width / window.innerWidth;
        const scaleX = origin.height / window.innerHeight;

        return {
          opacity: [0.5, 1],
          translateY: [origin.top, 0],
          translateX: [origin.left, 0],
          scaleY: [scaleY, 1],
          scaleX: [scaleX, 1],
          transition: {
            duration: getCSSVariableAsNumber('--animation-duration-fast-ms') * 0.001,
            when: 'beforeChildren',
          },
        };
      },
    };

    const style = {
      position: 'absolute',
      transformOrigin: 'top left',
      zIndex: getCSSVariableAsNumber('--z-panel') + index,
      width: '100vw',
      height: '100vh',
      top: 0,
      left: 0,
      background: 'var(--background)',
    };

    return (
      <motion.div
        key={screen}
        style={style}
        animate="in"
        initial="hidden"
        variants={variants}
      >
        <motion.div
          key={`${screen}_content`}
          variants={{
            in: { opacity: 1 },
            hidden: { opacity: 0 },
            transition: { duration: 0.1 },
          }}
        >
          <ScreenComponent
            {...params}
            onComplete={onComplete}
          />
        </motion.div>
      </motion.div>
    );
  });

  return screens;
};

Screens.propTypes = {
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
