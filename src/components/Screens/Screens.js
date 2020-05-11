import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { motion } from 'framer-motion';
import Window from '@codaco/ui/lib/components/window';
import { getScreensStack } from '../../selectors/ui';
import { actionCreators as uiActions } from '../../ducks/modules/ui';
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
    const onComplete = result =>
      props.closeScreen(screen, result);

    const centerY = params.origin.top + params.origin.height * 0.5;
    const centerX = params.origin.left + params.origin.width * 0.5;

    const animate = params.origin ?
      (() => {
        const scaleY = params.origin.width / window.innerWidth;
        const scaleX = params.origin.height / window.innerHeight;

        return {
          position: 'absolute',
          zIndex: 100 + index,
          scaleY: [scaleY, 1],
          scaleX: [scaleX, 1],
          transition: { duration: 1 },
        };
      })() :
      {};

    console.table(params);
    console.table(animate);

    return (
      <motion.div
        key={screen}
        style={{
          transformOrigin: `${centerX}px ${centerY}px`,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
        }}
        animate={animate}
      >
        <ScreenComponent
          {...params}
          onComplete={onComplete}
        />
      </motion.div>
    );
  });

  return screens;
};

Screens.propTypes = {
  screens: PropTypes.array.isRequired,
  closeScreen: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
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
