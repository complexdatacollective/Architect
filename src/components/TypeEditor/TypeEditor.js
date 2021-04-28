import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { capitalize, toPairs } from 'lodash';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { getFieldId } from '@app/utils/issues';
import { ValidatedField } from '@components/Form';
import * as ArchitectFields from '@components/Form/Fields';
import { Layout, Section } from '@components/EditorLayout';
import { getCodebook } from '@selectors/protocol';
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
  existingTypes,
  isNew,
  metaOnly,
}) => {
  const { name: paletteName, size: paletteSize } = getPalette(entity);

  return (
    <Layout>
      <Section>
        <h1>{ type ? `Edit ${entity}` : `Create ${entity}` }</h1>
      </Section>
      <Section>
        <h3 id={getFieldId('name')}>
          {capitalize(entity)}
          {' '}
          Type
        </h3>
        <p>
          What type of
          {' '}
          {entity}
          {' '}
          is this?
          { entity === 'node' && ' Some examples might be "Person", "Place", or "Agency".' }
          { entity === 'edge' && ' Some examples might be "Friend" or "Colleague".' }
        </p>
        <ValidatedField
          component={Fields.Text}
          name="name"
          validation={{ required: true, allowedNMToken: `${entity} type name`, uniqueByList: existingTypes }}
        />
      </Section>

      <Section>
        <h2 id={getFieldId('color')}>Color</h2>
        <p>
          Choose a color for this
          {' '}
          {entity}
          {' '}
          type.
        </p>
        <ValidatedField
          component={ArchitectFields.ColorPicker}
          name="color"
          palette={paletteName}
          paletteRange={paletteSize}
          validation={{ required: true }}
        />
      </Section>

      { entity === 'node'
        && (
          <Section>
            <h2 id={getFieldId('iconVariant')}>Icon</h2>
            <p>
              Choose an icon to display on interfaces that create this
              {' '}
              {entity}
              .
            </p>
            <ValidatedField
              component={Fields.RadioGroup}
              name="iconVariant"
              options={ICON_OPTIONS}
              optionComponent={IconOption}
              validation={{ required: true }}
            />
          </Section>
        )}

      {(!isNew && !metaOnly)
        && (
        <Section>
          <Variables
            form={form}
            name="variables"
            sortableProperties={['name', 'type']}
            initialSortOrder={{
              direction: 'asc',
              property: 'name',
            }}
          />
        </Section>
        )}
    </Layout>
  );
};

TypeEditor.propTypes = {
  type: PropTypes.string,
  entity: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  existingTypes: PropTypes.array.isRequired,
  isNew: PropTypes.bool,
  metaOnly: PropTypes.bool,
};

TypeEditor.defaultProps = {
  type: null,
  isNew: false,
  metaOnly: false,
};

const mapStateToProps = (state, { type, isNew }) => {
  const codebook = getCodebook(state);

  const getNames = (codebookTypeDefinitions, excludeType) => toPairs(codebookTypeDefinitions)
    .reduce((acc, [id, definition]) => {
      if (excludeType && id === excludeType) { return acc; }
      return [
        ...acc,
        definition.name,
      ];
    }, []);

  const nodes = getNames(codebook.node, !isNew && type);
  const edges = getNames(codebook.edge, !isNew && type);

  const existingTypes = [
    ...nodes,
    ...edges,
  ];

  return {
    existingTypes,
  };
};

export { TypeEditor as UnconnectedTypeEditor };

export default connect(mapStateToProps)(TypeEditor);
