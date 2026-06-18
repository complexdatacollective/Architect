import { Layout, Section } from '@components/EditorLayout';
import { ValidatedField } from '@components/Form';
import { getCodebook } from '@selectors/protocol';
import { capitalize, toPairs } from 'lodash';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { change, formValueSelector } from 'redux-form';

import * as Fields from '@codaco/ui/lib/components/Fields';

import ColorPicker from '../Form/Fields/ColorPicker';
import getPalette from './getPalette';
import IconOption from './IconOption';

const ICON_OPTIONS = ['add-a-person', 'add-a-place'];

const TypeEditor = ({ form, entity, type, existingTypes }) => {
  const dispatch = useDispatch();
  const getFormValue = formValueSelector(form);
  const formIcon = useSelector((state) => getFormValue(state, 'icon'));

  // Provide a default icon
  useEffect(() => {
    if (entity === 'node' && !formIcon) {
      dispatch(change(form, 'icon', ICON_OPTIONS[0]));
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
        <Section title={`${capitalize(entity)} Type`}>
          <p>
            Name this {entity} type. This name will be used to identify this
            type in the codebook, and in your data exports.
            {entity === 'node' &&
              ' Some examples might be "Person", "Place", or "Organization".'}
            {entity === 'edge' &&
              ' Some examples might be "Friends" or "Works With".'}
          </p>
          <ValidatedField
            component={Fields.Text}
            name="name"
            placeholder="Enter a name for this entity type..."
            validation={{
              required: true,
              allowedNMToken: `${entity} type name`,
              uniqueByList: existingTypes,
            }}
          />
        </Section>
        <Section
          title="Color"
          summary={<p>Choose a color for this {entity} type.</p>}
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
        {entity === 'node' && (
          <Section
            title="Icon"
            summary={
              <p>
                Choose an icon to display on interfaces that create this{' '}
                {entity}.
              </p>
            }
          >
            <ValidatedField
              component={Fields.RadioGroup}
              name="icon"
              options={ICON_OPTIONS}
              optionComponent={IconOption}
              validation={{ required: true }}
              issueDescription="icon"
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
  existingTypes: PropTypes.array.isRequired,
};

TypeEditor.defaultProps = {
  type: null,
};

const mapStateToProps = (state, { type, isNew }) => {
  const codebook = getCodebook(state);

  const getNames = (codebookTypeDefinitions, excludeType) =>
    toPairs(codebookTypeDefinitions).reduce((acc, [id, definition]) => {
      if (excludeType && id === excludeType) {
        return acc;
      }
      acc.push(definition.name);
      return acc;
    }, []);

  const nodes = getNames(codebook.node, !isNew && type);
  const edges = getNames(codebook.edge, !isNew && type);

  const existingTypes = [...nodes, ...edges];

  return {
    existingTypes,
  };
};

export default connect(mapStateToProps)(TypeEditor);
