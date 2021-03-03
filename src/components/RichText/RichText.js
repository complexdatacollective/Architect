import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import cx from 'classnames';
import { Editable, withReact, Slate, useFocused } from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import Toolbar from './Toolbar';
import { Element, Leaf } from './renderers';
import serialize from './serialize';
import parse from './parse';

const ALLOW_DEFAULT = [
  'bold',
  'italic',
  'underline',
  'code',
  'quote',
  'headings',
  'lists',
];

const defaultValue = [{
  children: [
    { text: '' },
  ],
}];

const parseValue = (value) => {
  if (!value || isEmpty(value)) {
    return Promise.resolve(defaultValue);
  }

  return parse(value);
};

const RichTextContainer = ({ children }) => {
  const focused = useFocused();

  return (
    <div className={cx('rich-text', { 'rich-text--is-active': focused })}>
      {children}
    </div>
  );
};

RichTextContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const RichText = ({ allow, onChange, value: initialValue, autoFocus }) => {
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Initial prop on startup
  useEffect(() => {
    parseValue(initialValue)
      .then(setValue);
  }, []);

  // Update upstream on change
  useEffect(() => {
    onChange(serialize(value));
  }, [onChange, value]);

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <RichTextContainer>
        <Toolbar controls={allow} />
        <div className="rich-text__editable">
          <Editable
            renderElement={Element}
            renderLeaf={Leaf}
            placeholder=""
            spellCheck
            autoFocus={autoFocus}
            onBlur={console.log}
            onFocus={console.log}
          />
        </div>
      </RichTextContainer>
    </Slate>
  );
};

RichText.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  allow: PropTypes.arrayOf(PropTypes.string),
  autoFocus: PropTypes.bool,
};

RichText.defaultProps = {
  value: '',
  onChange: () => {},
  allow: ALLOW_DEFAULT,
  autoFocus: false,
};

export default RichText;
