import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import cx from 'classnames';
import { Editable, withReact, Slate, useFocused } from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import withNormalize from './withNormalize';
import Toolbar from './Toolbar';
import { Element, Leaf } from './renderers';
import serialize from './serialize';
import parse from './parse';
import { MODES, TOOLBAR_MODES } from './options';

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

const RichText = ({
  mode,
  onChange,
  value: initialValue,
  autoFocus,
}) => {
  const [value, setValue] = useState(defaultValue);
  const normalizeOptions = {
    mode,
  };
  const editor = useMemo(
    () => withNormalize(withHistory(withReact(createEditor())), normalizeOptions),
    [],
  );

  // Initial prop on startup
  useEffect(() => {
    parseValue(initialValue)
      .then(setValue);
  }, []);

  // Update upstream on change
  useEffect(() => {
    onChange(serialize(value));
  }, [onChange, value]);

  const controls = TOOLBAR_MODES[mode];

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <RichTextContainer>
        <Toolbar controls={controls} />
        <div className="rich-text__editable">
          <Editable
            renderElement={Element}
            renderLeaf={Leaf}
            placeholder=""
            spellCheck
            autoFocus={autoFocus}
          />
        </div>
      </RichTextContainer>
    </Slate>
  );
};

RichText.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  mode: PropTypes.oneOf(Object.values(MODES)),
  autoFocus: PropTypes.bool,
};

RichText.defaultProps = {
  value: '',
  onChange: () => {},
  mode: MODES.full,
  autoFocus: false,
};

export default RichText;
