import React from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';
import {
  Editor,
  Transforms,
  Element as SlateElement,
} from 'slate';
import cx from 'classnames';

const LIST_TYPES = ['ul_list', 'ol_list'];

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const getNewType = ({ isActive, isList, format }) => {
  if (isActive) { return 'paragraph'; }
  if (isList) { return 'list_item'; }
  return format;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type,
      ),
    split: true,
  });

  const newProperties = {
    type: getNewType({ isActive, isList, format }),
  };

  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <button
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      type="button"
      className={cx(
        'rich-text__button',
        { 'rich-text__button--is-active': isBlockActive(editor, format) },
      )}
    >
      <div>{icon}</div>
    </button>
  );
};

BlockButton.propTypes = {
  format: PropTypes.any.isRequired,
  icon: PropTypes.any,
};

BlockButton.defaultProps = {
  icon: null,
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      type="button"
      className={cx(
        'rich-text__button',
        { 'rich-text__button--is-active': isMarkActive(editor, format) },
      )}
    >
      <div>{icon}</div>
    </button>
  );
};

MarkButton.propTypes = {
  format: PropTypes.any.isRequired,
  icon: PropTypes.any,
};

MarkButton.defaultProps = {
  icon: null,
};

export {
  BlockButton,
  MarkButton,
};
