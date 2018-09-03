import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import cx from 'classnames';

const VariableChooser = ({ unusedVariables, onChooseVariable, show }) => (
  <div className={cx('variable__chooser', { 'variable__chooser--show': show })}>
    { map(unusedVariables, (variable, variableId) => (
      <div
        className="variable__chooser-variable"
        onClick={(e) => { e.stopPropagation(); onChooseVariable(variableId); }}
      >
        {variable.label}
      </div>
    )) }
  </div>
);

VariableChooser.propTypes = {
  unusedVariables: PropTypes.object,
  onChooseVariable: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

VariableChooser.defaultProps = {
  unusedVariables: {},
  show: false,
};

export default VariableChooser;
