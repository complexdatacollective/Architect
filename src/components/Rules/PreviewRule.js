import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import RuleText, { Join } from './PreviewText';
import withDisplayOptions from './withDisplayOptions';
import { Icon } from '../../ui/components';

const withDeleteHandler = withHandlers({
  handleDelete: props =>
    (e) => {
      e.stopPropagation();

      props.onDelete();
    },
});

const PreviewRule = ({ type, options, join, onClick, handleDelete }) => (
  <div
    className="rules-preview-rule"
    onClick={onClick}
  >
    <div className="rules-preview-rule__text">
      <RuleText type={type} options={options} />
      { join && <Join value={join} /> }
    </div>
    <button
      type="button"
      className="rules-preview-rule__delete"
      onClick={handleDelete}
    >
      <Icon name="delete" />
    </button>
  </div>
);

PreviewRule.propTypes = {
  type: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  join: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

PreviewRule.defaultProps = {
  join: null,
};

export { PreviewRule };
export default compose(
  withDeleteHandler,
  withDisplayOptions,
)(PreviewRule);