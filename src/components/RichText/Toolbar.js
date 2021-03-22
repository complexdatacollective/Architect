import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { includes } from 'lodash';
import MarkButton from './MarkButton';
import BlockButton from './BlockButton';
import { TOOLBAR_MODES } from './options';

const DEFAULT_CONTROLS = TOOLBAR_MODES.full;

const Toolbar = ({ controls }) => (
  <div className="rich-text__toolbar">
    { includes(controls, 'bold') && <MarkButton format="bold" icon="bold" /> }
    { includes(controls, 'italic') && <MarkButton format="italic" icon="italic" /> }
    { includes(controls, 'headings') && (
      <>
        <BlockButton format="heading_one" icon="h1" />
        <BlockButton format="heading_two" icon="h2" />
        <BlockButton format="heading_three" icon="h3" />
        <BlockButton format="heading_four" icon="h4" />
        <BlockButton format="heading_five" icon="h5" />
      </>
    )}
    { includes(controls, 'quote') && (
      <BlockButton format="block_quote" icon="quote" />
    )}
    { includes(controls, 'lists') && (
      <>
        <BlockButton format="ol_list" icon="ol" />
        <BlockButton format="ul_list" icon="ul" />
      </>
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
