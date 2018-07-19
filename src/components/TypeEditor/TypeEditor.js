import React from 'react';
import { Form, Field } from 'redux-form';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Color from 'color';
import { range } from 'lodash';
import { getCSSVariableAsString } from '../../utils/CSSVariables';
import { Guided } from '../Guided';
import Guidance from '../Guidance';
import { FormCodeView } from '../CodeView';
import * as Fields from '../../ui/components/Fields';
import * as ArchitectFields from '../Form/Fields';
import Variables from './Variables';
import IconOption from './IconOption';

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
  'add-a-context',
  'add-a-person',
  'add-a-place',
  'add-a-relationship',
];

const TypeEditor = ({
  handleSubmit,
  toggleCodeView,
  showCodeView,
  form,
  category,
  type,
  dirty,
  valid,
  displayVariables,
}) => (
  <Form
    onSubmit={handleSubmit}
    className={cx('type-editor', { 'type-editor--show-code': showCodeView })}
  >
    <FormCodeView toggleCodeView={toggleCodeView} form={form} />
    <Guided
      className="type-editor__sections"
      form={form}
    >
      <h1>Edit &quot;{type}&quot; {category}</h1>
      { dirty && !valid && (
        <p style={{ color: 'var(--error)' }}>
          There are some errors that need to be fixed before this can be saved!
        </p>
      ) }
      <small>(<a onClick={toggleCodeView}>Show Code View</a>)</small>

      <Guidance contentId="guidance.registry.type.color">
        <div className="type-editor__section">
          <h2>Color</h2>

          <Field
            component={ArchitectFields.ColorPicker}
            name="color"
            colors={COLOR_OPTIONS}
          />
        </div>
      </Guidance>

      <Guidance contentId="guidance.registry.type.icon">
        <div className="type-editor__section">
          <h2>Icon</h2>

          <Field
            component={Fields.RadioGroup}
            name="iconVariant"
            options={ICON_OPTIONS}
            optionComponent={IconOption}
          />
        </div>
      </Guidance>

      <Guidance contentId="guidance.registry.type.displayVariable">
        <div className="type-editor__section">
          <h2>Display Variable</h2>

          <Field
            component={ArchitectFields.Select}
            name="displayVariable"
            options={displayVariables}
          />
        </div>
      </Guidance>

      <Guidance contentId="guidance.registry.type.variables">
        <div className="type-editor__section">
          <h2>Variables</h2>
          <Variables
            form={form}
            name="variables"
          />
        </div>
      </Guidance>
    </Guided>
  </Form>
);

TypeEditor.propTypes = {
  toggleCodeView: PropTypes.func.isRequired,
  showCodeView: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  displayVariables: PropTypes.array.isRequired,
};

export { TypeEditor };

export default TypeEditor;
