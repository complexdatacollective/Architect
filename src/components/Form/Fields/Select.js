import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimateSharedLayout } from 'framer-motion';
import { get, noop } from 'lodash';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';

const Select = ({
  className,
  input,
  options,
  label,
  onCreateOption,
  meta,
  disabled,
  ...props
}) => {
  const { value } = input;
  const { invalid, error, touched } = meta;

  const onChange = input.onChange || props.onChange;

  const selected = options.findIndex(option => option.value === value);

  const classes = cx(
    className,
    'chooser',
    {
      'chooser--has-error': invalid && touched && error,
    },
  );

  const handleClickCreateNew = () => {
    onCreateOption();
  };

  const handleSelect = (e) => {
    const index = e.target.value;
    // Redux form value handler needs the actual value
    const valuePath = input.onChange ? [index, 'value'] : index;
    const updatedValue = get(options, valuePath, null);
    onChange(updatedValue);
  };

  return (
    <div className={classes}>
      <div className="chooser__section">
        <motion.div className="chooser__section-input">
          <AnimateSharedLayout>
            <motion.div key="options">
              <select
                onChange={handleSelect}
                value={selected}
                disabled={disabled}
                className="chooser__select"
              >
                <option>&mdash; Select an option &mdash;</option>
                {options.map((option, index) => (
                  <option
                    value={index}
                    key={`option_${index}`}
                  >{option.label || option.value}</option>
                ))}
              </select>
              { onCreateOption &&
                <button
                  onClick={handleClickCreateNew}
                  type="button"
                >Create new</button>
              }
            </motion.div>
            { invalid && touched &&
              <motion.div key="error" className="chooser__error"><Icon name="warning" />{error}</motion.div>
            }
          </AnimateSharedLayout>
        </motion.div>
      </div>
    </div>
  );
};

Select.propTypes = {
  options: PropTypes.array,
  className: PropTypes.string,
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.any,
  }),
  meta: PropTypes.shape({
    invalid: PropTypes.bool,
    error: PropTypes.string,
    touched: PropTypes.bool,
  }),
};

Select.defaultProps = {
  className: null,
  options: [],
  meta: {
    invalid: false,
    touched: false,
    error: null,
  },
  input: {
    value: null,
    onChange: noop,
  },
};


export default Select;
