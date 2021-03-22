import React from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';
import cx from 'classnames';
import Icon from './Icon';
import {
  toggleBlock,
  isBlockActive,
} from './actions';

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
      <Icon name={icon} />
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

export default BlockButton;
