import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';
import { getScreensStack } from '../../selectors/ui';
import { actionCreators as uiActions } from '../../ducks/modules/ui';
import TimelineScreenTransition, { styles } from '../../ui/components/Transitions/TimelineScreen';
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
    const transitionStyle = index > 0 ? styles.WIPE : styles.FADE;
    const onComplete = result =>
      props.closeScreen(screen, result);

    return (
      <TimelineScreenTransition
        style={transitionStyle}
        key={screen}
      >
        {transitionState => (
          <ScreenComponent
            {...params}
            show
            transitionState={transitionState}
            onComplete={onComplete}
          />
        )}
      </TimelineScreenTransition>
    );
  });

  return (
    <TransitionGroup className="screens">
      {screens}
    </TransitionGroup>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(Screens);
