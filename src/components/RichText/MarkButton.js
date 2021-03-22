import React from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';
import cx from 'classnames';
import Icon from './Icon';
import {
  toggleMark,
  isMarkActive,
} from './actions';

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
      <Icon name={icon} />
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

export default MarkButton;
