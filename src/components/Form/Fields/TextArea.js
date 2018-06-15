import React, { PureComponent } from 'react';
import { uniqueId } from 'lodash';
import cx from 'classnames';
import { fieldPropTypes } from 'redux-form';

class TextArea extends PureComponent {
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
      meta: { active },
      label,
    } = this.props;

    return (
      <label
        htmlFor={this.id}
        className={cx('form-fields-textarea', { 'form-fields-textarea--is-focussed': active })}
      >
        { label &&
          <div className="form-fields-textarea__label">{label}</div>
        }
        <div className="form-fields-textarea__edit">
          <textarea
            className={cx('form-fields-textarea__input')}
            id={this.id}
            {...this.props.input}
          />
        </div>
      </label>
    );
  }
}

export default TextArea;
