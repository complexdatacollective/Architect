import { Section } from '@components/EditorLayout';
import OrderedList from '@components/OrderedList';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { has } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { arrayPush, change, Field, formValueSelector } from 'redux-form';
import { v4 as uuid } from 'uuid';

import { Button } from '@codaco/ui';

import IssueAnchor from '../../IssueAnchor';
import NodePanel from './NodePanel';

const NodePanels = ({ form, createNewPanel, panels, ...rest }) => {
  const dispatch = useDispatch();
  const openDialog = useCallback(
    (dialog) => dispatch(dialogActions.openDialog(dialog)),
    [dispatch],
  );

  const handleToggleChange = useCallback(
    async (newState) => {
      if (!panels || panels.length === 0 || newState === true) {
        return true;
      }

      const confirm = await openDialog({
        type: 'Warning',
        title: 'This will delete your panel configuration',
        message:
          'This will clear your panel configuration, and delete any filter rules you have created. Do you want to continue?',
        confirmLabel: 'Remove panels',
      });

      if (confirm) {
        dispatch(change(form, 'panels', null));
        return true;
      }

      return false;
    },
    [dispatch, openDialog, panels],
  );

  const isFull = panels && panels.length === 2;

  return (
    <Section
      {...rest}
      title="Side Panels"
      toggleable
      summary={
        <p>
          Use this section to configure up to two side panels on this name
          generator.
        </p>
      }
      startExpanded={!!panels}
      handleToggleChange={handleToggleChange}
    >
      <div className="stage-editor-section-content-items">
        <IssueAnchor fieldName="panels" description="Panel Configuration">
          <Field
            name="panels"
            component={OrderedList}
            item={NodePanel}
            form={form}
          />
        </IssueAnchor>

        {!isFull && (
          <div className="stage-editor-section-content-items__controls">
            <Button onClick={() => createNewPanel()} size="small" icon="add">
              Add new panel
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
};

NodePanels.propTypes = {
  createNewPanel: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  panels: PropTypes.array,
  form: PropTypes.string.isRequired,
};

NodePanels.defaultProps = {
  disabled: false,
  panels: null,
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
    () =>
      arrayPush(form, 'panels', {
        id: uuid(),
        title: null,
        dataSource: 'existing',
        filter: null,
      }),
    dispatch,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(NodePanels);
