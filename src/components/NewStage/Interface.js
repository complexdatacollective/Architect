import React from 'react';
import { get } from 'lodash';
import { compose, defaultProps } from 'recompose';
import changeCase from 'change-case';
import { Zoom } from '../../behaviours';
import timelineImages from '../../images/timeline';

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
    <div
      className="new-stage-interface"
      onClick={() => onSelect(type)}
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
    </div>
  );
};

export default compose(
  defaultProps({ zoomColors: ['#2d2955', '#ffffff'] }),
  Zoom,
)(Interface);
