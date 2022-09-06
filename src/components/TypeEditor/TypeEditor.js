import React, {
  useCallback, useEffect, useState, useMemo,
} from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { change, formValueSelector } from 'redux-form';
import { capitalize, toPairs, get } from 'lodash';
import * as Fields from '@codaco/ui/lib/components/Fields';
import ActionButton from '@codaco/ui/lib/components/ActionButton'
import Fuse from 'fuse.js';
import { getFieldId } from '@app/utils/issues';
import { ValidatedField } from '@components/Form';
import { Layout, Section } from '@components/EditorLayout';
import { actionCreators as screenActions } from '@modules/ui/screens';
import { getCodebook } from '@selectors/protocol';
import ColorPicker from '../Form/Fields/ColorPicker';
import IconOption from './IconOption';
import Icon from '@codaco/ui/lib/components/Icon';
import getPalette from './getPalette';
import Variables from './Variables';
import PresetElement from './PresetElement';

const ICON_OPTIONS = [
  'add-a-person',
  'add-a-place',
  'AccountBox',
];

const fuseOptions = {
  threshold: 0.25,
  shouldSort: true,
  findAllMatches: true,
  includeScore: true,
  distance: 10000, // Needed because keywords are long strings
};

const fuse = new Fuse(ICON_OPTIONS, fuseOptions);

const search = (query) => {
  if (query.length === 0) { return ICON_OPTIONS; }
  const result = fuse.search(query);
  return result.sort((a, b) => a.score - b.score).map((item) => ICON_OPTIONS[item.item]);
};

const TypeEditor = ({
  form,
  entity,
  type,
  existingTypes,
  NODE_NAME_COLOR_OPTIONS,
  ifPreset, // decides whether to render the preset list or the user-custom modal
  isNew,
  metaOnly,
}) => {
  const dispatch = useDispatch();
  const getFormValue = formValueSelector(form);
  const formIcon = useSelector((state) => getFormValue(state, 'iconVariant'));
  const formNodeName = useSelector((state) => getFormValue(state, 'name'));
  const NODE_NAME_COLOR_OPTIONS_FILTERED = NODE_NAME_COLOR_OPTIONS.filter(
    (val) => !existingTypes.includes(val.label),
  );

  const [nodeName, setNodeName] = useState(NODE_NAME_COLOR_OPTIONS[0].label);
  const [query, setQuery] = useState('');

  const filteredIcons = useMemo(
    () => search(query),
    [query],
  );

  // Provide a default icon
  useEffect(() => {
    if (entity === 'node' && !formIcon && NODE_NAME_COLOR_OPTIONS_FILTERED.length > 0) {
      const matchedIcon = ICON_OPTIONS.filter(
        (val) => val.substring(6) === NODE_NAME_COLOR_OPTIONS_FILTERED[0].label.toLowerCase(),
      )[0];
      dispatch(change(form, 'iconVariant', matchedIcon));
      if (ifPreset) {
        dispatch(change(form, 'name', NODE_NAME_COLOR_OPTIONS_FILTERED[0].label));
        dispatch(change(form, 'color', NODE_NAME_COLOR_OPTIONS_FILTERED[0].color));
      } else {
        dispatch(change(form, 'name', ''));
      }
    }
  }, [entity, form, formIcon, dispatch]);

  useEffect(() => {
    if (formNodeName && !ifPreset) {
      setQuery(formNodeName);
    }
  }, [formNodeName]);

  const { name: paletteName, size: paletteSize } = getPalette(entity);

  const openScreen = (screen, params) => dispatch(screenActions.openScreen(screen, params));
  const handleOpenCreateNewType = useCallback(() => {
    openScreen('type', { entity: 'node', ifPreset: !ifPreset });
  }, [openScreen, encodeURI]);

  const handleNodePick = (...args) => {
    setNodeName(...args);
    dispatch(change(form, 'name', ...args));
    const matchedColor = NODE_NAME_COLOR_OPTIONS_FILTERED.filter(
      (val) => val.value === args.toString(),
    )[0].color;
    dispatch(change(form, 'color', matchedColor));
    const matchedIcon = ICON_OPTIONS.filter((val) => val.substring(6) === args.toString().replace(' ', '').toLowerCase())[0];
    if (matchedIcon) {
      dispatch(change(form, 'iconVariant', matchedIcon));
    }
  };

  const handleUpdateQuery = useCallback((eventOrValue) => {
    const newQuery = get(eventOrValue, ['target', 'value'], eventOrValue);
    setQuery(newQuery);
  }, [setQuery]);

  return (
    <>
      <div className="stage-heading stage-heading--collapsed stage-heading--shadow">
        <Layout>
          <h2>{ type ? `Edit ${entity}` : `Create ${entity}` }</h2>
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
            { entity === 'node' && ' Some examples might be "Person", "Place", or "Organization". ' }
            { entity === 'edge' && ' Some examples might be "Friends" or "Works With".' }
            { entity === 'node'
              && (
                <span
                  style={{
                    cursor: 'pointer',
                    color: 'red',
                    textDecoration: 'underline',
                    fontStyle: 'italic',
                  }}
                  type="button"
                  onClick={handleOpenCreateNewType}
                >
                  { ifPreset ? 'Not seeing the node you want to find? Create your own here.'
                    : 'Would like to select from the preset list? Click here!' }
                </span>
              )}
          </p>
          { ifPreset
            ? (
              <div style={{ height: '250px', overflowY: 'scroll' }}>
                <Fields.RadioGroup
                  name="name"
                  options={NODE_NAME_COLOR_OPTIONS_FILTERED}
                  input={{
                    onChange: handleNodePick,
                    value: nodeName,
                  }}
                  optionComponent={PresetElement}
                />
              </div>
            )
            : (
              <ValidatedField
                component={Fields.Text}
                name="name"
                placeholder="Enter a name for this entity type..."
                validation={{ required: true, allowedNMToken: `${entity} type name`, uniqueByList: existingTypes }}
              />
            )}
        </Section>
        { !ifPreset
          && (
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
                component={ColorPicker}
                name="color"
                palette={paletteName}
                paletteRange={paletteSize}
                validation={{ required: true }}
              />
            </Section>
          )}
        { entity === 'node' && !ifPreset
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
              <Fields.Search
                placeholder="Enter an icon name you would like to search for..."
                input={{
                  value: query,
                  onChange: handleUpdateQuery,
                }}
              />
              {/* <ValidatedField
                component={Fields.RadioGroup}
                name="iconVariant"
                options={filteredIcons}
                optionComponent={IconOption}
                validation={{ required: true }}
              /> */}
              <ActionButton icon="ZoomIn" />
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
  NODE_NAME_COLOR_OPTIONS: PropTypes.arrayOf(PropTypes.object),
  ifPreset: PropTypes.bool,
};

TypeEditor.defaultProps = {
  type: null,
  isNew: false,
  metaOnly: false,
  NODE_NAME_COLOR_OPTIONS: [
    {
      label: 'Person',
      value: 'Person',
      color: 'node-color-seq-1',
    },
    {
      label: 'Place',
      value: 'Place',
      color: 'node-color-seq-2',
    },
    {
      label: 'Colleague',
      value: 'Colleague',
      color: 'node-color-seq-3',
    },
  ],
  ifPreset: true,
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
