import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FieldArray, arrayPush } from 'redux-form';
import uuid from 'uuid';
import cx from 'classnames';
import { has } from 'lodash';
import Guidance from '../../../Guidance';
import OrderedList, { NewButton } from '../../../OrderedList';
import { getNetworkOptions } from '../NameGeneratorListPrompts/selectors';
import NodePanel from './NodePanel';

const NodePanels = ({ form, createNewPanel, dataSources, disabled, panels }) => {
  const isFull = panels && panels.length === 2;

  return (
    <Guidance contentId="guidance.editor.node_panels">
      <div className={cx('stage-editor-section', { 'stage-editor-section--disabled': disabled })}>
        <div className="stage-editor-section-content-items">
          <h2>Panels</h2>
          <p>Use this section to configure up to two side panels on this name generator.</p>
          <FieldArray
            name="panels"
            component={OrderedList}
            item={NodePanel}
            form={form}
            dataSources={dataSources}
          />

          { !isFull &&
            <div className="stage-editor-section-content-items__controls">
              <NewButton onClick={() => createNewPanel()} />
            </div>
          }
        </div>
      </div>
    </Guidance>
  );
};

NodePanels.propTypes = {
  createNewPanel: PropTypes.func.isRequired,
  dataSources: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  panels: PropTypes.array,
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
};

NodePanels.defaultProps = {
  disabled: false,
  panels: [],
};

const mapStateToProps = (state, props) => ({
  disabled: !has(props.form.getValues(state, 'subject'), 'type'),
  dataSources: getNetworkOptions(state),
  panels: props.form.getValues(state, 'panels'),
});

const mapDispatchToProps = (dispatch, { form }) => ({
  createNewPanel: bindActionCreators(
    () => arrayPush(form.name, 'panels', { id: uuid(), title: null, dataSource: 'existing', filter: null }),
    dispatch,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  NodePanels,
);
