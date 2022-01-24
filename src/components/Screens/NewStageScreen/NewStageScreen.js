import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { get } from 'lodash';
import cx from 'classnames';
import Fuse from 'fuse.js';
import Search from '@codaco/ui/lib/components/Fields/Search';
import Button from '@codaco/ui/lib/components/Button';
import Screen from '@components/Screen/Screen';
import { actionCreators as uiActions } from '@modules/ui';
import Tag from '@components/Tag';
import { INTERFACE_TYPES, TAGS, TAG_COLORS } from './interfaceOptions';
import InterfaceList from './InterfaceList';
import ControlBar from '../../ControlBar';

const fuseOptions = {
  threshold: 0.25,
  shouldSort: true,
  findAllMatches: true,
  includeScore: true,
  distance: 10000,
  keys: [
    'title',
    'description',
    'keywords',
  ],
};

const fuse = new Fuse(INTERFACE_TYPES, fuseOptions);

const allTagsSelected = (selectedTags, interfaceTags) => {
  if (selectedTags.length === 0) { return true; }
  return selectedTags.every((tag) => interfaceTags.includes(tag));
};

const search = (query) => {
  if (query.length === 0) { return INTERFACE_TYPES; }
  const result = fuse.search(query);
  console.log('query', result);
  return result.sort((a, b) => a.score - b.score).map((item) => item.item);
};

const NewStageScreen = ({
  insertAtIndex,
  onComplete,
}) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [query, setQuery] = useState('');

  const [cursor, setCursor] = useState(0);
  const [cursorActive, setCursorActive] = useState(true);

  const tags = useMemo(
    () => Object.values(TAGS).map((value) => ({
      value,
      selected: selectedTags.includes(value),
    })),
    [selectedTags],
  );

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
      return;
    }

    setSelectedTags([...selectedTags, tag]);
  };

  const [mouseMoved, setMouseMoved] = useState(false);

  const handleMouseMove = (e) => {
    console.log('han  ', e);
    if (!mouseMoved) {
      setMouseMoved(true);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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

  const handleUpdateQuery = useCallback((eventOrValue) => {
    const newQuery = get(eventOrValue, ['target', 'value'], eventOrValue);
    setQuery(newQuery);
  }, [setQuery]);

  const locus = useSelector(
    (state) => state.protocol.timeline[state.protocol.timeline.length - 1],
  );

  const dispatch = useDispatch();

  const handleSelectInterface = useCallback((interfaceType) => {
    dispatch(uiActions.closeScreen('newStage'));
    dispatch(uiActions.openScreen('stage', { type: interfaceType, locus, insertAtIndex }));
  }, [insertAtIndex, locus, dispatch]);

  const filteredInterfaces = useMemo(
    () => search(query, selectedTags)
      .filter(
        ({ tags: interfaceTags }) => allTagsSelected(selectedTags, interfaceTags),
      ),
    [query, selectedTags],
  );

  useEffect(() => console.log('cursor', cursor, filteredInterfaces[cursor]), [cursor]);

  useEffect(() => {
    setCursor(0);
    setCursorActive(true);
  }, [filteredInterfaces]);

  const hasQuery = query !== '';

  const componentClasses = cx(
    'new-stage-screen',
    {
      'new-stage-screen--has-query': hasQuery,
    },
  );

  // Navigate within the list of results using the keyboard
  const handleKeyDown = (e) => {
    console.log('handle key down!');
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault(); // Prevent moving cursor within search input
      if (!cursorActive) {
        setCursorActive(true);
        return;
      }
    }

    if (cursor > filteredInterfaces.length - 1) {
      setCursor(filteredInterfaces.length - 1);
      return;
    }

    if (e.key === 'Enter') {
      handleSelectInterface(cursor);
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
  };

  return (
    <Screen
      className="new-stage"
      footer={(
        <ControlBar
          buttons={buttons}
          secondaryButtons={[
            <div className="new-stage-screen__menu-tags">
              <div className="menu-tags__label">
                <h4>Filter by capabilities:</h4>
              </div>
              <div className="menu-tags__tags">
                {tags.map(({ value, selected }) => (
                  <Tag
                    key={value}
                    id={value}
                    selected={selected}
                    onClick={handleTagClick}
                    color={get(TAG_COLORS, value)}
                  >
                    {value}
                  </Tag>
                ))}
              </div>
            </div>,
          ]}
        />
      )}
      header={(
        <div
          className="stage-heading stage-heading--shadow"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h1 className="screen-heading">Add a Stage</h1>
            <div className="new-stage-screen__filter">
              <Search
                placeholder="Search interfaces..."
                input={{
                  value: query,
                  onChange: handleUpdateQuery,
                  onKeyDown: handleKeyDown,
                }}
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    >
      <motion.div className={componentClasses}>
        <InterfaceList
          items={filteredInterfaces}
          onSelect={handleSelectInterface}
          highlightedIndex={cursorActive ? cursor : undefined}
          handleClearSearchAndFilter={() => {
            setQuery('');
            setSelectedTags([]);
          }}
          setHighlighted={(index) => {
            if (!mouseMoved) { return; }
            setCursorActive(true);
            setCursor(index);
          }}
          removeHighlighted={() => {
            if (!mouseMoved) { return; }
            setCursorActive(false);
            setCursor(0);
          }}
        />
      </motion.div>
    </Screen>
  );
};

NewStageScreen.propTypes = {
  insertAtIndex: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default NewStageScreen;
