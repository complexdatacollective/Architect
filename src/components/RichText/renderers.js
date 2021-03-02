import React from 'react';
import PropTypes from 'prop-types';

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block_quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted_list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading_one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading_two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list_item':
      return <li {...attributes}>{children}</li>;
    case 'numbered_list':
      return <ol {...attributes}>{children}</ol>;
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

  if (leaf.underline) {
    return <u>{content}</u>;
  }

  return content;
};

const Leaf = ({ attributes, children, leaf }) =>
  <span {...attributes}>{withMarks(children, leaf)}</span>;

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
