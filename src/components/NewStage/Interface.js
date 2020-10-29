import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { compose, defaultProps } from 'recompose';
import { Zoom } from '../../behaviours';
import timelineImages from '../../images/timeline';
import Guidance from '../Guidance';

const getTimelineImage = type =>
  get(timelineImages, type);

const Interface = ({
  type,
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
      <h4 className="new-stage-interface__title">{ title }</h4>
      { image && <img className="new-stage-interface__preview" src={image} alt={title} /> }
    </Guidance>
  );
};

Interface.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default compose(
  defaultProps({ zoomColors: ['#2d2955', '#ffffff'] }),
  Zoom,
)(Interface);
