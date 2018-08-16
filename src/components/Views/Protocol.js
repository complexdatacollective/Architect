import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { pick, get } from 'lodash';
import history from '../../history';
import { Button, Icon } from '../../ui/components';
import { getProtocol } from '../../selectors/protocol';
import ShowRoute from '../../components/ShowRoute';
import EditSkipLogic from '../Cards/EditSkipLogic';
import EditStage from '../Cards/EditStage';
import EditForm from '../Cards/EditForm';
import VariableRegistry from '../Cards/VariableRegistry';
import ViewForms from '../Cards/ViewForms';
import EditType from '../Cards/EditType';
import Timeline from '../../components/Timeline';
import ControlBar from '../ControlBar';
// import { actionCreators as protocolFileActions } from '../../ducks/modules/protocol/file';

const RightArrow = <Icon name="arrow-right" />;

class Protocol extends PureComponent {
  static propTypes = {
    overview: PropTypes.shape({
      title: PropTypes.string,
      version: PropTypes.string,
      forms: PropTypes.object,
      variableRegistry: PropTypes.object,
    }).isRequired,
    stages: PropTypes.array.isRequired,
    hasUnsavedChanges: PropTypes.bool,
    hasChanges: PropTypes.bool,
    match: PropTypes.object,
    location: PropTypes.object.isRequired,
    saveProtocol: PropTypes.func.isRequired,
    isProtocol: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    hasUnsavedChanges: false,
    hasChanges: false,
    match: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      new: {
        insertAtIndex: null,
        type: null,
      },
    };
  }

  get protocolPath() {
    return get(this.props.match, 'params.protocol');
  }

  handleRouteComplete = (goto) => {
    if (this.protocolPath) {
      switch (goto) {
        case 'protocol':
          history.push(`/edit/${this.protocolPath}/`);
          break;
        default:
          history.goBack();
      }
    }
  }

  goto = (location = '') => {
    history.push(`/edit/${this.protocolPath}/${location}`);
  }

  createStage = (type, insertAtIndex) =>
    this.goto(`stage?type=${type}&insertAtIndex=${insertAtIndex}`);

  editStage = stageId =>
    this.goto(`stage/${stageId}`);

  editSkipLogic = stageId =>
    this.goto(`skip/${stageId}`);

  render() {
    const {
      overview,
      stages,
      location,
      hasChanges,
      hasUnsavedChanges,
      saveProtocol,
      isProtocol,
    } = this.props;

    if (!isProtocol) { return null; }

    const protocolClasses = cx(
      'protocol',
      {
        'protocol--has-changes': hasChanges,
        'protocol--has-unsaved-changes': hasUnsavedChanges,
      },
    );
    return (
      <div className={protocolClasses}>
        <Timeline
          overview={overview}
          stages={stages}
          location={location}
          onEditStage={this.editStage}
          onEditSkipLogic={this.editSkipLogic}
          onCreateStage={this.createStage}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        <ControlBar show={hasUnsavedChanges}>
          <Button
            size="small"
            onClick={saveProtocol}
            color="white"
            icon={RightArrow}
            iconPosition="right"
          >
            Save
          </Button>
        </ControlBar>

        <ShowRoute
          path={'/edit/:protocol/stage/:id?'}
          location={location}
          component={EditStage}
          onComplete={this.handleRouteComplete}
        />

        <ShowRoute
          path={'/edit/:protocol/skip/:id'}
          location={location}
          component={EditSkipLogic}
          onComplete={this.handleRouteComplete}
        />

        <ShowRoute
          path={'/edit/:protocol/form(s?)'}
          location={location}
          component={ViewForms}
          onComplete={() => this.handleRouteComplete('protocol')}
        />

        <ShowRoute
          path={'/edit/:protocol/form/:form?'}
          location={location}
          component={EditForm}
          onComplete={this.handleRouteComplete}
        />

        <ShowRoute
          path="/edit/:protocol/registry"
          location={location}
          component={VariableRegistry}
          onComplete={() => this.handleRouteComplete('protocol')}
        />

        <ShowRoute
          path="/edit/:protocol/registry/:category/:type?"
          location={location}
          component={EditType}
          onComplete={this.handleRouteComplete}
        />
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const protocol = getProtocol(state);
  const overview = pick(protocol, ['name', 'version', 'variableRegistry', 'externalData', 'forms']);

  return {
    isProtocol: !!props.match,
    overview,
    stages: protocol.stages,
    hasChanges: state.protocol.past.length > 0,
    hasUnsavedChanges: (state.session.lastChanged > state.session.lastSaved),
  };
}

function mapDispatchToProps() {
  return {
    saveProtocol: () => {},
    // saveProtocol: bindActionCreators(protocolFileActions.saveProtocol, dispatch),
  };
}

export { Protocol };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Protocol);
