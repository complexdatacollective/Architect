import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { getFieldId } from '../../utils/issues';
import * as Fields from '../../ui/components/Fields';
import * as ArchitectFields from '../Form/Fields';
import { ValidatedField } from '../Form';
import Guidance from '../Guidance';
import IconOption from './IconOption';
import getPalette from './getPalette';
import Variables from './Variables';

const ICON_OPTIONS = [
  'add-a-person',
  'add-a-place',
];

const TypeEditor = ({
  form,
  entity,
  type,
  displayVariables,
  isNew,
}) => {
  const { name: paletteName, size: paletteSize } = getPalette(entity);

  return (
    <React.Fragment>
      { type && <h1 className="editor__heading">Edit {entity}</h1> }
      { !type && <h1 className="editor__heading">Create {entity}</h1> }

      <Guidance contentId="guidance.registry.type.label" className="editor__section">
        <h3 id={getFieldId('name')}>Name</h3>
        <p>
          The node name is how you will refer to this node type in the rest of Architect.
        </p>
        <ValidatedField
          component={Fields.Text}
          name="name"
          validation={{ required: true }}
        />
      </Guidance>

      <Guidance contentId="guidance.registry.type.color" className="editor__section">
        <h2 id={getFieldId('color')}>Color</h2>
        <p>
          Choose a color for this node type.
        </p>
        <ValidatedField
          component={ArchitectFields.ColorPicker}
          name="color"
          palette={paletteName}
          paletteRange={paletteSize}
          validation={{ required: true }}
        />
      </Guidance>

      { entity === 'node' &&
        <React.Fragment>
          <Guidance contentId="guidance.registry.type.icon" className="editor__section">
            <h2 id={getFieldId('iconVariant')}>Icon</h2>
            <p>
              Choose an icon to display on interfaces that create this node.
            </p>
            <ValidatedField
              component={Fields.RadioGroup}
              name="iconVariant"
              options={ICON_OPTIONS}
              optionComponent={IconOption}
              validation={{ required: true }}
            />
          </Guidance>

          {!isNew &&
            <Guidance contentId="guidance.registry.type.displayVariable" className="editor__section">
              <h2>Display Variable</h2>
              <p>
                Select a variable to use as a label when displaying this node.
              </p>
              <Field
                component={ArchitectFields.Select}
                name="displayVariable"
                options={displayVariables}
              >
                <option value="">&mdash; Select display variable &mdash;</option>
              </Field>
            </Guidance>
          }
        </React.Fragment>
      }

      {!isNew &&
        <Guidance contentId="guidance.registry.type.variables" className="editor__section">
          <Variables
            form={form}
            name="variables"
            sortableProperties={['name', 'type']}
            initialSortOrder={{
              direction: 'asc',
              property: 'name',
            }}
          />
        </Guidance>
      }
    </React.Fragment>
  );
};

TypeEditor.propTypes = {
  type: PropTypes.string,
  entity: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
  displayVariables: PropTypes.array.isRequired,
  isNew: PropTypes.bool,
};

TypeEditor.defaultProps = {
  type: null,
  colorOptions: { node: [], edge: [] },
  isNew: false,
};

export { TypeEditor };

export default TypeEditor;
