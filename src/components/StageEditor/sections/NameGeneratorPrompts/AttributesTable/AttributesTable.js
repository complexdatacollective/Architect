import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { omit, isEqual, get, keys, difference } from 'lodash';
import { withHandlers, compose } from 'recompose';
import { connect } from 'react-redux';
import { change, FormSection } from 'redux-form';
import RoundButton from '../../../../Form/RoundButton';
import Variable from './Variable';

const withVaribleActions = withHandlers({
  createVariable: props => (variable) => {
    // don't add existing property
    if (Object.prototype.hasOwnProperty.call(props.value, variable)) { return; }
    props.change({ ...props.value, [variable]: undefined });
  },
  deleteVariable: props => variable =>
    props.change(omit(props.value, variable)),
});

class AttributesTable extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    createVariable: PropTypes.func.isRequired,
    deleteVariable: PropTypes.func.isRequired,
    variables: PropTypes.array.isRequired,
    nodeType: PropTypes.string.isRequired,
    unusedVariables: PropTypes.array.isRequired,
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
    const variables = this.props.variables;

    return this.state.new ?
      variables.concat(undefined) :
      variables;
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

  render() {
    const {
      name,
      nodeType,
      unusedVariables,
    } = this.props;

    const rows = this.variables.map((variable, index) => {
      const isEditing = this.state.editing === variable;

      return (
        <div className="attributes-table__variable" key={index}>
          <Variable
            variable={variable}
            nodeType={nodeType}
            unusedVariables={unusedVariables}
            isEditing={isEditing}
            onChooseVariable={this.handleChooseVariable}
            onToggleEdit={() => this.handleEditVariable(variable)}
            onDelete={() => this.handleDeleteVariable(variable)}
          />
        </div>
      );
    });

    return (
      <div className="attributes-table">
        <FormSection name={name} className="attributes-table__variables">
          {rows}
        </FormSection>

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
  const value = form.getValues(state, name);
  const variables = keys(value);
  const variablesRegistryForNodeType = keys(getVariablesForNodeType(state, nodeType));
  const unusedVariables = difference(variablesRegistryForNodeType, variables);

  return ({
    value,
    variables,
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
