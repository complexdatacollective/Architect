import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector, arrayPush, Field } from 'redux-form';
import uuid from 'uuid';
import { has } from 'lodash';
import { Button } from '@codaco/ui';
import { Section } from '@components/EditorLayout';
import OrderedList from '@components/OrderedList';
import { getFieldId } from '@app/utils/issues';
import NodePanel from './NodePanel';

const NodePanels = ({
  form, createNewPanel, panels, ...rest
}) => {
  const isFull = panels && panels.length === 2;

  return (
    <Section
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      title="Side Panels"
      toggleable
      id={getFieldId('panels')}
    >
      <div className="stage-editor-section-content-items">
        <p>Use this section to configure up to two side panels on this name generator.</p>
        <Field
          name="panels"
          component={OrderedList}
          item={NodePanel}
          form={form}
        />

        { !isFull
          && (
          <div className="stage-editor-section-content-items__controls">
            <Button onClick={() => createNewPanel()} size="small" icon="add">Add new panel</Button>
          </div>
          )}
      </div>
    </Section>
  );
};

NodePanels.propTypes = {
  createNewPanel: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  panels: PropTypes.array,
  form: PropTypes.string.isRequired,
};

NodePanels.defaultProps = {
  disabled: false,
  panels: [],
};

const mapStateToProps = (state, props) => {
  const getFormValues = formValueSelector(props.form);
  const panels = getFormValues(state, 'panels');
  const disabled = !has(getFormValues(state, 'subject'), 'type');

  return {
    disabled,
    panels,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  createNewPanel: bindActionCreators(
    () => arrayPush(form, 'panels', {
      id: uuid(), title: null, dataSource: 'existing', filter: null,
    }),
    dispatch,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  NodePanels,
);
