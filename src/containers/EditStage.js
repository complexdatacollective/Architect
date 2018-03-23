import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { reduxForm, Form } from 'redux-form';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import { Button } from 'network-canvas-ui';
import { makeGetStage } from '../selectors/protocol';
import { actionCreators as stageActions } from '../ducks/modules/protocol/stages';
import { ProtocolCard } from '../containers/ProtocolCard';
import StageEditor from '../components/StageEditor';

const defaultStage = {
};

class EditStage extends PureComponent {
  static propTypes = {
    stage: PropTypes.any.isRequired,
    dirty: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    stage: null,
  };

  renderButtons() {
    return [].concat(
      this.props.dirty ? [<Button key="continue" size="small" onClick={this.props.handleSubmit}>Continue</Button>] : [],
    );
  }

  render() {
    const { stage, handleSubmit } = this.props;

    return (
      <Form onSubmit={handleSubmit}>
        <ProtocolCard
          buttons={this.renderButtons()}
          {...pick(this.props, ['show', 'className', 'onCancel'])}
        >
          <StageEditor
            stage={stage}
          />
        </ProtocolCard>
      </Form>
    );
  }
}

function makeMapStateToProps() {
  const getStage = makeGetStage();

  return function mapStateToProps(state, props) {
    const stage = getStage(state, props) || defaultStage;
    return { stage, initialValues: stage };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  };
}

export { EditStage };

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'edit-stage',
    touchOnBlur: false,
    touchOnChange: true,
    enableReinitialize: true,
    onSubmit: (values, _, props) => {
      props.updateStage(props.stageId, values);
      props.onComplete();
    },
  }),
)(EditStage);
