import React from 'react';
import { components as ReactSelectComponents } from 'react-select';
import PropTypes from 'prop-types';
import Icon from '../../../ui/components/Icon';

const DefaultSelectOption = (props) => {
  const { data } = props;

  /* eslint-disable no-underscore-dangle */
  const showNew = !!data.__createNewOption__ || !!data.__isNew__;
  const showDelete = data.__canDelete__; //!!props.onDeleteOption;
  const label = data.__createNewOption__ ?
    data.__createNewOption__ :
    data.label;
  const handleClickDelete = (e) => {
    e.stopPropagation();
    props.onDeleteOption(data.value);
  };
  /* eslint-enable */

  return (
    <ReactSelectComponents.Option
      {...props}
      className="form-fields-select__item"
      classNamePrefix="form-fields-select__item"
    >
      { showNew &&
        <div className="form-fields-select__item-add">
          <Icon name="add" />
        </div>
      }

      <div className="form-fields-select__item-label">
        {label}
      </div>

      { showDelete &&
        <div
          className="form-fields-select__item-delete"
          onClick={handleClickDelete}
        >
          <Icon name="delete" />
        </div>
      }
    </ReactSelectComponents.Option>
  );
};

DefaultSelectOption.propTypes = {
  data: PropTypes.object.isRequired,
  onDeleteOption: PropTypes.func,
};

DefaultSelectOption.defaultProps = {
  onDeleteOption: null,
};

export default DefaultSelectOption;
