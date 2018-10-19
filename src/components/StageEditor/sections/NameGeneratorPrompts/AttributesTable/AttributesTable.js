import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { omit, isEqual, get, keys, difference, omitBy, toPairs } from 'lodash';
import { withHandlers, compose } from 'recompose';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import RoundButton from '../../../../Form/RoundButton';
import Variable from './Variable';

const validTypes = [
  'ordinal',
  'categorical',
  'boolean',
  'text',
  'number',
];

const defaultsByType = {
  boolean: false,
  ordinal: [],
  text: '',
  number: '',
};

const getVariableDefault = (variableMeta) => {
  if (variableMeta.default) { return variableMeta.default; }
  return get(defaultsByType, variableMeta.type, '');
};

const withVaribleActions = withHandlers({
  createVariable: props => (variable) => {
    // don't add existing property
    if (Object.prototype.hasOwnProperty.call(props.variables, variable)) { return; }
    props.change({
      ...props.variables,
      [variable]: getVariableDefault(props.variablesForNodeType[variable]),
    });
  },
  deleteVariable: props => variable =>
    props.change(omit(props.variables, variable)),
  updateVariable: props => variable =>
    props.change({ ...props.variables, ...variable }),
});

class AttributesTable extends Component {
  static propTypes = {
    createVariable: PropTypes.func.isRequired,
    updateVariable: PropTypes.func.isRequired,
    deleteVariable: PropTypes.func.isRequired,
    variables: PropTypes.object.isRequired,
    nodeType: PropTypes.string.isRequired,
    unusedVariables: PropTypes.array.isRequired,
    variablesForNodeType: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      new: false,
      editing: null,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextState, this.state) || !isEqual(nextProps, this.props);
  }

  get variables() {
    const variables = toPairs(this.props.variables);

    if (!this.state.new) {
      return variables;
    }

    return variables.concat([[]]);
  }

  handleEditVariable = (variable) => {
    if (this.state.editing === variable) { this.setState({ editing: null }); }

    this.setState({ editing: variable, new: false });
  };

  handleCreateVariable = () => {
    this.setState({ new: true, editing: undefined });
  };

  handleChooseVariable = (variable) => {
    this.props.createVariable(variable);
    this.setState({ new: false, editing: variable });
  };

  handleDeleteVariable = (variable) => {
    this.props.deleteVariable(variable);
  };

  handleChange = (variable) => {
    this.props.updateVariable(variable);
  }

  renderVariable({ value, variable, key }) {
    const {
      nodeType,
      variablesForNodeType,
      unusedVariables,
    } = this.props;
    const isEditing = this.state.editing === variable;

    return (
      <div className="attributes-table__variable" key={key}>
        <Variable
          variable={variable}
          validation={get(variablesForNodeType, [variable, 'validation'])}
          value={value}
          nodeType={nodeType}
          unusedVariables={unusedVariables}
          onChange={this.handleChange}
          isEditing={isEditing}
          onChooseVariable={this.handleChooseVariable}
          onToggleEdit={() => this.handleEditVariable(variable)}
          onDelete={() => this.handleDeleteVariable(variable)}
        />
      </div>
    );
  }

  render() {
    const rows = this.variables.map(
      ([variable, value], index) =>
        this.renderVariable({ variable, value, key: index }),
    );

    return (
      <div className="attributes-table">
        <div className="attributes-table__variables">
          {rows}
        </div>

        <RoundButton
          onClick={this.handleCreateVariable}
          className="attributes-table__add"
        />
      </div>
    );
  }
}

const getVariablesForNodeType = (state, nodeType) => {
  const variableRegistry = get(state, 'protocol.present.variableRegistry', {});
  return get(variableRegistry, ['node', nodeType, 'variables'], {});
};

const mapStateToProps = (state, { name, form, nodeType }) => {
  const variables = form.getValues(state, name) || {};
  const variablesForNodeType = omitBy(
    getVariablesForNodeType(state, nodeType),
    variableMeta => !validTypes.includes(variableMeta.type),
  );

  const unusedVariables = difference(keys(variablesForNodeType), keys(variables));

  return ({
    variables,
    variablesForNodeType,
    unusedVariables,
  });
};

const mapDispatchToProps = (dispatch, { name, form }) => ({
  change: bindActionCreators(
    value => change(form.name, name, value),
    dispatch,
  ),
});

export { AttributesTable };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withVaribleActions,
)(AttributesTable);
