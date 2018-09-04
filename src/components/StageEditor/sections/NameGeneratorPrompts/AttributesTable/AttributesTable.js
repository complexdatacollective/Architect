import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { omit, map, pickBy } from 'lodash';
import { withHandlers, compose } from 'recompose';
import { connect } from 'react-redux';
import { change, FormSection } from 'redux-form';
import RoundButton from '../../../../Form/RoundButton';
import Variable from './Variable';

const withVaribleActions = withHandlers({
  createVariable: props => (variable) => {
    // don't add existing property
    if (Object.prototype.hasOwnProperty.call(props.values, variable)) { return; }
    props.change({ ...props.values, [variable]: undefined });
  },
  deleteVariable: props => variable =>
    props.change(omit(props.values, variable)),
});

class AttributesTable extends Component {
  static propTypes = {
    variableRegistry: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    values: PropTypes.object,
    createVariable: PropTypes.func.isRequired,
    deleteVariable: PropTypes.func.isRequired,
  };

  static defaultProps = {
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      new: false,
      editing: null,
    };
  }

  get variables() {
    const variableMap = map(
      this.props.values,
      (value, variable) => ({ value, variable }),
    );

    return this.state.new ?
      variableMap.concat({ value: undefined, variable: undefined }) :
      variableMap;
  }

  get variableRegistry() {
    return pickBy(this.props.variableRegistry, ({ type }) => type !== 'layout');
  }

  get unusedVariables() {
    return omit(this.variableRegistry, map(this.variables, 'variable'));
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
    } = this.props;

    const rows = this.variables.map(({ value, variable }, index) => {
      const isEditing = this.state.editing === variable;

      return (
        <div className="attributes-table__variable" key={index}>
          <Variable
            value={value}
            variable={variable}
            variableRegistry={this.variableRegistry}
            unusedVariables={this.unusedVariables}
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

const mapStateToProps = (state, { name, form }) => ({
  values: form.getValues(state, name),
});

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
