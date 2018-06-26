import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FieldArray, arrayPush } from 'redux-form';
import uuid from 'uuid';
import cx from 'classnames';
import { keys, has, get } from 'lodash';
import { Icon } from '../../../../ui/components';
import Guidance from '../../../Guidance';
import Items from '../../Sortable/Items';
import NodePanel from './NodePanel';

const AddPanel = props => (
  <div className="stage-editor-section-content-items__add" {...props}>
    <Icon name="add" />
  </div>
);

const NodePanels = ({ form, createNewPanel, dataSources, disabled, panels }) => {
  const isFull = panels.length === 2;

  return (
    <Guidance contentId="guidance.editor.node_panels">
      <div className={cx('stage-editor-section', { 'stage-editor-section--disabled': disabled })}>
        <div className="stage-editor-section-content-items">
          <h2>Panels</h2>
          <p>Create any content you wish to display on the information screen.</p>
          <FieldArray
            name="panels"
            component={Items}
            itemComponent={NodePanel}
            form={form}
            dataSources={dataSources}
          />

          { !isFull &&
            <div className="stage-editor-section-content-items__controls">
              <AddPanel onClick={() => createNewPanel()} />
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

const getDataSources = (state) => {
  const externalData = get(state, 'protocol.present.externalData', {});
  return keys(externalData);
};

const mapStateToProps = (state, props) => ({
  disabled: !has(props.form.getValues(state, 'subject'), 'type'),
  dataSources: getDataSources(state),
  panels: props.form.getValues(state, 'panels'),
});

const mapDispatchToProps = (dispatch, { form }) => ({
  createNewPanel: bindActionCreators(
    () => arrayPush(form.name, 'panels', { id: uuid(), title: null, dataSource: null, filter: null }),
    dispatch,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  NodePanels,
);
