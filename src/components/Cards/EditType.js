import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submit, isDirty, isInvalid } from 'redux-form';
import { get } from 'lodash';
import { Button } from '../../ui/components';
import TypeEditor, { formName } from '../TypeEditor';
import Card from './ProtocolCard';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as variableRegistryActions} from '../../ducks/modules/protocol/variableRegistry';

/**
 * This manages the display of the TypeEditor, provides it with
 * initial data, and handles redux actions for updating the protocol.
 */
class EditType extends PureComponent {
  static propTypes = {
    submit: PropTypes.func.isRequired,
    hasUnsavedChanges: PropTypes.bool,
    hasErrors: PropTypes.bool,
    onComplete: PropTypes.func.isRequired,
    show: PropTypes.bool,
  };

  static defaultProps = {
    show: true,
    hasErrors: false,
    hasUnsavedChanges: false,
  };

  onSubmit = (form) => {
    const {
      category,
      type,
    } = this.props;
    console.log('OnSubmit', form);

    this.props.updateType(category, type, form);

    this.props.onComplete();
  }

  submit = () => {
    this.props.submit(formName);
  }

  renderButtons() {
    const saveButton = (
      <Button
        key="save"
        size="small"
        onClick={this.submit}
        color="white"
        iconPosition="right"
        disabled={this.props.hasErrors}
      >
        Save
      </Button>
    );

    return this.props.hasUnsavedChanges ? [saveButton] : [];
  }

  render() {
    const {
      initialValues,
      show,
    } = this.props;

    return (
      <Card
        buttons={this.renderButtons()}
        show={show}
        onCancel={this.props.onComplete}
      >
        <TypeEditor
          initialValues={initialValues}
          form={formName}
          onSubmit={this.onSubmit}
        />
      </Card>
    );
  }
}

const editFormIsDirty = isDirty(formName);
const editFormIsInvalid = isInvalid(formName);

function mapStateToProps(state, props) {
  const protocol = getProtocol(state);
  const initialValues = get(protocol, 'variableRegistry.node.person');

  console.log(props);

  const category = get(props, 'match.params.category');
  const type = get(props, 'match.params.type');

  return {
    initialValues,
    category,
    type,
    hasUnsavedChanges: editFormIsDirty(state),
    hasErrors: editFormIsInvalid(state),
  };
}

const mapDispatchToProps = dispatch => ({
  submit: bindActionCreators(submit, dispatch),
  updateType: bindActionCreators(variableRegistryActions.updateType, dispatch),
});

export { EditType };

export default connect(mapStateToProps, mapDispatchToProps)(EditType);
