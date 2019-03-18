import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { getVariablesForNodeType } from '../../selectors/codebook';

const VariableChooser = ({ unusedVariables, names, onChooseVariable, onNewVariable, show }) => (
  <div className={cx('attributes-table-chooser', { 'attributes-table-chooser--show': show })}>
    { unusedVariables.map((variable, index) => (
      <div
        className="attributes-table-chooser-variable"
        onClick={(e) => { e.stopPropagation(); onChooseVariable(variable); }}
        key={variable}
      >
        {names[index]}
      </div>
    )) }
    <div
      className="attributes-table-chooser-variable"
      onClick={(e) => { e.stopPropagation(); onNewVariable(); }}
    >
      Create new
    </div>
  </div>
);

VariableChooser.propTypes = {
  onChooseVariable: PropTypes.func.isRequired,
  onNewVariable: PropTypes.func.isRequired,
  unusedVariables: PropTypes.array.isRequired,
  names: PropTypes.array.isRequired,
  show: PropTypes.bool,
};

VariableChooser.defaultProps = {
  show: false,
};

const mapStateToProps = (state, { nodeType, unusedVariables }) => {
  const variablesForNodeType = getVariablesForNodeType(state, nodeType);
  const names = unusedVariables.map(variable => variablesForNodeType[variable].name);

  return {
    names,
  };
};

export { VariableChooser };

export default connect(mapStateToProps)(VariableChooser);
