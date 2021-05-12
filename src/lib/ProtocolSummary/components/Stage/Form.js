import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import MiniTable from '../MiniTable';
import Variable from '../Variable';

const Form = ({ form }) => {
  if (!form) { return null; }

  const fieldRows = form.fields && form.fields.map(({ prompt, variable }) => ([
    <Variable id={variable} />,
    <Markdown source={prompt} />,
  ]));

  return (
    <div className="protocol-summary-stage__form">
      <h2>Form</h2>
      <h4>{form.title}</h4>
      <MiniTable rows={fieldRows} />
    </div>
  );
};

const FieldType = PropTypes.shape({
  prompt: PropTypes.string.isRequired,
  variable: PropTypes.string.isRequired,
});

Form.propTypes = {
  form: PropTypes.shape({
    title: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(FieldType).isRequired,
  }),
};

Form.defaultProps = {
  form: null,
};

export default Form;
