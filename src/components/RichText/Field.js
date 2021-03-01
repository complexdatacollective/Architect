import React, { useState, useEffect } from 'react';
import slate, { serialize as serializeMarkdown } from 'remark-slate';
import { Node, Text } from 'slate';
import unified from 'unified';
import markdown from 'remark-parse';

import RichText from './RichText';

const initialValue = [{
  children: [
    { text: '' },
  ],
}];

const parse = (value) => {
  const data = unified()
    .use(markdown)
    .use(slate)
    .parse(value);
  console.log({ value, data });

  return [data];
};

const serialize = (node) => {
  return '';
  // console.log({ node });

  // if (Text.isText(node)) {
  //   // return escapeHtml(node.text)
  //   return node.text;
  // }

  // return node.map(n => serializeMarkdown(n)).join('\n');
};

const getValue = (value) => {
  if (value && value !== '') {
    // TODO: parse value
    return parse(value);
  }

  return initialValue;
};

const RichTextField = ({ input, ...props }) => {
  const [value, setValue] = useState(getValue(input.value));

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const markdownValue = serialize(value);

  useEffect(() => {
    input.onChange(markdownValue);
  }, [input.onChange, markdownValue]);

  return <RichText value={value} onChange={setValue} />;
};

export default RichTextField;
