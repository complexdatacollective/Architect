import React, {
  useEffect, useState,
} from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { change, formValueSelector } from 'redux-form';
import ActionButton from '@codaco/ui/lib/components/ActionButton';
import {
  List,
} from 'react-virtualized';
import { capitalize, toPairs, debounce } from 'lodash';
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
import Radio from '../Form/Fields/Radio';

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
  const [iconName, setIconName] = useState(ICON_OPTIONS);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(ICON_OPTIONS);

  const search = (searchquery) => {
    const result = fuse.search(searchquery);
    setSearchResults(
      result.sort((a, b) => a.score - b.score).map((item) => ICON_OPTIONS[item.item]),
    );
  };
  const debounceSearch = debounce((searchquery) => search(searchquery), 1000);

  const handleUpdateQuery = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debounceSearch(newQuery);
  };

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
        setQuery(nodeNameForEdit);
      }
    }
  }, [entity, form, ifPreset, dispatch]);

  useEffect(() => {
    if (formNodeName) {
      setQuery(formNodeName);
      debounceSearch(formNodeName);
    }
  }, [formNodeName]);

  useEffect(() => {
    setIconName(searchResults[0]);
  }, [searchResults]);

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

  const handleIconPick = (index) => {
    setIconName(searchResults[index]);
    dispatch(change(form, 'iconVariant', searchResults[index]));
  };

  return (
    <>
      <div className="stage-heading stage-heading--collapsed stage-heading--shadow">
        <Layout>
          <h2>
            {
              (() => {
                if (type) {
                  return `Edit ${entity}`;
                }
                if (ifPreset) {
                  return `Create ${entity}`;
                }
                return 'Customize node';
              })
            }
          </h2>
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
                input={{
                  value: query,
                  onChange: handleUpdateQuery,
                }}
              />
              {/* <AutoSizer>
                {({width, height}) => ( */}
              <List
                width={1000}
                height={1200}
                rowHeight={120}
                rowCount={searchResults.length}
                rowRenderer={({
                  key, index, style,
                }) => {
                  return (
                    <div key={key} style={style}>
                      <Radio
                        input={{
                          onChange: () => handleIconPick(index),
                          value: iconName,
                          checked: searchResults[index] === iconName,
                        }}
                        label={<ActionButton icon={searchResults[index]} />}
                      />
                    </div>
                  );
                }}
              />
                {/* )}
              </AutoSizer> */}
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
