import React, { useState, useEffect } from 'react';
import RichText from './RichText';

const getValue = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return [{
      type: 'paragraph',
      children: [
        { text: 'This is editable ' },
        { text: 'rich', bold: true },
        { text: ' text, ' },
        { text: 'much', italic: true },
        { text: ' better than a ' },
        { text: '<textarea>', code: true },
        { text: '!' },
      ],
    }];
  }
};

const RichTextField = ({ input, ...props }) => {

  const [value, setValue] = useState(getValue(input.value));

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const newValueString = JSON.stringify(value);

  useEffect(() => {
    input.onChange(newValueString);
  }, [newValueString]);

  return <RichText value={value} onChange={setValue} />;
};

export default RichTextField;
