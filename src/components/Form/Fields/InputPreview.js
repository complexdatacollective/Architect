import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import inputImages from '../../../images/inputs';

const getInputImage = (type) => get(inputImages, type);

const InputPreview = ({
  image,
  label,
  description,
}) => (
  <div
    className="input-preview"
  >
    <div className="input-preview__image">
      <img className="" src={getInputImage(image)} alt={label} />
    </div>
    <div className="input-preview__description">
      <p>{description}</p>
    </div>
  </div>
);

InputPreview.propTypes = {
  image: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default InputPreview;
