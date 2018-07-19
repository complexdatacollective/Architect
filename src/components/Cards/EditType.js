import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submit, isDirty, isInvalid } from 'redux-form';
import { get, mapValues, values, reduce, omit, map } from 'lodash';
import { Button } from '../../ui/components';
import TypeEditor, { formName } from '../TypeEditor';
import Card from './ProtocolCard';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as variableRegistryActions } from '../../ducks/modules/protocol/variableRegistry';

/**
 * This manages the display of the TypeEditor, provides it with
 * initial data, and handles redux actions for updating the protocol.
 */
class EditType extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    submit: PropTypes.func.isRequired,
    updateType: PropTypes.func.isRequired,
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
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

const protocolAsFormValidations = validation =>
  _.reduce(
    validation,
    (memo, value, key) => [...memo, { type: key, value }],
    [],
  );

// convert protocol format into redux-form compatible format
const protocolAsForm = configuration => ({
  ...configuration,
  variables: values(mapValues(
    get(configuration, 'variables', {}),
    (variable, key) => ({
      ...variable,
      name: key,
      id: key,
      validation: protocolAsFormValidations(variable.validation),
    }),
  )),
});

const formAsProtocolValidations = validation =>
  reduce(
    validation,
    (memo, { type, value }) =>
      ({ ...memo, [type]: value }),
    {},
  );

// convert redux-form format into protocol format
const formAsProtocol = configuration => ({
  ...configuration,
  variables: reduce(
    configuration.variables,
    (memo, { name, ...variable }) => ({
      ...memo,
      [name]: {
        ...omit(variable, ['id']),
        validation: formAsProtocolValidations(variable.validation),
      },
    }),
    {},
  ),
});

const editFormIsDirty = isDirty(formName);
const editFormIsInvalid = isInvalid(formName);

function mapStateToProps(state, props) {
  const category = get(props, 'match.params.category');
  const type = get(props, 'match.params.type');

  const protocol = getProtocol(state);
  const typeConfiguration = get(protocol, ['variableRegistry', category, type]);
  const initialValues = protocolAsForm(typeConfiguration);

  console.log({ typeConfiguration, initialValues });

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
  updateType: (category, type, form) => {
    console.log({ form, formAsProtocol: formAsProtocol(form) });
    dispatch(variableRegistryActions.updateType(category, type, formAsProtocol(form)));
  },
});

export { EditType };

export default connect(mapStateToProps, mapDispatchToProps)(EditType);
