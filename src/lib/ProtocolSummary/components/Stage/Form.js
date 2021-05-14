import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import SummaryContext from '../SummaryContext';
import MiniTable from '../MiniTable';
import Variable from '../Variable';

const getVariableMeta = (index, variable) => (
  index.find(({ id }) => id === variable) || {}
);

const Form = ({ form }) => {
  const {
    index,
  } = useContext(SummaryContext);

  if (!form) { return null; }

  const fieldRows = form.fields && form.fields.map(({ prompt, variable }) => {
    const meta = getVariableMeta(index, variable);

    return ([
      <Variable id={variable} />,
      meta.type,
      <Markdown source={prompt} />,
    ]);
  });

  return (
    <div className="protocol-summary-stage__form">
      <h2>Form</h2>
      <div className="protocol-summary-stage__form-content">
        <h4>{form.title}</h4>
        <MiniTable
          rows={[
            [<strong>Variable</strong>, <strong>Type</strong>, <strong>Label</strong>],
            ...fieldRows,
          ]}
          wide
        />
      </div>
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
