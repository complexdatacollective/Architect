import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '@codaco/ui/lib/components/Button';
import { Icon } from '@codaco/ui';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { actionCreators as screenActions } from '@modules/ui/screens';
import { asOptions } from '../../../../selectors/utils';
import { getEdgeTypes, getNodeTypes } from '../../../../selectors/codebook';
import PreviewEdge from './PreviewEdge';
import PreviewNode from './PreviewNode';

const EntitySelectField = (props) => {
  const {
    entityType,
    label,
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
  const openScreen = (screen, params) => dispatch(screenActions.openScreen(screen, params));
  const edgeOptions = useSelector((state) => asOptions(getEdgeTypes(state)));
  const nodeOptions = useSelector((state) => asOptions(getNodeTypes(state)));

  const options = useMemo(() => {
    if (entityType === 'edge') {
      return edgeOptions;
    }
    return nodeOptions;
  }, [entityType, edgeOptions, nodeOptions]);

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

  const PreviewComponent = useMemo(() => {
    if (entityType === 'edge') {
      return PreviewEdge;
    }
    return PreviewNode;
  }, [entityType]);

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
  entityType: PropTypes.oneOf(['node', 'edge']).isRequired,
  label: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func,
  }).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    invalid: PropTypes.bool,
    touched: PropTypes.bool,
  }).isRequired,
  promptBeforeChange: PropTypes.string,
};

EntitySelectField.defaultProps = {
  label: null,
  promptBeforeChange: null,
};

export default EntitySelectField;
