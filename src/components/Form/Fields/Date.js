import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import uuid from 'uuid';
import { Icon } from '@codaco/ui';

const dashIndex = [4, 7];

// - ignore dashes (they are auto-populated)
// - ignore letters
const filterInput = currentValue =>
  (e) => {
    const ignoreList = 'abcdefghijklmnopqrstuvwxyz-'.split('');
    if (dashIndex.includes(currentValue.length) && e.key === '-') {
      return;
    }
    if (!ignoreList.includes(e.key)) { return; }
    e.preventDefault();
  };

const getParsedValue = dateFormat =>
  (value = '', previousValue = '') => {
    const parsedValue = value.split('')
      .slice(0, dateFormat.length)
      .map((char, index) => {
        if (dashIndex.includes(index)) { return '-'; }
        return parseInt(char, 10) || '0';
      })
      .join('');

    if (
      dashIndex.includes(value.length) &&
      previousValue.length < value.length &&
      value.length < dateFormat.length
    ) {
      return `${parsedValue}-`;
    }

    return parsedValue;
  };

class TextInput extends PureComponent {
  static propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    label: PropTypes.string,
    autoFocus: PropTypes.bool,
    fieldLabel: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    hidden: PropTypes.bool,
  };

  static defaultProps = {
    input: {},
    meta: {},
    autoFocus: false,
    dateFormat: 'YYYY-MM-DD',
    label: null,
    fieldLabel: null,
    placeholder: '',
    className: '',
    hidden: false,
  };

  componentWillMount() {
    this.id = uuid();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dateFormat !== this.props.dateFormat) {
      const newValue = getParsedValue(this.props.dateFormat)(this.props.input.value);
      this.props.input.onChange(newValue);
    }
  }

  render() {
    const {
      input,
      meta: { error, active, invalid, touched },
      label,
      fieldLabel,
      className,
      autoFocus,
      hidden,
      dateFormat,
    } = this.props;

    const seamlessClasses = cx(
      className,
      'form-field-text',
      {
        'form-field-text--has-focus': active,
        'form-field-text--has-error': invalid && touched && error,
      },
    );

    const anyLabel = fieldLabel || label;

    const handleChange = (e) => {
      const newValue = e.target.value;
      const parsedValue = getParsedValue(dateFormat)(newValue, input.value);
      input.onChange(parsedValue);
    };

    return (
      <div className="form-field-container" hidden={hidden}>
        { anyLabel &&
          <h4>{anyLabel}</h4>
        }
        <div className={seamlessClasses}>
          <input
            id={this.id}
            name={input.name}
            className="form-field form-field-text form-field-text__input"
            placeholder={dateFormat.toUpperCase()}
            autoFocus={autoFocus} // eslint-disable-line
            {...input}
            onKeyDown={filterInput(input.value)}
            onChange={handleChange}
          />
          <div className="form-field-text__error"><Icon name="warning" />{error}</div>
        </div>

      </div>

    );
  }
}

export default TextInput;
