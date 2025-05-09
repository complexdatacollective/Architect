import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, connect } from 'react-redux';
import { get } from 'lodash';
import cx from 'classnames';
import Fuse from 'fuse.js';
import Search from '@codaco/ui/lib/components/Fields/Search';
import Button from '@codaco/ui/lib/components/Button';
import Screen from '@components/Screen/Screen';
import { actionCreators as uiActions } from '@modules/ui';
import Tag from '@components/Tag';
import { getExperiments } from '@selectors/protocol';
import Row from '../../EditorLayout/Row';
import { INTERFACE_TYPES, TAGS, TAG_COLORS } from './interfaceOptions';
import InterfaceList from './InterfaceList';
import ControlBar from '../../ControlBar';

const fuseOptions = {
  threshold: 0.25,
  shouldSort: true,
  findAllMatches: true,
  includeScore: true,
  distance: 10000, // Needed because keywords are long strings
  keys: [
    'title',
    'description',
    'keywords',
  ],
};

const fuse = new Fuse(INTERFACE_TYPES, fuseOptions);

const interfaceHasAllSelectedTags = (selectedTags, interfaceTags) => {
  if (selectedTags.length === 0) { return true; }
  return selectedTags.every((tag) => interfaceTags.includes(tag));
};

const search = (query) => {
  if (query.length === 0) { return INTERFACE_TYPES; }
  const result = fuse.search(query);
  return result.sort((a, b) => a.score - b.score).map((item) => item.item);
};

const NewStageScreen = ({
  insertAtIndex,
  onComplete,
  experiments,
}) => {
  const dispatch = useDispatch();
  const [selectedTags, setSelectedTags] = useState([]);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const [cursorActive, setCursorActive] = useState(false);
  const [mouseMoved, setMouseMoved] = useState(false);

  const locus = useSelector(
    (state) => state.protocol.timeline[state.protocol.timeline.length - 1],
  );

  const filteredInterfaces = useMemo(() => {
    let interfaces = search(query, selectedTags).filter(({ tags: interfaceTags }) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      interfaceHasAllSelectedTags(selectedTags, interfaceTags));

    if (!experiments.encryptedVariables) {
      interfaces = interfaces.filter(({ type }) => type !== 'Anonymisation');
    }

    return interfaces;
  }, [query, selectedTags, experiments]);

  const filteredInterfaceTags = useMemo(
    () => filteredInterfaces.reduce((acc, { tags }) => [...acc, ...tags], []),
    [filteredInterfaces],
  );

  const tags = useMemo(
    () => Object.values(TAGS).map((value) => ({
      value,
      selected: selectedTags.includes(value),
      disabled: !filteredInterfaceTags.includes(value),
    })),
    [selectedTags, filteredInterfaceTags],
  );

  const handleTagClick = useCallback((tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
      return;
    }

    setSelectedTags([...selectedTags, tag]);
  }, [selectedTags]);

  // Don't fire card enter/exit events until the mouse has moved
  const handleMouseMove = useCallback(() => {
    if (!mouseMoved) {
      setMouseMoved(true);
    }
  }, [mouseMoved]);

  const handleUpdateQuery = useCallback((eventOrValue) => {
    const newQuery = get(eventOrValue, ['target', 'value'], eventOrValue);
    setQuery(newQuery);
  }, [setQuery]);

  const handleSelectInterface = useCallback((interfaceType) => {
    dispatch(uiActions.closeScreen('newStage'));
    dispatch(uiActions.openScreen('stage', { type: interfaceType, locus, insertAtIndex }));
  }, [insertAtIndex, locus, dispatch]);

  // Navigate within the list of results using the keyboard
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault(); // Prevent moving cursor within search input
      if (!cursorActive) {
        setCursorActive(true);
        return;
      }

      setMouseMoved(false);
    }

    if (cursor > filteredInterfaces.length - 1) {
      setCursor(filteredInterfaces.length - 1);
      return;
    }

    if (e.key === 'Enter') {
      handleSelectInterface(filteredInterfaces[cursor].type);
      return;
    }

    if (e.key === 'ArrowUp') {
      if (cursor === 0) {
        return;
      }
      setCursor(cursor - 1);
    } else if (e.key === 'ArrowDown') {
      if (cursor + 1 > filteredInterfaces.length - 1) {
        return;
      }
      setCursor(cursor + 1);
    }
  }, [cursor, cursorActive, filteredInterfaces, handleSelectInterface]);

  const handleRemoveHighlight = useCallback(() => {
    if (!mouseMoved) { return; }
    setCursorActive(false);
    setCursor(0);
  }, [mouseMoved]);

  const handleSetHighlight = useCallback((index) => {
    if (!mouseMoved) { return; }
    setCursorActive(true);
    setCursor(index);
  }, [mouseMoved]);

  const handleClearSearchAndFilter = useCallback(() => {
    setQuery('');
    setSelectedTags([]);
  });

  const hasQuery = query !== '';

  // Once we get a search string, show the cursor at index 0
  useEffect(() => {
    if (!hasQuery) { return; }
    setCursor(0);
    setCursorActive(true);
    setMouseMoved(false);
  }, [hasQuery]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const componentClasses = cx(
    'new-stage-screen',
    {
      'new-stage-screen--has-query': hasQuery,
    },
  );

  const buttons = useMemo(() => [
    <Button
      key="done"
      onClick={onComplete}
      iconPosition="right"
      color="platinum"
    >
      Cancel
    </Button>,
  ], [onComplete]);

  return (
    <Screen
      className="new-stage"
      footer={(
        <ControlBar
          buttons={buttons}
          secondaryButtons={[
          ]}
        />
      )}
      header={(
        <div
          className="stage-heading stage-heading--shadow"
        >
          <Row>
            <h1 className="screen-heading">Select an Interface Type</h1>
          </Row>
          <Row>
            <div className="new-stage-screen__filter">
              <Search
                placeholder="Search interfaces by name or keyword..."
                input={{
                  value: query,
                  onChange: handleUpdateQuery,
                  onKeyDown: handleKeyDown,
                }}
                autoFocus
              />
            </div>
          </Row>
          <Row>
            <div className="new-stage-screen__menu-tags">
              <div className="menu-tags__label">
                <h4>Filter by capabilities:</h4>
              </div>
              <div className="menu-tags__tags">
                {tags.map(({ value, selected, disabled }) => (
                  <Tag
                    key={value}
                    id={value}
                    selected={selected}
                    onClick={handleTagClick}
                    color={get(TAG_COLORS, value)}
                    disabled={disabled}
                  >
                    {value}
                  </Tag>
                ))}
              </div>
            </div>
          </Row>
        </div>
      )}
    >
      <div className={componentClasses}>
        <InterfaceList
          items={filteredInterfaces}
          onSelect={handleSelectInterface}
          highlightedIndex={cursorActive ? cursor : undefined}
          handleClearSearchAndFilter={handleClearSearchAndFilter}
          setHighlighted={handleSetHighlight}
          removeHighlighted={handleRemoveHighlight}
        />
      </div>
    </Screen>
  );
};

const mapStateToProps = (state) => ({

  experiments: getExperiments(state),
});

NewStageScreen.propTypes = {
  insertAtIndex: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
  experiments: PropTypes.shape({
    encryptedVariables: PropTypes.bool,
  }),
};

NewStageScreen.defaultProps = {
  experiments: {},
};

export default connect(mapStateToProps)(NewStageScreen);
