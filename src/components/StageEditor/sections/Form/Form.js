import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { change as changeField } from 'redux-form';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { toPairs, map, get, pickBy, isEqual } from 'lodash';
import Guidance from '../../../Guidance';
import ValidatedField from '../../../Form/ValidatedField';
import { Button } from '../../../../ui/components';
import { RadioGroup } from '../../../../ui/components/Fields';
import { getProtocol } from '../../../../selectors/protocol';
import { actionCreators as uiActions } from '../../../../ducks/modules/ui';
import FormCard from './FormCard';

const formOption = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.string,
});

const onUIMessage = (ui, prevUI, screen, handler) => {
  if (isEqual(ui, prevUI)) { return false; }
  if (ui.screen !== screen) { return false; }
  return handler(ui.params);
};

class Form extends Component {
  static propTypes = {
    forms: PropTypes.arrayOf(formOption),
    disabled: PropTypes.bool,
    nodeType: PropTypes.string,
    change: PropTypes.func.isRequired,
    openScreen: PropTypes.func.isRequired,
    ui: PropTypes.object,
  };

  static defaultProps = {
    disabled: false,
    selectedForm: null,
    nodeType: null,
    ui: {},
    forms: [],
  };

  componentDidUpdate({ ui: prevMessage }) {
    const message = this.props.ui;
    onUIMessage(message, prevMessage, 'form', this.handleNewFormMessage);
  }

  handleNewFormMessage = (params) => {
    const newFormNodeType = get(params, 'form.type');
    const newFormName = get(params, 'formName');
    if (newFormName && newFormNodeType === this.props.nodeType) {
      this.props.change(newFormName);
    }
  };

  handleClickCreateNewForm = () => {
    this.showFormEditor();
  };

  showFormEditor = () => {
    this.props.openScreen('form');
  };

  render() {
    const {
      forms,
      disabled,
      nodeType,
    } = this.props;

    const formClasses = cx(
      'stage-editor-section',
      { 'stage-editor-section--disabled': disabled },
    );

    return (
      <Guidance contentId="guidance.editor.form">
        <div className={formClasses}>
          <h2 id="issue-form">Form</h2>
          <p>Which form should be used to create and edit nodes on this stage?</p>
          <div className="stage-editor-section-form">
            <ValidatedField
              name="form"
              component={RadioGroup}
              className="stage-editor-section-form__cards"
              format={value => (value === '' ? null : value)}
              defaultValue={nodeType}
              optionComponent={FormCard}
              options={forms}
              validation={{ requiredAcceptsNull: true }}
            />

            <Button onClick={this.handleClickCreateNewForm}>Create new form</Button>
          </div>
        </div>
      </Guidance>
    );
  }
}

const getNodeFormOptions = (forms, nodeType) => {
  const formsAsPairs = toPairs(forms);

  const validForms = pickBy(
    formsAsPairs,
    ([, form]) =>
      form.type === nodeType && form.entity === 'node',
  );

  const asOptions = map(
    validForms,
    ([name, form]) =>
      ({ value: name, label: form.title }),
  );

  return [{ value: null, label: null }]
    .concat(asOptions);
};

const mapStateToProps = (state, props) => {
  const protocol = getProtocol(state);
  const formValues = props.form.getValues(state, 'subject', 'form');
  const nodeType = get(formValues, 'subject.type', null);
  const selectedForm = get(formValues, 'form', undefined);
  const formOptions = getNodeFormOptions(protocol.forms, nodeType);

  return {
    nodeType,
    ui: state.ui.message,
    forms: formOptions,
    disabled: !nodeType,
    selectedForm,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  reset: () => dispatch(changeField(form.name, 'form', null)),
  change: value => dispatch(changeField(form.name, 'form', value)),
  openScreen: bindActionCreators(uiActions.openScreen, dispatch),
});

export { Form };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Form);
