import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { get } from 'lodash';
import cx from 'classnames';
import Fuse from 'fuse.js';
import Search from '@codaco/ui/lib/components/Fields/Search';
import Button from '@codaco/ui/lib/components/Button';
import Screen from '@components/Screen/Screen';
import { Layout } from '@components/EditorLayout';
import { actionCreators as uiActions } from '@modules/ui';
import Tag from '@components/Tag';
import { INTERFACE_TYPES, TAGS, TAG_COLORS } from './interfaceOptions';
import useTagList from './useTagList';
import InterfaceList from './InterfaceList';
import CollapsableHeader from '../../Screen/CollapsableHeader';
import ControlBar from '../../ControlBar';

const fuseOptions = {
  shouldSort: true,
  threshold: 0.25,
  minMatchCharLength: 2,
  keys: [
    'title',
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
  return fuse.search(query);
};

const NewStageScreen = ({
  insertAtIndex,
  onComplete,
}) => {
  const [tags, selectedTags, selectTag, deselectTag] = useTagList(TAGS);
  const [query, setQuery] = useState('');

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

  const hasQuery = query !== '';

  const componentClasses = cx(
    'new-stage-screen',
    {
      'new-stage-screen--has-query': hasQuery,
    },
  );

  return (
    <Screen
      footer={<ControlBar buttons={buttons} />}
    >
      <CollapsableHeader
        collapsedState={(
          <div className="stage-heading stage-heading--collapsed">
            <Layout>
              <h2>Add Stage</h2>
            </Layout>
          </div>
        )}
      >
        <div className="stage-heading">
          <Layout>
            <h1 className="screen-heading">Add Stage</h1>
            <p>Select an interface type from below to add it to your protocol.</p>
          </Layout>
        </div>
      </CollapsableHeader>
      <motion.div className={componentClasses}>
        <div className="new-stage-screen__picker">
          <div className="new-stage-screen__menu">
            <div className="new-stage-screen__menu-section">
              <motion.div className="new-stage-screen__menu-tags" layout>
                {tags.map(({ value, selected }) => (
                  <Tag
                    key={value}
                    id={value}
                    selected={selected}
                    onClick={selectTag}
                    onReset={deselectTag}
                    color={get(TAG_COLORS, value)}
                  >
                    {value}
                  </Tag>
                ))}
              </motion.div>
            </div>
          </div>
          <div className="new-stage-screen__main">
            <motion.div className="new-stage-screen__search">
              <Search
                placeholder="Enter a search term..."
                input={{
                  value: query,
                  onChange: handleUpdateQuery,
                }}
                autoFocus
              />
            </motion.div>
            <motion.div className="new-stage-screen__list">
              <InterfaceList items={filteredInterfaces} onSelect={handleSelectInterface} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Screen>
  );
};

NewStageScreen.propTypes = {
  insertAtIndex: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default NewStageScreen;
