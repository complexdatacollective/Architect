import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import EditStage from './EditStage';
import EditSkipLogic from './EditSkipLogic';
import ViewForms from './ViewForms';
import EditForm from './EditForm';
// import Codebook from './Codebook';
import EditType from './EditType';
import { actionCreators as uiActions } from '../../ducks/modules/ui';

const NotFound = () => (<div> Screen not found </div>);

const NAMES = {
  stage: EditStage,
  skip: EditSkipLogic,
  forms: ViewForms,
  form: EditForm,
  // codebook: Codebook,
  type: EditType,
};

const getScreenComponent = screen =>
  get(NAMES, screen, NotFound);

const Screens = (props) => {
  const screens = props.screens.map(({ screen, params }) => {
    const ScreenComponent = getScreenComponent(screen);

    return (
      <ScreenComponent
        {...params}
        show
        onComplete={result => props.closeScreen(screen, result)}
        key={screen}
      />
    );
  });

  return (
    <div className="screens">
      {screens}
    </div>
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
