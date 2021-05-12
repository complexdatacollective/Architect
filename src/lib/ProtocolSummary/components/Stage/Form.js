import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { getVariableName } from '../../helpers';
import SummaryContext from '../SummaryContext';

const Form = ({ form }) => {
  const {
    index,
  } = useContext(SummaryContext);

  if (!form) { return null; }

  return (
    <div className="protocol-summary-stage__form">
      <h2>Form</h2>
      <h4>{form.title}</h4>
      <table>
        <tbody>
          {form.fields.map(({ prompt, variable }) => (
            <tr>
              <td>{getVariableName(index, variable)}</td>
              <td><Markdown source={prompt} /></td>
            </tr>
          ))}
        </tbody>
      </table>
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
