import React from 'react';
import { components as ReactSelectComponents } from 'react-select';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';

const DefaultSelectOption = (props) => {
  const {
    data,
    onDeleteOption,
  } = props;
  /* eslint-disable no-underscore-dangle */
  const isWarning = !!data.__isWarning__;
  const showNew = !!data.__createNewOption__ || !!data.__isNew__;
  const showDelete = !isWarning && !data.__isNew__ && !!onDeleteOption && !data.isUsed;
  const label = data.__createNewOption__
    ? data.__createNewOption__
    : data.label;
  const handleClickDelete = (e) => {
    e.stopPropagation();
    props.onDeleteOption(data.value);
  };
  /* eslint-enable */

  const classes = cx(
    'form-fields-select__item',
    { 'form-fields-select__item--warning': isWarning },
  );

  return (
    <ReactSelectComponents.Option
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={classes}
      classNamePrefix="form-fields-select__item"
    >
      { isWarning
        && (
        <div className="form-fields-select__item-warning">
          <Icon name="warning" />
        </div>
        )}
      { showNew
        && (
        <div className="form-fields-select__item-add">
          <Icon name="add" />
        </div>
        )}

      <div className="form-fields-select__item-label">
        {label}
      </div>

      { showDelete
        && (
        <div
          className="form-fields-select__item-delete"
          onClick={handleClickDelete}
        >
          <Icon name="delete" />
        </div>
        )}
    </ReactSelectComponents.Option>
  );
};

DefaultSelectOption.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  onDeleteOption: PropTypes.func,
};

DefaultSelectOption.defaultProps = {
  onDeleteOption: null,
};

export default DefaultSelectOption;
