import React from 'react';
import PropTypes from 'prop-types';
import { Markdown } from '@codaco/ui/lib/components/Fields';

const PromptPreview = ({ text }) => (
  <Markdown label={text} />
);

PromptPreview.propTypes = {
  text: PropTypes.string.isRequired,
};

export default PromptPreview;
