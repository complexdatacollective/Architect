import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submit, isDirty, isInvalid } from 'redux-form';
import { get } from 'lodash';
import { Button } from '../../ui/components';
import TypeEditor, { formName, parse, format } from '../TypeEditor';
import Card from './ProtocolCard';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as variableRegistryActions } from '../../ducks/modules/protocol/variableRegistry';

/**
 * This component manages the display of TypeEditor, provides it with
 * initial data, and handles redux actions for updating the protocol.
 */
class EditType extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    submit: PropTypes.func.isRequired,
    createType: PropTypes.func.isRequired,
    updateType: PropTypes.func.isRequired,
    category: PropTypes.string,
    type: PropTypes.string,
    hasUnsavedChanges: PropTypes.bool,
    hasErrors: PropTypes.bool,
    onComplete: PropTypes.func.isRequired,
    show: PropTypes.bool,
  };

  static defaultProps = {
    show: true,
    hasErrors: false,
    hasUnsavedChanges: false,
    category: null,
    type: null,
  };

  onSubmit = (form) => {
    const {
      category,
      type,
    } = this.props;

    if (!type) {
      this.props.createType(category, form);
    } else {
      this.props.updateType(category, type, form);
    }

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
      category,
      type,
    } = this.props;

    return (
      <Card
        buttons={this.renderButtons()}
        show={show}
        onCancel={this.props.onComplete}
      >
        { category &&
          <TypeEditor
            initialValues={initialValues}
            form={formName}
            category={category}
            type={type}
            onSubmit={this.onSubmit}
          />
        }
      </Card>
    );
  }
}

const editFormIsDirty = isDirty(formName);
const editFormIsInvalid = isInvalid(formName);

function mapStateToProps(state, props) {
  const category = get(props, 'match.params.category');
  const type = get(props, 'match.params.type');

  const protocol = getProtocol(state);
  const typeConfiguration = get(protocol, ['variableRegistry', category, type]);

  return {
    initialValues: format(typeConfiguration),
    category,
    type,
    hasUnsavedChanges: editFormIsDirty(state),
    hasErrors: editFormIsInvalid(state),
  };
}

const mapDispatchToProps = dispatch => ({
  submit: bindActionCreators(submit, dispatch),
  updateType: (category, type, form) => {
    dispatch(variableRegistryActions.updateType(category, type, parse(form)));
  },
  createType: (category, { type, ...form }) => {
    dispatch(variableRegistryActions.createType(category, type, parse(form)));
  },
});

export { EditType };

export default connect(mapStateToProps, mapDispatchToProps)(EditType);
