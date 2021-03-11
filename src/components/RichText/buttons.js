import React from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';
import {
  Editor,
  Transforms,
  Element as SlateElement,
} from 'slate';
import cx from 'classnames';
import BoldIcon from '@material-ui/icons/FormatBoldRounded';
import ItalicIcon from '@material-ui/icons/FormatItalicRounded';
import QuoteIcon from '@material-ui/icons/FormatQuoteRounded';
import H1Icon from '@material-ui/icons/LooksOneRounded';
import H2Icon from '@material-ui/icons/LooksTwoRounded';
import H3Icon from '@material-ui/icons/Looks3Rounded';
import H4Icon from '@material-ui/icons/Looks4Rounded';
import H5Icon from '@material-ui/icons/Looks5Rounded';
import ULIcon from '@material-ui/icons/FormatListBulletedRounded';
import OLIcon from '@material-ui/icons/FormatListNumberedRounded';

const icons = {
  bold: BoldIcon,
  italic: ItalicIcon,
  quote: QuoteIcon,
  h1: H1Icon,
  h2: H2Icon,
  h3: H3Icon,
  h4: H4Icon,
  h5: H5Icon,
  ul: ULIcon,
  ol: OLIcon,
}

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

const getIcon = icon => {
  const Icon = icons[icon];
  if (!Icon) { return <span>{icon}</span>; }
  return <Icon />;
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
      {getIcon(icon)}
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
      // active={isMarkActive(editor, format)}
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
      {getIcon(icon)}
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
