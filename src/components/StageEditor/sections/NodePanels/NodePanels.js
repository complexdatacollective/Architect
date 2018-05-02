import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FieldArray, arrayPush } from 'redux-form';
import uuid from 'uuid';
import { keys, has, get } from 'lodash';
import { Button } from '../../../../ui/components';
import { Section, Editor, Guidance } from '../../../Guided';
import SortableItems from '../../SortableItems';
import NodePanel from './NodePanel';

const NodePanels = ({ form, createNewPanel, dataSources, ...rest }) => (
  <Section className="stage-editor-section" {...rest}>
    <Editor className="stage-editor-section__edit">
      <div className="stage-editor-section-content-items">
        <h2>Panels</h2>
        <p>Create any content you wish to display on the information screen.</p>
        <FieldArray
          name="panels"
          component={SortableItems}
          itemComponent={NodePanel}
          form={form}
          dataSources={dataSources}
        />

        <div className="stage-editor-section-content-items__controls">
          <Button onClick={() => createNewPanel()} size="small" type="button">Add new panel</Button>
        </div>
      </div>
    </Editor>
    <Guidance className="stage-editor-section__guidance">
      This is where you can add text and media items to your information screen.
    </Guidance>
  </Section>
);

NodePanels.propTypes = {
  createNewPanel: PropTypes.func.isRequired,
  dataSources: PropTypes.array.isRequired,
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
};

const getDataSources = (state) => {
  const externalData = get(state, 'protocol.present.externalData', {});
  return keys(externalData);
};

const mapStateToProps = (state, props) => ({
  show: has(props.form.getValues(state, 'subject'), 'type'),
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
