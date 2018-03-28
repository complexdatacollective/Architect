import React, { PureComponent } from 'react';
import Markdown from 'react-markdown';
import { uniqueId } from 'lodash';
import cx from 'classnames';
import { fieldPropTypes } from 'redux-form';

class MarkdownInput extends PureComponent {
  static propTypes = {
    ...fieldPropTypes,
  };

  constructor(props) {
    super(props);

    this.state = { isFocussed: false };
  }

  componentWillMount() {
    this.id = uniqueId('label');
  }

  render() {
    const {
      input: { value },
      meta: { active },
    } = this.props;

    return (
      <label
        htmlFor={this.id}
        className={cx('markdown-input', { 'markdown-input--is-focussed': active })}
      >
        <Markdown className="markdown-input__preview" source={value} />
        <textarea
          className={cx('markdown-input__input')}
          id={this.id}
          {...this.props.input}
        />
      </label>
    );
  }
}

export default MarkdownInput;
