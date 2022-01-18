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
import CollapsableHeader from '../Screen/CollapsableHeader';

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
    <>
      <CollapsableHeader
        collapsedState={(
          <div className="stage-heading stage-heading--collapsed">
            <Layout>
              <h2>{ type ? `Edit ${entity}` : `Create ${entity}` }</h2>
            </Layout>
          </div>
        )}
      >
        <div className="stage-heading stage-heading--inline">
          <Layout>
            <h1 className="screen-heading">{ type ? `Edit ${entity}` : `Create ${entity}` }</h1>
          </Layout>
        </div>
      </CollapsableHeader>
      <Layout>
        <Section
          title={`${capitalize(entity)} Type`}
        >
          <p>
            Name this
            {' '}
            {entity}
            {' '}
            type. This name will be used to identify this type in the
            codebook, and in your data exports.
            { entity === 'node' && ' Some examples might be "Person", "Place", or "Organization".' }
            { entity === 'edge' && ' Some examples might be "Friends" or "Works With".' }
          </p>
          <ValidatedField
            component={Fields.Text}
            name="name"
            placeholder="Enter a name for this entity type..."
            validation={{ required: true, allowedNMToken: `${entity} type name`, uniqueByList: existingTypes }}
          />
        </Section>

        <Section
          title="Color"
          id={getFieldId('color')}
          summary={(
            <p>
              Choose a color for this
              {' '}
              {entity}
              {' '}
              type.
            </p>
          )}
        >
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
            <Section
              title="Icon"
              id={getFieldId('iconVariant')}
              summary={(
                <p>
                  Choose an icon to display on interfaces that create this
                  {' '}
                  {entity}
                  .
                </p>
              )}
            >
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
          <Section title="Option Values">
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
    </>
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
