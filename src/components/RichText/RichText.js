import React, { Fragment, useCallback, useMemo } from 'react';
import { Editable, withReact, Slate } from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { includes } from 'lodash';
import { MarkButton, BlockButton } from './buttons';
import { Element, Leaf } from './renderers';

const types = [
  'bold',
  'italic',
  'underline',
  'code',
  'quote',
  'headings',
  'lists',
];

const Toolbar = ({ controls }) => (
  <div className="rich-text__toolbar">
    { includes(controls, 'bold') && <MarkButton format="bold" icon="format_bold" /> }
    { includes(controls, 'italic') && <MarkButton format="italic" icon="format_italic" /> }
    { includes(controls, 'underline') && <MarkButton format="underline" icon="format_underlined" /> }
    { includes(controls, 'code') && <MarkButton format="code" icon="code" /> }
    { includes(controls, 'headings') && (
      <Fragment>
        <BlockButton format="heading-one" icon="looks_one" />
        <BlockButton format="heading-two" icon="looks_two" />
      </Fragment>
    )}
    { includes(controls, 'quote') &&
      <BlockButton format="block-quote" icon="format_quote" />
    }
    { includes(controls, 'list') && (
      <Fragment>
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
      </Fragment>
    )}
  </div>
);

const initialValue = [];

const RichTextExample = ({ value, onChange, allow }) => {
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <div className="rich-text">
        <Toolbar controls={allow} />
        <div className="rich-text__editable">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder=""
            spellCheck
            autoFocus
          />
        </div>
      </div>
    </Slate>
  );
};

RichTextExample.defaultProps = {
  value: initialValue,
  allow: types,
};

export default RichTextExample;
