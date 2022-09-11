import React, {
  useCallback, useEffect, useState,
} from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { change, formValueSelector } from 'redux-form';
import { capitalize, toPairs, get } from 'lodash';
import * as Fields from '@codaco/ui/lib/components/Fields';
import Fuse from 'fuse.js';
import { getFieldId } from '@app/utils/issues';
import { ValidatedField } from '@components/Form';
import { Layout, Section } from '@components/EditorLayout';
import * as muiIcons from '@material-ui/icons';
import { getCodebook } from '@selectors/protocol';
import ColorPicker from '../Form/Fields/ColorPicker';
import getPalette from './getPalette';
import Variables from './Variables';
import PresetElement from './PresetElement';
import IconElement from './IconElement';

const ICON_OPTIONS = [
  'add-a-person',
  'add-a-place',
  'add-a-relationship',
  'add-a-context',
  'add-a-protocol',
  ...Object.keys(muiIcons),
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
  if (query.length === 0) { return ICON_OPTIONS.slice(0, 10); }
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
  nodeNameForEdit,
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
  const [iconName, setIconName] = useState(ICON_OPTIONS[0]);
  const [query, setQuery] = useState('');
  const [timer, setTimer] = useState(null);
  const [filteredIcons, setFilteredIcon] = useState(ICON_OPTIONS.slice(0, 10));

  // delay the search and filtering of icons to prevent lag
  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        setFilteredIcon(search(query));
      }, 1000),
    );
  }, [query]);

  // Provide a default icon
  useEffect(() => {
    if (entity === 'node' && !formIcon && NODE_NAME_COLOR_OPTIONS_FILTERED.length > 0) {
      const matchedIcon = ICON_OPTIONS.filter(
        (val) => val.substring(6) === NODE_NAME_COLOR_OPTIONS_FILTERED[0].label.toLowerCase(),
      )[0];
      dispatch(change(form, 'iconVariant', matchedIcon));
    }
  }, [entity, form, formIcon, dispatch]);

  // Provide a default name and color for preset node list
  useEffect(() => {
    if (entity === 'node' && !formNodeName && NODE_NAME_COLOR_OPTIONS_FILTERED.length > 0) {
      if (ifPreset) {
        dispatch(change(form, 'name', NODE_NAME_COLOR_OPTIONS_FILTERED[0].label));
        dispatch(change(form, 'color', NODE_NAME_COLOR_OPTIONS_FILTERED[0].color));
      } else {
        const matchedColorDict = NODE_NAME_COLOR_OPTIONS_FILTERED.filter(
          (val) => val.label === nodeNameForEdit,
        );
        const matchedColor = matchedColorDict.length > 0 ? matchedColorDict[0].color : '';
        dispatch(change(form, 'color', matchedColor));
        dispatch(change(form, 'name', nodeNameForEdit));
      }
    }
  }, [entity, form, ifPreset, dispatch]);

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        if (formNodeName && !ifPreset) {
          setQuery(formNodeName);
        }
      }, 1000),
    );
  }, [formNodeName]);

  const { name: paletteName, size: paletteSize } = getPalette(entity);

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

  const handleIconPick = (...args) => {
    setIconName(...args);
    dispatch(change(form, 'iconVariant', ...args));
  };

  const handleUpdateQuery = useCallback((eventOrValue) => {
    const newQuery = get(eventOrValue, ['target', 'value'], eventOrValue);
    setQuery(newQuery);
  }, [setQuery]);

  return (
    <>
      <div className="stage-heading stage-heading--collapsed stage-heading--shadow">
        <Layout>
          <h2>{ type ? `Edit ${entity}` : (ifPreset ? `Create ${entity}` : 'Customize node') }</h2>
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
                // placeholder={nodeNameForEdit}
                input={{
                  value: query,
                  onChange: handleUpdateQuery,
                }}
              />
              <Fields.RadioGroup
                name="iconVariant"
                options={filteredIcons}
                input={{
                  onChange: handleIconPick,
                  value: iconName,
                }}
                optionComponent={IconElement}
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
  NODE_NAME_COLOR_OPTIONS: PropTypes.arrayOf(PropTypes.object),
  ifPreset: PropTypes.bool,
  nodeNameForEdit: PropTypes.string,
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
      label: 'Relationship',
      value: 'Relationship',
      color: 'node-color-seq-3',
    },
    {
      label: 'Context',
      value: 'Context',
      color: 'node-color-seq-4',
    },
    {
      label: 'Protocol',
      value: 'Protocol',
      color: 'node-color-seq-5',
    },
  ],
  ifPreset: true,
  nodeNameForEdit: '',
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
