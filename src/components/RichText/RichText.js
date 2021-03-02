import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Editable, withReact, Slate } from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import Toolbar from './Toolbar';
import { Element, Leaf } from './renderers';
import serialize from './serialize';
import parse from './parse';

const types = [
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
  if (!value || value === '') { return Promise.resolve(defaultValue); }

  return parse(value);
};

const RichText = ({ allow, onChange, value: initialValue }) => {
  const [value, setValue] = useState(defaultValue);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Initial prop on startup
  useEffect(() => {
    parseValue(initialValue)
      .then((result) => {
        console.log({ initialValue, result });
        setValue(result);
      });
  }, []);

  // Update upstream on change
  useEffect(() => {
    onChange(serialize(value));
  }, [onChange, value]);

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <div className="rich-text">
        <Toolbar controls={allow} />
        <div className="rich-text__editable">
          <Editable
            renderElement={Element}
            renderLeaf={Leaf}
            placeholder=""
            spellCheck
            autoFocus
          />
        </div>
      </div>
    </Slate>
  );
};

RichText.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  allow: PropTypes.arrayOf(PropTypes.string),
};

RichText.defaultProps = {
  value: '',
  onChange: () => {},
  allow: types,
};

export default RichText;
