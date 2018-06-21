import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FieldArray, arrayPush } from 'redux-form';
import uuid from 'uuid';
import cx from 'classnames';
import { keys, has, get } from 'lodash';
import { Button } from '../../../../ui/components';
import Items from '../../Sortable/Items';
import NodePanel from './NodePanel';

const NodePanels = ({ form, createNewPanel, dataSources, disabled }) => (
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

      <div className="stage-editor-section-content-items__controls">
        <Button onClick={() => createNewPanel()} size="small" type="button">Add new panel</Button>
      </div>
    </div>
  </div>
);

NodePanels.Guidance = (
  <Fragment>
    <h3>Panels help</h3>
    <p>
      The Name Generator interfaces allows you to configure up to two &quot;panels&quot;. Panels let
      you display lists of nodes to the participant, that may speed up the task of creating alters.
      For example, a panel could be used to show alters that the user has mentioned on a previous
      name generator, or even a previous interview.
    </p>
    <p>
      Data for panels can come from two sources:
    </p>
    <ul>
      <li>The current network for the interview session. This means any nodes that have already been
        created within this interview session.</li>
      <li>An external data source, embedded within your protocol file.</li>
    </ul>
    <p>
      Once the data source has been selected, you can optionally further filter the nodes that are
      displayed in a panel, using the network query builder syntax.
    </p>
  </Fragment>
);

NodePanels.propTypes = {
  createNewPanel: PropTypes.func.isRequired,
  dataSources: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
};

NodePanels.defaultProps = {
  disabled: false,
};

const getDataSources = (state) => {
  const externalData = get(state, 'protocol.present.externalData', {});
  return keys(externalData);
};

const mapStateToProps = (state, props) => ({
  disabled: !has(props.form.getValues(state, 'subject'), 'type'),
  dataSources: getDataSources(state),
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
