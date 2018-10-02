import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import cx from 'classnames';

const VariableChooser = ({ unusedVariables, onChooseVariable, show }) => (
  <div className={cx('attributes-table-chooser', { 'attributes-table-chooser--show': show })}>
    { map(unusedVariables, (variable, variableId) => (
      <div
        className="attributes-table-chooser-variable"
        onClick={(e) => { e.stopPropagation(); onChooseVariable(variableId); }}
        key={variableId}
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
