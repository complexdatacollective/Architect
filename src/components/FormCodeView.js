import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

const CodeView = ({ toggleCodeView, code }) => (
  <div className="stage-editor__code" onClick={toggleCodeView}>
    <pre>
      <code>
        { JSON.stringify(code, null, 2) }
      </code>
    </pre>
  </div>
);

CodeView.propTypes = {
  code: PropTypes.object,
  toggleCodeView: PropTypes.func.isRequired,
};

CodeView.defaultProps = {
  code: {},
};

const mapStateToProps = (state, { form }) => ({
  code: getFormValues(form)(state),
});

export default connect(mapStateToProps)(CodeView);
