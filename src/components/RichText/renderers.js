import React from 'react';

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

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

export {
  Element,
  Leaf,
};
