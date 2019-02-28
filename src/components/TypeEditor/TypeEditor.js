import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { ValidatedField } from '../Form';
import Guidance from '../Guidance';
import * as Fields from '../../ui/components/Fields';
import * as ArchitectFields from '../Form/Fields';
import IconOption from './IconOption';
import { getFieldId } from '../../utils/issues';
import safeName from './safeName';
import { COLOR_PALETTE_BY_ENTITY, COLOR_PALETTES } from '../../config';
import Variables from './Variables';

class TypeEditor extends Component {
  handleChangeLabel = (e, value) => {
    if (this.props.nameTouched) { return; }
    this.props.autofill('name', safeName(value));
  }

  handleNormalizeName = value => safeName(value);

  render() {
    const {
      toggleCodeView,
      form,
      category,
      type,
      iconOptions,
      displayVariables,
    } = this.props;

    const paletteName = category === 'edge' ?
      COLOR_PALETTE_BY_ENTITY.edge :
      COLOR_PALETTE_BY_ENTITY.node;

    const paletteSize = COLOR_PALETTES[paletteName];

    return (
      <React.Fragment>
        <div className="code-button">
          <small>
            (<a onClick={toggleCodeView}>Show Code View</a>)
          </small>
        </div>
        { type && <h1 className="editor__heading">Edit {category}</h1> }
        { !type && <h1 className="editor__heading">Create {category}</h1> }

        <Guidance contentId="guidance.registry.type.label">
          <div className="editor__section">
            <h3 id={getFieldId('label')}>Label</h3>
            <p>
              The node name is how you will refer to this node type in the rest of Architect.
            </p>
            <ValidatedField
              component={Fields.Text}
              name="label"
              validation={{ required: true }}
              onChange={this.handleChangeLabel}
            />
          </div>
        </Guidance>

        <Guidance contentId="guidance.registry.type.label">
          <div className="editor__section">
            <h3 id={getFieldId('name')}>Short Label</h3>
            <p>
              The short name is automatically generated from the node name you entered above, but
              you can change it here if you wish.
            </p>
            <ValidatedField
              component={Fields.Text}
              name="name"
              normalize={this.handleNormalizeName}
              validation={{ required: true }}
            />
          </div>
        </Guidance>

        <Guidance contentId="guidance.registry.type.color">
          <div className="editor__section">
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
          </div>
        </Guidance>

        { category === 'node' &&
          <React.Fragment>
            <Guidance contentId="guidance.registry.type.icon">
              <div className="editor__section">
                <h2 id={getFieldId('iconVariant')}>Icon</h2>
                <p>
                  Choose an icon to display on interfaces that create this node.
                </p>
                <ValidatedField
                  component={Fields.RadioGroup}
                  name="iconVariant"
                  options={iconOptions}
                  optionComponent={IconOption}
                  validation={{ required: true }}
                />
              </div>
            </Guidance>

            <Guidance contentId="guidance.registry.type.displayVariable">
              <div className="editor__section">
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
              </div>
            </Guidance>
          </React.Fragment>
        }

        <Guidance contentId="guidance.registry.type.variables">
          <div className="editor__section">
            <Variables
              form={form}
              name="variables"
              sortableProperties={['name', 'type']}
              initialSortOrder={{
                direction: 'asc',
                property: 'name',
              }}
            />
          </div>
        </Guidance>
      </React.Fragment>
    );
  }
}

TypeEditor.propTypes = {
  toggleCodeView: PropTypes.func.isRequired,
  type: PropTypes.string,
  iconOptions: PropTypes.array,
  category: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
  displayVariables: PropTypes.array.isRequired,
  autofill: PropTypes.func.isRequired,
  nameTouched: PropTypes.bool.isRequired,
};

TypeEditor.defaultProps = {
  type: null,
  colorOptions: { node: [], edge: [] },
  iconOptions: [],
};

export { TypeEditor };

export default TypeEditor;
