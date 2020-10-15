import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '@components/EditorLayout';

const CodebookCategory = ({ title, children }) => (
  <Section>
    <h1>{title}</h1>
    <div className="codebook__category-items">
      {children}
    </div>
  </Section>
);

CodebookCategory.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

CodebookCategory.defaultProps = {
  title: '',
  children: null,
};

export { CodebookCategory };

export default CodebookCategory;
