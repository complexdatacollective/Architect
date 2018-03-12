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

  constructor(props) {
    super(props);

    this.state = { isFocussed: false };
  }

  componentWillMount() {
    this.id = uniqueId('label');
  }

  onChange = () => {
    this.props.onChange(this.input.value);
  }

  onBlur = () => this.setState({ isFocussed: false });
  onFocus = () => this.setState({ isFocussed: true });

  render() {
    const {
      value,
    } = this.props;

    return (
      <label
        htmlFor={this.id}
        className={cx('markdown-input', { 'markdown-input--is-focussed': this.state.isFocussed })}
      >
        <Markdown className="markdown-input__preview" source={value} />
        <textarea
          className={cx('markdown-input__input')}
          value={value}
          id={this.id}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          ref={(input) => { this.input = input; }}
        />
      </label>
    );
  }
}

export default MarkdownInput;
