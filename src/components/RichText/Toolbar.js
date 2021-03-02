import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { includes } from 'lodash';
import { MarkButton, BlockButton } from './buttons';

const DEFAULT_CONTROLS = ['bold', 'italic', 'underline'];

const Toolbar = ({ controls }) => (
  <div className="rich-text__toolbar">
    { includes(controls, 'bold') && <MarkButton format="bold" icon="format_bold" /> }
    { includes(controls, 'italic') && <MarkButton format="italic" icon="format_italic" /> }
    { includes(controls, 'underline') && <MarkButton format="underline" icon="format_underlined" /> }
    { includes(controls, 'code') && <MarkButton format="code" icon="code" /> }
    { includes(controls, 'headings') && (
      <Fragment>
        <BlockButton format="heading_one" icon="looks_one" />
        <BlockButton format="heading_two" icon="looks_two" />
      </Fragment>
    )}
    { includes(controls, 'quote') &&
      <BlockButton format="block-quote" icon="format_quote" />
    }
    { includes(controls, 'list') && (
      <Fragment>
        <BlockButton format="numbered_list" icon="format_list_numbered" />
        <BlockButton format="bulleted_list" icon="format_list_bulleted" />
      </Fragment>
    )}
  </div>
);

Toolbar.propTypes = {
  controls: PropTypes.arrayOf(PropTypes.string),
};

Toolbar.defaultProps = {
  controls: DEFAULT_CONTROLS,
};

export default Toolbar;
