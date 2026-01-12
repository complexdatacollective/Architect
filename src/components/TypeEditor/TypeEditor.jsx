import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { change, formValueSelector } from 'redux-form';
import { capitalize, toPairs } from 'lodash';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { ValidatedField } from '@components/Form';
import { Layout, Section } from '@components/EditorLayout';
import { getCodebook } from '@selectors/protocol';
import ColorPicker from '../Form/Fields/ColorPicker';
import IconOption from './IconOption';
import getPalette from './getPalette';

const ICON_OPTIONS = [
  'add-a-person',
  'add-a-place',
];

const TypeEditor = ({
  form,
  entity,
  type,
  existingTypes,
}) => {
  const dispatch = useDispatch();
  const getFormValue = formValueSelector(form);
  const formIcon = useSelector((state) => getFormValue(state, 'iconVariant'));

  // Provide a default icon
  useEffect(() => {
    if (entity === 'node' && !formIcon) {
      dispatch(change(form, 'iconVariant', ICON_OPTIONS[0]));
    }
  }, [entity, form, formIcon, dispatch]);

  const { name: paletteName, size: paletteSize } = getPalette(entity);

  return (
    <>
      <div className="stage-heading stage-heading--collapsed stage-heading--shadow">
        <Layout>
          <h2>{type ? `Edit ${entity}` : `Create ${entity}`}</h2>
        </Layout>
      </div>
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
            {entity === 'node' && ' Some examples might be "Person", "Place", or "Organization".'}
            {entity === 'edge' && ' Some examples might be "Friends" or "Works With".'}
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
            component={ColorPicker}
            name="color"
            palette={paletteName}
            paletteRange={paletteSize}
            validation={{ required: true }}
            issueDescription="color"
          />
        </Section>
        {entity === 'node'
          && (
            <Section
              title="Icon"
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
                issueDescription="iconVariant"
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
};

TypeEditor.defaultProps = {
  type: null,
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
