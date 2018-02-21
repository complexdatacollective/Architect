import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { uniqueId } from 'lodash';
import cx from 'classnames';

class MarkdownInput extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.string,
  };

  static defaultProps = {
    label: '',
    value: '',
    onChange: () => {},
  };

  componentWillMount() {
    this.id = uniqueId('label');
  }

  onChange = () => {
    this.props.onChange(this.input.value);
  }

  render() {
    const {
      value,
      label,
    } = this.props;

    return (
      <label htmlFor={this.id} className={cx('rich-text')}>
        <div className={cx('rich-text__label')}>
          {label}
        </div>
        <textarea
          className={cx('rich-text__input')}
          value={value}
          id={this.id}
          onChange={this.onChange}
          ref={(input) => { this.input = input; }}
        />
        <Markdown source={value} />,
      </label>
    );
  }
}

export default MarkdownInput;
