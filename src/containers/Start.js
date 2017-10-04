/* eslint-disable */

import React, { PureComponent } from 'react';
import ReactCanvas, { Gradient, Group, Image, Surface, Text } from 'react-canvas';
import ListView from './ListView';
import { constant, times, debounce } from 'lodash';

class MyListView extends ListView {
  doScroll(e) {
    if (this.scroller) {
      this.scroller.scrollBy(0, e.deltaY, true);
      this.scroller.doTouchMove([e], e.timeStamp);
    }
  };
}

class Start extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      items: times(5, constant({ title: 'foo' })),
    };
  }

  getNumberOfItems = () => {
    console.log('items', this.state.items);
    return this.state.items.length;
  }

  getItemHeight(index) {
    const surfaceHeight = window.innerHeight;

    return surfaceHeight / 2;
  }

  addAtItem(index) {
    this.setState({
      items: [
        ...this.state.items.slice(0, index + 1),
        { title: 'bar' },
        ...this.state.items.slice(index + 1),
      ],
    }, () => {
      if (!this.list) { return; }
      this.list.updateScrollingDimensions();
    });
  }

  renderItem = (index) => {
    const surfaceWidth = window.innerWidth;
    const surfaceHeight = window.innerHeight;

    const height = this.getItemHeight(index);
    const width = surfaceWidth;

    const item = this.state.items[index];

    const groupStyle = { top: 0, left: 0, width, height };

    const snapshotStyles = {
      height: height/2,
      width: height/2,
      top: 0,
      left: ((width/2) - (height/4)),
    };

    const addStyle = {
      top: (height/2) + 25,
      left: ((width/2) - 25),
      width: 50,
      height: 50,
    };

    const textStyles = {
      top: 0,
      left: 0,
      width: surfaceWidth,
      height: 20,
      lineHeight: 20,
      fontSize: 12,
      color: '#808080',
    };

    return (
      <Group
        style={groupStyle}
      >
        <Group style={addStyle} onClick={() => { this.addAtItem(index); }}>
          <Gradient
            style={addStyle}
            colorStops={[{ color: "#fff", position: 0 }]}
          />
        </Group>
        <Text style={textStyles}>{ item.title }</Text>
        <Image
          src="https://unsplash.it/400/300"
          style={snapshotStyles}
        />
      </Group>
    );
    // Render the item at the given index, usually a <Group>
  }

  getListViewStyle() {
    const surfaceWidth = window.innerWidth;
    const surfaceHeight = window.innerHeight;

    return {
      top: 0,
      left: 0,
      width: surfaceWidth,
      height: surfaceHeight,
    };
  }

  doScroll(e) {
    if(!this.list) { return; }
    this.list.doScroll(e);
  }

  componentDidMount() {
    this.doScrollDebounced = debounce(this.doScroll, 1000/60);
    this.node.addEventListener(
      'wheel',
      (e) => {
        this.doScrollDebounced(e);
      }
    );
  }

  render() {
    const surfaceWidth = window.innerWidth;
    const surfaceHeight = window.innerHeight;

    const textStyles = {
      top: 0,
      left: 100,
      width: surfaceWidth,
      height: 20,
      lineHeight: 20,
      fontSize: 12,
      color: '#ffffff',
    };

    return (
      <div ref={(node) => { this.node = node; }}>
        <Surface width={surfaceWidth} height={surfaceHeight} left={0} top={0}>
          <Text style={textStyles}>
            Here is some text below an image.
          </Text>
          <MyListView
            style={this.getListViewStyle()}
            numberOfItemsGetter={this.getNumberOfItems}
            itemHeightGetter={this.getItemHeight}
            itemGetter={this.renderItem}
            ref={(list) => { this.list = list; }}
          />
        </Surface>
      </div>
    );
  }
}

export default Start;
