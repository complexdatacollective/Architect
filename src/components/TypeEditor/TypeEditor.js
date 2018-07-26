import React from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import { Field } from 'redux-form';
import { getCSSVariableAsString } from '../../utils/CSSVariables';
import { ValidatedField } from '../Form';
import Guidance from '../Guidance';
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

const COLOR_OPTIONS = [
  'color-neon-coral',
  'color-sea-serpent',
  'color-purple-pizazz',
  'color-neon-carrot',
  'color-kiwi',
  'color-cerulean-blue',
  'color-paradise-pink',
  'color-mustard',
].map(
  name =>
    ({
      name,
      color: getColorByVariable(`--${name}`),
    }),
);

const ICON_OPTIONS = [
  'add-a-context',
  'add-a-person',
  'add-a-place',
  'add-a-relationship',
];

const TypeEditor = ({
  toggleCodeView,
  form,
  category,
  type,
  dirty,
  valid,
  displayVariables,
}) => (
  <div className="type-editor editor__sections">
    { type && <h1>Edit &quot;{type}&quot; {category}</h1> }
    { !type && <h1>Create {category}</h1> }
    { dirty && !valid && (
      <p style={{ color: 'var(--error)' }}>
        There are some errors that need to be fixed before this can be saved!
      </p>
    ) }
    <small>(<a onClick={toggleCodeView}>Show Code View</a>)</small>

    { !type &&
      <Guidance contentId="guidance.registry.type.color">
        <div className="editor__section">
          <h2>Name</h2>

          <ValidatedField
            component={Fields.Text}
            name="type"
            label="Enter a name for this type"
            normalize={value => value.replace(/[^a-zA-Z0-9_]+/, '')}
            validation={{ required: true }}
          />
        </div>
      </Guidance>
    }

    <Guidance contentId="guidance.registry.type.color">
      <div className="editor__section">
        <h2>Color</h2>

        <ValidatedField
          component={ArchitectFields.ColorPicker}
          name="color"
          colors={COLOR_OPTIONS}
          validation={{ required: true }}
        />
      </div>
    </Guidance>

    { category === 'node' &&
      <React.Fragment>
        <Guidance contentId="guidance.registry.type.icon">
          <div className="editor__section">
            <h2>Icon</h2>

            <ValidatedField
              component={Fields.RadioGroup}
              name="iconVariant"
              options={ICON_OPTIONS}
              optionComponent={IconOption}
              validation={{ required: true }}
            />
          </div>
        </Guidance>

        <Guidance contentId="guidance.registry.type.displayVariable">
          <div className="editor__section">
            <h2>Display Variable</h2>

            <Field
              component={ArchitectFields.Select}
              name="displayVariable"
              options={displayVariables}
            >
              <option value="">&mdash; Select display variable &mdash;</option>
            </Field>
          </div>
        </Guidance>
      </React.Fragment>
    }

    <Guidance contentId="guidance.registry.type.variables">
      <div className="editor__section">
        <h2>Variables</h2>
        <Variables
          form={form}
          name="variables"
        />
      </div>
    </Guidance>
  </div>
);

TypeEditor.propTypes = {
  toggleCodeView: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  type: PropTypes.string,
  category: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
  displayVariables: PropTypes.array.isRequired,
};

TypeEditor.defaultProps = {
  type: null,
};

export { TypeEditor };

export default TypeEditor;
