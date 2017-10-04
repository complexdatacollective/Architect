/* eslint-disable react/sort-comp, no-underscore-dangle */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { sum, map, times, constant } from 'lodash';
import Scroller from 'scroller';
import { Group } from 'react-canvas';

class ListView extends PureComponent {
  propTypes = {
    style: PropTypes.object,
    numberOfItemsGetter: PropTypes.func.isRequired,
    itemHeightGetter: PropTypes.func.isRequired,
    itemGetter: PropTypes.func.isRequired,
    snapping: PropTypes.bool,
    scrollingDeceleration: PropTypes.number,
    scrollingPenetrationAcceleration: PropTypes.number,
    onScroll: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      scrollTop: 0,
    };
  }

  getDefaultProps() {
    return {
      style: { left: 0, top: 0, width: 0, height: 0 },
      snapping: false,
      scrollingDeceleration: 0.95,
      scrollingPenetrationAcceleration: 0.08,
    };
  }

  componentDidMount() {
    this.createScroller();
    this.updateScrollingDimensions();
  }

  renderItem = (itemIndex) => {
    const item = this.props.itemGetter(itemIndex, this.state.scrollTop);
    const itemHeight = this.props.itemHeightGetter(itemIndex);
    const style = {
      top: 0,
      left: 0,
      width: this.props.style.width,
      height: itemHeight,
      translateY: (itemIndex * itemHeight) - this.state.scrollTop,
      zIndex: itemIndex,
    };

    return (
      React.createElement(Group, { style, key: itemIndex },
        item,
      )
    );
  }

  render() {
    const items = this.getVisibleItemIndexes().map(this.renderItem);
    return (
      React.createElement(
        Group,
        {
          style: this.props.style,
          onTouchStart: this.handleTouchStart,
          onTouchMove: this.handleTouchMove,
          onTouchEnd: this.handleTouchEnd,
          onTouchCancel: this.handleTouchEnd,
        },
        items,
      )
    );
  }

  // Events
  // ======

  handleTouchStart = (e) => {
    if (this.scroller) {
      this.scroller.doTouchStart(e.touches, e.timeStamp);
    }
  }

  handleTouchMove = (e) => {
    if (this.scroller) {
      e.preventDefault();
      this.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
    }
  }

  handleTouchEnd = (e) => {
    if (this.scroller) {
      this.scroller.doTouchEnd(e.timeStamp);
      if (this.props.snapping) {
        this.updateScrollingDeceleration();
      }
    }
  }

  handleScroll = (left, top) => {
    this.setState({ scrollTop: top });
    if (this.props.onScroll) {
      this.props.onScroll(top);
    }
  }

  // Scrolling
  // =========

  createScroller() {
    const options = {
      scrollingX: false,
      scrollingY: true,
      decelerationRate: this.props.scrollingDeceleration,
      penetrationAcceleration: this.props.scrollingPenetrationAcceleration,
    };
    this.scroller = new Scroller(this.handleScroll, options);
  }

  updateScrollingDimensions() {
    const width = this.props.style.width;
    const height = this.props.style.height;
    const scrollWidth = width;
    const scrollHeight = sum(this.itemHeights()) + height;
    this.scroller.setDimensions(width, height, scrollWidth, scrollHeight);
  }

  itemHeights() {
    const numberOfItems = this.props.numberOfItemsGetter();
    if (this._numberOfItems !== numberOfItems || !this._itemHeights) {
      console.log('recalc heights');
      this._itemHeights = map(
        times(numberOfItems, constant(0)),
        (_, index) => this.props.itemHeightGetter(index),
      );
      this._numberOfItems = numberOfItems;
    }

    return this._itemHeights;
  }

  getVisibleItemIndexes() {
    const itemIndexes = [];
    const itemHeights = this.itemHeights();
    const itemCount = this.props.numberOfItemsGetter();
    const scrollTop = this.state.scrollTop;
    let itemScrollTop = 0;

    for (let index = 0; index < itemCount; index += 1) {
      itemScrollTop = sum(itemHeights.slice(0, index)) - scrollTop;

      // Item is completely off-screen bottom
      if (itemScrollTop >= this.props.style.height) {
        continue; // eslint-disable-line no-continue
      }

      // Item is completely off-screen top
      if (itemScrollTop <= -this.props.style.height) {
        continue; // eslint-disable-line no-continue
      }

      // Part of item is on-screen.
      itemIndexes.push(index);
    }

    return itemIndexes;
  }

  updateScrollingDeceleration() {
    let currVelocity = this.scroller.__decelerationVelocityY;
    const currScrollTop = this.state.scrollTop;
    let targetScrollTop = 0;
    let estimatedEndScrollTop = currScrollTop;

    while (Math.abs(currVelocity).toFixed(6) > 0) {
      estimatedEndScrollTop += currVelocity;
      currVelocity *= this.props.scrollingDeceleration;
    }

    // Find the page whose estimated end scrollTop is closest to 0.
    let closestZeroDelta = Infinity;
    const itemHeights = this.itemHeights();
    const pageCount = this.props.numberOfItemsGetter();
    let pageScrollTop;

    for (let pageIndex = 0, len = pageCount; pageIndex < len; pageIndex += 1) {
      pageScrollTop = sum(itemHeights.slice(0, pageIndex)) - estimatedEndScrollTop;
      if (Math.abs(pageScrollTop) < closestZeroDelta) {
        closestZeroDelta = Math.abs(pageScrollTop);
        targetScrollTop = sum(itemHeights.slice(0, pageIndex));
      }
    }

    this.scroller.__minDecelerationScrollTop = targetScrollTop;
    this.scroller.__maxDecelerationScrollTop = targetScrollTop;
  }
}

export default ListView;
