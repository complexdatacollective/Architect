import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '@codaco/ui/lib/components/Button';
import { Icon, Node } from '@codaco/ui';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { actionCreators as screenActions } from '@modules/ui/screens';
import { asOptions } from '../../../../selectors/utils';
import { makeScreenMessageListener } from '../../../../selectors/ui';
import { getEdgeTypes, getNodeTypes } from '../../../../selectors/codebook';

const PreviewNode = ({
  label, color, onClick, selected,
}) => (
  <div className="preview-node" onClick={!selected ? onClick : undefined}>
    <Node label={label} selected={selected} color={color} />
  </div>
);

PreviewNode.propTypes = {
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
};

PreviewNode.defaultProps = {
  color: 'node-color-seq-1',
  selected: false,
};

const PreviewEdge = ({
  label, color, onClick, selected,
}) => (
  <div
    className={cx('preview-edge', { 'preview-edge--selected': selected }, { 'preview-edge--clickable': onClick })}
    style={{ '--edge-color': `var(--${color})` }}
    onClick={!selected ? onClick : undefined}
  >
    <Icon name="links" color={color} />
    {label}
  </div>
);

const EntitySelectField = (props) => {
  const {
    entityType,
    name,
    label,
    parse,
    format,
    input: {
      value,
      onChange,
    },
    meta: {
      error,
      invalid,
      touched,
    },
    promptBeforeChange,
  } = props;

  const dispatch = useDispatch();
  const openDialog = (dialog) => dispatch(dialogActions.openDialog(dialog));
  const openScreen = (screen, params) => dispatch(screenActions.openScreen(screen, params));
  const edgeOptions = useSelector((state) => asOptions(getEdgeTypes(state)));
  const nodeOptions = useSelector((state) => asOptions(getNodeTypes(state)));

  const screenMessageListener = makeScreenMessageListener('type');
  const typeScreenMessage = useSelector((state) => screenMessageListener(state));

  // // If there is no stage subject, switch to it.
  // // If there *is* a stage subject, just create the new type.
  // useEffect(() => {
  //     // Message is sent by the new entity screen dialog.
  //     // If it is empty, we don't need to do anything.
  //     // If there is a currentType, we also don't do anything
  //     if (!typeScreenMessage || currentType) { return; }

  //     // If there's no currentType, change the form to the new type.
  //     const { entity, type } = typeScreenMessage;
  //     changeForm(form, 'subject', { entity, type });
  // }, [typeScreenMessage]);

  const options = useMemo(() => entityType === 'edge' ? edgeOptions : nodeOptions, [entityType, edgeOptions, nodeOptions]);

  const hasError = !!error;

  const handleClickItem = (clickedItem) => {
    if (!value || !promptBeforeChange) {
      onChange(clickedItem);
      return;
    }

    dispatch(dialogActions.openDialog({
      type: 'Confirm',
      title: `Change ${entityType} type?`,
      message: promptBeforeChange,
      onConfirm: () => onChange(clickedItem),
      confirmLabel: 'Continue',
    }));
  };

  const handleOpenCreateNewType = useCallback(() => {
    openScreen('type', { entity: entityType });
  }, [openScreen, encodeURI]);

  const PreviewComponent = useMemo(() => entityType === 'edge' ? PreviewEdge : PreviewNode, [entityType]);

  const renderOptions = useCallback(() => options.map(
    ({ label: optionLabel, color, value: optionValue }) => (
      <PreviewComponent
        key={optionValue}
        label={optionLabel}
        color={color}
        onClick={() => handleClickItem(optionValue)}
        selected={value === optionValue}
      />
    ),
  ), [options, value, handleClickItem, PreviewComponent]);

  const classes = cx(
    'form-field form-fields-entity-select',
    {
      'form-field form-fields-entity-select--has-error': hasError,
    },
  );

  console.log('EntitySelect', props);

  return (
    <div className={classes}>
      <div className="form-field form-fields-entity-select__edit">
        { label && (<h4 className="form-field-label">{label}</h4>) }
        <div className="form-fields-entity-select__edit-capture">
          { renderOptions() }
          { options.length === 0
            && (
            <p className="form-fields-entity-select__empty">
              No
              {' '}
              {entityType}
              {' '}
              types currently defined. Use the button below to create one.
            </p>
            )}
          {invalid && touched && (
          <div className="form-field-text__error">
            <Icon name="warning" />
            {error}
          </div>
          )}
          <Button
            color="primary"
            icon="add"
            size="small"
            onClick={handleOpenCreateNewType}
          >
            Create new
            {' '}
            {entityType}
            {' '}
            type
          </Button>
        </div>
      </div>
    </div>
  );
};

EntitySelectField.propTypes = {
};

EntitySelectField.defaultProps = {
};

export default EntitySelectField;
