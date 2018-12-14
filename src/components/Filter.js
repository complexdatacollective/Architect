import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, mapProps } from 'recompose';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Rules from './Rules';
import { getProtocol } from '../selectors/protocol';
import { actionCreators as dialogsActions } from '../ducks/modules/dialogs';

const Filter = ({ rules, join, variableRegistry, onChange, openDialog }) => (
  <Rules
    rules={rules}
    join={join}
    onChange={onChange}
    openDialog={openDialog}
    variableRegistry={variableRegistry}
  />
);

Filter.propTypes = {
  onChange: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
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
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});

export { Filter };

export default compose(
  connectToField,
  connect(mapStateToProps, mapDispatchToProps),
)(Filter);
