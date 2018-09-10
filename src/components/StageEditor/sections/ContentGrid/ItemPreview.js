import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Icon } from '../../../../ui/components';
import { SMALL, MEDIUM, LARGE } from './index';

const ItemPreview = ({ name, onDelete }) => (
  <div className="content-grid-preview">
    <div className="content-grid-preview__name">
      <Field name={name} component={props => <div>{JSON.stringify(props)}</div>} />
    </div>
    <div className="content-grid-preview__delete" onClick={onDelete}>
      <Icon name="delete" />
    </div>
  </div>
);

ItemPreview.propTypes = {
  content: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.oneOf([SMALL, MEDIUM, LARGE]),
  onDelete: PropTypes.func.isRequired,
};

ItemPreview.defaultProps = {
  content: null,
  type: null,
  size: null,
};

export default ItemPreview;
