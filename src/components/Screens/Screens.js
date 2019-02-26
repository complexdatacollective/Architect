import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';
import EditStage from './EditStage';
import EditSkipLogic from './EditSkipLogic';
import ViewForms from './ViewForms';
import EditForm from './EditForm';
import Codebook from './VariableRegistry';
import EditType from './EditType';
import EditVariable from './EditVariable';
import { actionCreators as uiActions } from '../../ducks/modules/ui';
import TimelineScreenTransition, { styles } from '../Transitions/TimelineScreen';

const NotFound = () => (<div> Screen not found </div>);

const NAMES = {
  stage: EditStage,
  skip: EditSkipLogic,
  forms: ViewForms,
  form: EditForm,
  codebook: Codebook,
  type: EditType,
  variable: EditVariable,
};

const getScreenComponent = screen =>
  get(NAMES, screen, NotFound);

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
        {state => (
          <ScreenComponent
            {...params}
            show
            state={state}
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
  screens: state.ui.screens,
});

const mapDispatchToProps = dispatch => ({
  closeScreen: bindActionCreators(uiActions.closeScreen, dispatch),
});

export { Screens };

export default connect(mapStateToProps, mapDispatchToProps)(Screens);
