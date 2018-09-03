import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { omit, map } from 'lodash';
import { withState, withHandlers, compose } from 'recompose';
import { connect } from 'react-redux';
import { change, FormSection } from 'redux-form';
import cx from 'classnames';
import RoundButton from '../../../../Form/RoundButton';
import Variable from './Variable';

const withVaribleActions = withHandlers({
  createVariable: props => () =>
    props.change({...props.values, _new: null }),
  deleteVariable: props => variable =>
    props.change(omit(props.values, variable)),
});

class AttributesTable extends Component {
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
    )

    return this.state.new ?
      variableMap.concat({ value: undefined, variable: undefined }) :
      variableMap;
  }

  handleEditVariable = (variable) => {
    if (this.state.editing === variable) { this.setState({ editing: null }); }

    this.setState({ editing: variable, new: false });
  };

  handleCreateVariable = () => {
    this.setState({ new: true, editing: undefined });
  };

  handleChooseVariable = (variable) => {
    this.props.change({ ...this.props.values, [variable]: undefined })
    this.setState({ new: false, editing: variable });
  };

  render() {
    const {
      setEditingVariable,
      addVariable,
      deleteVariable,
      variableRegistry,
      name,
    } = this.props;

    const rows = this.variables.map(({ value, variable }, index) => {
      const isEditing = this.state.editing === variable;

      return (
        <div className="attributes-table__variable" key={index}>
          <Variable
            value={value}
            variable={variable}
            variableRegistry={variableRegistry}
            isEditing={isEditing}
            onChooseVariable={this.handleChooseVariable}
            onToggleEdit={() => this.handleEditVariable(variable)}
            onDelete={() => deleteVariable(variable)}
          />
        </div>
      );
    });

    return (
      <FormSection name={name}>
        <div className="attributes-table">
          {rows}
        </div>
        <RoundButton
          onClick={this.handleCreateVariable}
          className="attributes-table__add"
        />
      </FormSection>
    );
  }
};

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
