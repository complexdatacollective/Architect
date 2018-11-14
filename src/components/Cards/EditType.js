import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit, isDirty, isInvalid } from 'redux-form';
import Color from 'color';
import { get, times, size } from 'lodash';
import { getCSSVariableAsString } from '../../utils/CSSVariables';
import { Button } from '../../ui/components';
import TypeEditor, { formName, parse, format } from '../TypeEditor';
import Card from './ProtocolCard';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as variableRegistryActions } from '../../ducks/modules/protocol/variableRegistry';

const getColorByVariable = (variable) => {
  try {
    return Color(getCSSVariableAsString(variable)).hex().toLowerCase();
  } catch (e) {
    return '';
  }
};

const asColorOption = name => ({
  name,
  color: getColorByVariable(`--${name}`),
});

const colorOptions = () => ({
  node: times(8, index => `node-color-seq-${(index + 1)}`)
    .map(asColorOption),
  edge: times(10, index => `edge-color-seq-${(index + 1)}`)
    .map(asColorOption),
});

const ICON_OPTIONS = [
  'add-a-person',
  'add-a-place',
];

const getNextCategoryColor = ({ protocol, category }) => {
  if (!protocol || !category) { return null; }
  const categoryOptions = colorOptions()[category];
  const typeCount = size(get(protocol, ['variableRegistry', category], {}));

  return get(categoryOptions, [typeCount % size(categoryOptions), 'name']);
};

const getNewTypeTemplate = ({ protocol, category }) => ({
  iconVariant: 'add-a-person',
  color: getNextCategoryColor({ protocol, category }),
});

/**
 * This component manages the display of TypeEditor, provides it with
 * initial data, and handles redux actions for updating the protocol.
 */
class EditType extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    submitForm: PropTypes.func.isRequired,
    createType: PropTypes.func.isRequired,
    updateType: PropTypes.func.isRequired,
    category: PropTypes.string,
    type: PropTypes.string,
    hasUnsavedChanges: PropTypes.bool,
    onComplete: PropTypes.func.isRequired,
    show: PropTypes.bool,
  };

  static defaultProps = {
    show: true,
    hasUnsavedChanges: false,
    category: null,
    type: null,
  };

  get buttons() {
    const saveButton = (
      <Button
        key="save"
        onClick={this.props.submitForm}
        iconPosition="right"
      >
        Continue
      </Button>
    );

    return this.props.hasUnsavedChanges ? [saveButton] : [];
  }

  handleSubmit = (form) => {
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

  handleCancel = this.props.onComplete;

  render() {
    const {
      initialValues,
      show,
      category,
      type,
    } = this.props;

    return (
      <Card
        buttons={this.buttons}
        show={show}
        onCancel={this.handleCancel}
      >
        { category &&
          <TypeEditor
            initialValues={initialValues}
            form={formName}
            category={category}
            type={type}
            colorOptions={colorOptions()}
            iconOptions={ICON_OPTIONS}
            onSubmit={this.handleSubmit}
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
  const typeConfiguration = get(
    protocol,
    ['variableRegistry', category, type],
    getNewTypeTemplate({ protocol, category }),
  );

  return {
    initialValues: format(typeConfiguration),
    category,
    type,
    hasUnsavedChanges: editFormIsDirty(state),
    hasErrors: editFormIsInvalid(state),
  };
}

const mapDispatchToProps = dispatch => ({
  submitForm: () => dispatch(submit(formName)),
  updateType: (category, type, form) => {
    dispatch(variableRegistryActions.updateType(category, type, parse(form)));
  },
  createType: (category, form) => {
    dispatch(variableRegistryActions.createType(category, parse(form)));
  },
});

export { EditType };

export default connect(mapStateToProps, mapDispatchToProps)(EditType);
