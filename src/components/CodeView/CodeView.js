import React from 'react';
import PropTypes from 'prop-types';

const CodeView = ({ toggleCodeView, code }) => (
  <div className="code-view" onClick={toggleCodeView}>
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

export default CodeView;
