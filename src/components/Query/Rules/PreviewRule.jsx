import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { Icon } from '@codaco/ui/lib/components';
import RuleText, { Join } from './PreviewText';
import withDisplayOptions from './withDisplayOptions';

const withDeleteHandler = withHandlers({
  handleDelete: (props) => (e) => {
    e.stopPropagation();

    props.onDelete();
  },
});

const PreviewRule = ({
  type, options, join, onClick, handleDelete,
}) => (
  <>
    <div
      className="rules-preview-rule"
      onClick={onClick}
    >
      <div className="rules-preview-rule__text">
        <RuleText type={type} options={options} />
      </div>
      <button
        type="button"
        className="rules-preview-rule__delete"
        onClick={handleDelete}
      >
        <Icon name="delete" />
      </button>
    </div>
    { join && <Join value={join} /> }
  </>
);

PreviewRule.propTypes = {
  type: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.object.isRequired,
  join: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

PreviewRule.defaultProps = {
  join: null,
};

export default compose(
  withDeleteHandler,
  withDisplayOptions,
)(PreviewRule);
