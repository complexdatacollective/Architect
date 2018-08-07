import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

const COLOR_OPTIONS = {
  node: times(8, index => `node-color-seq-${(index + 1)}`)
    .map(asColorOption),
  edge: times(10, index => `edge-color-seq-${(index + 1)}`)
    .map(asColorOption),
};

const ICON_OPTIONS = [
  'add-a-person',
  'add-a-place',
];

const getNextCategoryColor = ({ protocol, category }) => {
  if (!protocol || !category) { return null; }
  const categoryOptions = COLOR_OPTIONS[category];
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
            colorOptions={COLOR_OPTIONS}
            iconOptions={ICON_OPTIONS}
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
  submit: bindActionCreators(submit, dispatch),
  updateType: (category, type, form) => {
    dispatch(variableRegistryActions.updateType(category, type, parse(form)));
  },
  createType: (category, form) => {
    dispatch(variableRegistryActions.createType(category, parse(form)));
  },
});

export { EditType };

export default connect(mapStateToProps, mapDispatchToProps)(EditType);
