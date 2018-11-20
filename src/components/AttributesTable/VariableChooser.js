import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { getVariablesForNodeType } from '../../selectors/variableRegistry';

const VariableChooser = ({ unusedVariables, labels, onChooseVariable, show }) => (
  <div className={cx('attributes-table-chooser', { 'attributes-table-chooser--show': show })}>
    { unusedVariables.map((variable, index) => (
      <div
        className="attributes-table-chooser-variable"
        onClick={(e) => { e.stopPropagation(); onChooseVariable(variable); }}
        key={variable}
      >
        {labels[index]}
      </div>
    )) }
  </div>
);

VariableChooser.propTypes = {
  onChooseVariable: PropTypes.func.isRequired,
  unusedVariables: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  show: PropTypes.bool,
};

VariableChooser.defaultProps = {
  show: false,
};

const mapStateToProps = (state, { nodeType, unusedVariables }) => {
  const variablesForNodeType = getVariablesForNodeType(state, nodeType);

  const labels = unusedVariables.map(variable => variablesForNodeType[variable].label);

  return {
    labels,
  };
};

export { VariableChooser };

export default connect(mapStateToProps)(VariableChooser);
