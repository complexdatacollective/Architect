import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Editable, withReact, Slate } from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import withNormalize from './withNormalize';
import Toolbar from './Toolbar';
import { Element, Leaf } from './renderers';
import serialize from './serialize';
import parse, { defaultValue } from './parse';
import { MODES, TOOLBAR_MODES } from './options';
import RichTextContainer from './RichTextContainer';

/**
 * This rich text component is UI for editing markdown.
 *
 * It uses the `slate` library to manage the document,
 * which uses it's own tree-like structure internally,
 * and parse and serialize methods to read and set the
 * value externally.
 *
 * Slate's internal tree is not specific to markdown,
 * the element types and leaf types are arbitrary - in
 * this case we are using the types provided by our
 * very opinionated serialize/parse library `remark-slate`.
 * These are the types you will see in `options.js`, that
 * are set using the `buttons.js` components.
 *
 * The other notable feature is our normalizer. When
 * document is updated, this method is run for each node
 * and is how we restrict block types and force single
 * line mode.
 *
 * This editor has modes:
 * - 'full': All markdown features available
 * - 'marks': Inline features, such as italic, bold are
 *   enabled. Multiline is enabled.
 * - 'single': Same as 'marks', but no multiline.
 *
 * @param {bool} autoFocus Focus input automatically when
 * rendered.
 * @param {string} mode One of 'single', 'full' (default),
 * 'marks'.
 * @param {func} onChange Will receive a markdown value when
 * the document changes
 * @param {string} value Expects a value which will be used
 * as the *starting* value for the field, will not be used
 * subsequently as state is managed internally.
 */

const RichText = ({
  autoFocus,
  mode,
  onChange,
  value: initialValue,
}) => {
  const [value, setValue] = useState(defaultValue);
  const normalizeOptions = {
    mode,
  };
  const editor = useMemo(
    () => withNormalize(withHistory(withReact(createEditor())), normalizeOptions),
    [],
  );

  // Set starting state from prop value on start up
  useEffect(() => {
    parse(initialValue)
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
