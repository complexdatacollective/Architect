import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ShowRoute from './ShowRoute';
import EditSkipLogic from './Cards/EditSkipLogic';
import EditStage from './Cards/EditStage';
import EditForm from './Cards/EditForm';
import Codebook from './Cards/Codebook';
import ViewForms from './Cards/ViewForms';
import EditType from './Cards/EditType';
import { actionCreators as navigationActions } from '../ducks/modules/navigation';

class Cards extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    goTo: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }

  handleIndexComplete = () => {
    this.props.goTo();
  }

  handleDeepComplete = () => {
    this.props.goBack();
  }

  render() {
    const { location } = this.props;

    return (
      <div>
        <ShowRoute
          path={'/edit/:protocol/stage/:id?'}
          location={location}
          component={EditStage}
          onComplete={this.handleDeepComplete}
        />

        <ShowRoute
          path={'/edit/:protocol/skip/:id'}
          location={location}
          component={EditSkipLogic}
          onComplete={this.handleDeepComplete}
        />

        <ShowRoute
          path={'/edit/:protocol/form(s?)'}
          location={location}
          component={ViewForms}
          onComplete={this.handleIndexComplete}
        />

        <ShowRoute
          path={'/edit/:protocol/form/:form?'}
          location={location}
          component={EditForm}
          onComplete={this.handleDeepComplete}
        />

        <ShowRoute
          path="/edit/:protocol/codebook"
          location={location}
          component={Codebook}
          onComplete={this.handleIndexComplete}
        />

        <ShowRoute
          path="/edit/:protocol/codebook/:category/:type?"
          location={location}
          component={EditType}
          onComplete={this.handleDeepComplete}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  goTo: bindActionCreators(navigationActions.goTo, dispatch),
  goBack: bindActionCreators(navigationActions.goBack, dispatch),
});

export { Cards };

export default connect(null, mapDispatchToProps)(Cards);
