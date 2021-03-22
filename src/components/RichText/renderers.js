import React from 'react';
import PropTypes from 'prop-types';

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block_quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'ul_list':
      return <ul {...attributes}>{children}</ul>;
    case 'ol_list':
      return <ol {...attributes}>{children}</ol>;
    case 'heading_one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading_two':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading_three':
      return <h3 {...attributes}>{children}</h3>;
    case 'heading_four':
      return <h4 {...attributes}>{children}</h4>;
    case 'heading_five':
      return <h5 {...attributes}>{children}</h5>;
    case 'list_item':
      return <li {...attributes}>{children}</li>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

Element.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.node,
  element: PropTypes.shape({
    type: PropTypes.string,
  }).isRequired,
};

Element.defaultProps = {
  attributes: {},
  children: null,
};

const withMarks = (content, leaf) => {
  if (leaf.bold) {
    return <strong>{content}</strong>;
  }

  if (leaf.code) {
    return <code>{content}</code>;
  }

  if (leaf.italic) {
    return <em>{content}</em>;
  }

  return content;
};

const Leaf = ({ attributes, children, leaf }) => (
  <span {...attributes}>{withMarks(children, leaf)}</span>
);

Leaf.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.node,
  leaf: PropTypes.shape({
    bold: PropTypes.bool,
    italic: PropTypes.bool,
    underline: PropTypes.bool,
    code: PropTypes.bool,
  }).isRequired,
};

Leaf.defaultProps = {
  attributes: {},
  children: null,
};

export {
  Element,
  Leaf,
};
