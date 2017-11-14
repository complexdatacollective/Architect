/* eslint-disable */

import { connect } from 'react-redux';
import { keys } from 'lodash';
import { getVariableRegistry } from '../selectors/protocol';
import EgoRule from '../components/EgoRule';

function mapStateToProps(state) {
  const variableRegistry = getVariableRegistry(state);

  return {
    nodeAttributes: keys(variableRegistry.node.person.variables),
  };
}

export default connect(mapStateToProps)(EgoRule);
