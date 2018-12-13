import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, mapProps } from 'recompose';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Rules from '../Rules';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';

class Filter extends Component {
  /**
   * move this to rules?
   */
  get filter() {
    return {
      rules: this.props.rules,
      join: this.props.join,
    };
  }

  handleChange = (config) => {
    const filter = {
      ...this.filter,
      ...config,
    };

    this.props.onChange(filter);
  }

  render() {
    const { rules, join, variableRegistry, confirmAction } = this.props;

    return (
      <div>
        <Rules
          rules={rules}
          join={join}
          onChange={this.handleChange}
          confirmAction={confirmAction}
          variableRegistry={variableRegistry}
        />
      </div>
    );
  }
}

Filter.propTypes = {
  onChange: PropTypes.func.isRequired,
  rules: PropTypes.array.isRequired,
  variableRegistry: PropTypes.object.isRequired,
  join: PropTypes.string.isRequired,
};

const connectToField = mapProps(
  props => ({
    rules: get(props.input.value, 'rules', []),
    join: get(props.input.value, 'join'),
    onChange: props.input.onChange,
  }),
);

const mapStateToProps = (state) => {
  const protocol = getProtocol(state);

  return {
    variableRegistry: protocol.variableRegistry,
  };
};

const mapDispatchToProps = dispatch => ({
  confirmAction: bindActionCreators(dialogsActions.openDialog, dispatch),
});

export { Filter };

export default compose(
  connectToField,
  connect(mapStateToProps, mapDispatchToProps),
)(Filter);
