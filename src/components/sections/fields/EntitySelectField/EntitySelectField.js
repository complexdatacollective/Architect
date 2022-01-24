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
  <div
    className={cx('preview-node', { 'preview-node--selected': selected }, { 'preview-node--clickable': onClick })}
    onClick={!selected ? onClick : undefined}
  >
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

  const options = useMemo(() => entityType === 'edge' ? edgeOptions : nodeOptions, [entityType, edgeOptions, nodeOptions]);

  const hasError = !!touched && !!error;

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
    'form-fields-entity-select',
    {
      'form-fields-entity-select--has-error': hasError,
    },
    {
      'form-fields-entity-select--nodes': entityType === 'node',
    },
    {
      'form-fields-entity-select--edges': entityType === 'edge',
    },
  );

  console.log('EntitySelect', props);

  return (
    <div className={classes}>
      { label && (<h4 className="form-field-label">{label}</h4>) }
      <div className="form-field form-fields-entity-select__field">
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
      </div>
      {invalid && touched && (
        <div className="form-fields-entity-select__error">
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
  );
};

EntitySelectField.propTypes = {
};

EntitySelectField.defaultProps = {
};

export default EntitySelectField;
