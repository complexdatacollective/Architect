import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { uniqueId } from 'lodash';
import cx from 'classnames';

class MarkdownInput extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
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
    } = this.props;

    return (
      <label htmlFor={this.id} className={cx('markdown-input')}>
        <textarea
          className={cx('markdown-input__input')}
          value={value}
          id={this.id}
          onChange={this.onChange}
          ref={(input) => { this.input = input; }}
        />
        <Markdown className="markdown-input__preview" source={value} />
      </label>
    );
  }
}

export default MarkdownInput;
