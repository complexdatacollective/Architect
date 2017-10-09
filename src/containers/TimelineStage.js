import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Group, Image, Rect, Text } from 'react-konva';

class TimelineStage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
    };
  }

  componentDidMount() {
    const image = new window.Image();
    const imageSrc = `/images/timeline/stage--${this.props.type}.png`;
    image.src = imageSrc;
    image.onload = () => {
      this.setState({
        image,
      });
    };
  }

  render() {
    const image = this.state.image;

    const {
      width,
      height,
    } = this.props;

    const centerX = width / 2;
    const snapshotHeight = height * (3 / 4);
    const snapshotWidth = snapshotHeight * (4 / 3);
    const snapshotX = centerX - (snapshotWidth / 2);

    const groupProps = {
      y: 0,
      x: 0,
      width,
      height,
    };

    const snapshotProps = {
      y: 0,
      x: snapshotX,
      height: snapshotHeight,
      width: snapshotWidth,
    };

    const addProps = {
      y: snapshotHeight + 20,
      x: centerX - 20,
      fill: 'white',
      height: 40,
      width: 40,
    };

    const ruleProps = {
      y: height / 2,
      x: snapshotX + snapshotWidth + 20,
      fill: 'white',
      height: 40,
      width: 40,
    };

    return (
      <Group
        {...groupProps}
      >
        <Text
          fill="white"
          x={0}
          y={0}
          height={20}
          width={200}
          text={this.props.title}
          fontSize={30}
          fontFamily="Calibri"
        />

        <Image
          image={image}
          {...snapshotProps}
          onClick={this.props.editStage}
        />

        <Rect {...addProps} onClick={this.props.addStage} />
        <Rect {...ruleProps} onClick={this.props.editSkip} />
      </Group>
    );
  }
}

TimelineStage.propTypes = {
  type: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  title: PropTypes.title,
  addStage: PropTypes.func,
  editStage: PropTypes.func,
  editSkip: PropTypes.func,
};

TimelineStage.defaultProps = {
  width: 0,
  height: 0,
  title: '',
  addStage: () => {},
  editStage: () => {},
  editSkip: () => {},
};

export default TimelineStage;
