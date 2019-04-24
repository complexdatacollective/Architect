import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { compose, defaultProps } from 'recompose';
import changeCase from 'change-case';
import { Zoom } from '../../behaviours';
import timelineImages from '../../images/timeline';
import Guidance from '../Guidance';

const getTimelineImage = type =>
  get(timelineImages, type);

const Interface = ({
  type,
  tags,
  title,
  onSelect,
}) => {
  const image = getTimelineImage(type);
  return (
    <Guidance
      className="new-stage-interface"
      onClick={() => onSelect(type)}
      contentId={`guidance.new_stage.${type}`}
    >
      <h3 className="new-stage-interface__title">{ title }</h3>
      { image && <img className="new-stage-interface__preview" src={image} alt={title} /> }
      <div className="new-stage-interface__tags">
        {tags.map((tag, index) => (
          <div
            className={`new-stage-interface__tag new-stage-interface__tag--${changeCase.param(tag)}`}
            key={index}
          >{tag}</div>
        ))}
      </div>
    </Guidance>
  );
};

Interface.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  tags: PropTypes.array,
};

Interface.defaultProps = {
  tags: [],
};

export default compose(
  defaultProps({ zoomColors: ['#2d2955', '#ffffff'] }),
  Zoom,
)(Interface);
