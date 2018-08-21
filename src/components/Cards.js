import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import history from '../history';
import ShowRoute from './ShowRoute';
import EditSkipLogic from './Cards/EditSkipLogic';
import EditStage from './Cards/EditStage';
import EditForm from './Cards/EditForm';
import VariableRegistry from './Cards/VariableRegistry';
import ViewForms from './Cards/ViewForms';
import EditType from './Cards/EditType';

class Cards extends Component {
  static propTypes = {
    activeProtocol: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
  }

  handleComplete = (goto) => {
    if (this.props.activeProtocol) {
      switch (goto) {
        case 'protocol':
          history.push(`/edit/${this.props.activeProtocol}/`);
          break;
        default:
          history.goBack();
      }
    }
  }

  render() {
    const { location } = this.props;

    return (
      <div>
        <ShowRoute
          path={'/edit/:protocol/stage/:id?'}
          location={location}
          component={EditStage}
          onComplete={this.handleComplete}
        />

        <ShowRoute
          path={'/edit/:protocol/skip/:id'}
          location={location}
          component={EditSkipLogic}
          onComplete={this.handleComplete}
        />

        <ShowRoute
          path={'/edit/:protocol/form(s?)'}
          location={location}
          component={ViewForms}
          onComplete={() => this.handleComplete('protocol')}
        />

        <ShowRoute
          path={'/edit/:protocol/form/:form?'}
          location={location}
          component={EditForm}
          onComplete={this.handleComplete}
        />

        <ShowRoute
          path="/edit/:protocol/registry"
          location={location}
          component={VariableRegistry}
          onComplete={() => this.handleComplete('protocol')}
        />

        <ShowRoute
          path="/edit/:protocol/registry/:category/:type?"
          location={location}
          component={EditType}
          onComplete={this.handleComplete}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeProtocol: state.session.activeProtocol,
});

export { Cards };

export default connect(mapStateToProps)(Cards);
