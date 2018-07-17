import React from 'react';
import { Form, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Color from 'color';
import { range, map } from 'lodash';
import { getCSSVariableAsString } from '../../utils/CSSVariables';
import { Guided } from '../Guided';
import Guidance from '../Guidance';
import FormCodeView from '../FormCodeView';
import * as Fields from '../../ui/components/Fields';
import * as ArchitectFields from '../Form/Fields';
import Variables from './Variables';
import Variable from './Variable';

const getColorByVariable = (variable) => {
  try {
    return Color(getCSSVariableAsString(variable)).hex().toLowerCase();
  } catch (e) {
    return '';
  }
};

const COLOR_OPTIONS = range(1, 8)
  .map(
    i =>
      ({
        name: `--node-color-seq-${i}`,
        color: getColorByVariable(`--node-color-seq-${i}`),
      }),
  );

const ICON_OPTIONS = [
  'foo',
  'bar',
  'baz',
];

const TypeEditor = ({
  handleSubmit,
  toggleCodeView,
  codeView,
  form,
  dirty,
  valid,
  displayVariables,
}) => (
  <Form onSubmit={handleSubmit} className={cx('stage-editor', { 'stage-editor--show-code': codeView })}>
    <FormCodeView toggleCodeView={toggleCodeView} form={form} />
    <Guided
      className="stage-editor__sections"
      form={form}
    >
      <h1>Edit Node/Edge</h1>
      { dirty && !valid && (
        <p style={{ color: 'var(--error)' }}>
          There are some errors that need to be fixed before this can be saved!
        </p>
      ) }
      <small>(<a onClick={toggleCodeView}>Show Code View</a>)</small>

      <Guidance contentId="guidance.registry.color">
        <div className="stage-editor-section">
          <h2>Color</h2>

          <Field
            component={ArchitectFields.ColorPicker}
            name="color"
            colors={COLOR_OPTIONS}
          />
        </div>
      </Guidance>

      <Guidance contentId="guidance.registry.icon">
        <div className="stage-editor-section">
          <h2>Icon</h2>

          <Field
            component={Fields.RadioGroup}
            name="iconVariant"
            options={ICON_OPTIONS}
          />
        </div>
      </Guidance>

      <Guidance contentId="guidance.registry.displayVariable">
        <div className="stage-editor-section">
          <h2>Display Variable</h2>

          <Field
            component={ArchitectFields.Select}
            name="displayVariable"
            options={displayVariables}
          />
        </div>
      </Guidance>

      <Variables
        form={form}
        name="variables"
        itemTemplate={{}}
        itemComponent={Variable}
      />
    </Guided>
  </Form>
);

TypeEditor.propTypes = {
  toggleCodeView: PropTypes.func.isRequired,
  codeView: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  displayVariables: PropTypes.array.isRequired,
};

const mapStateToProps = (state, { form }) => {
  const getValue = formValueSelector(form);
  const variables = getValue(state, 'variables');

  return ({
    displayVariables: map(variables, 'name'),
  });
};

export { TypeEditor };

export default connect(
  mapStateToProps,
)(TypeEditor);
