import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';
import Text from '@codaco/ui/lib/components/Fields/Text';

const getValue = (options, value) => {
  const foundValue = options.find(option => option.value === value);
  if (!foundValue) { return null; }

  return foundValue;
};


const Select = ({
  className,
  input: { onBlur, ...input },
  options,
  label,
  createNewOption,
  meta: { invalid, error, touched },
  ...rest,
}) => {
  // const {
  //   className,
  //   input: { onBlur, ...input },
  //   options,
  //   children,
  //   selectOptionComponent,
  //   label,
  //   createNewOption,
  //   meta: { invalid, error, touched },
  //   ...rest
  // } = this.props;

  // const componentClasses = cx(
  //   className,
  //   'form-fields-select',
  //   {
  //     'form-fields-select--has-error': invalid && touched && error,
  //   },
  // );

  const handleChange = (e) => {
    const value = e.target.value;
    console.log(value);
  };

  return (
    <motion.div>
      <motion.div>
        <select className>
          <option>&mdash; Select an option &mdash;</option>
          {options.map(({ value, label }) => (
            <option value={value}>{label}</option>
          ))}
        </select>
        { createNewOption &&
          <button>Create new</button>
        }
      </motion.div>
      <motion.div>
        <Text />
        <button>Delete</button>
      </motion.div>
      {invalid && touched && <div className="form-fields-select__error"><Icon name="warning" />{error}</div>}
    </motion.div>
  );
};

Select.propTypes = {
};

Select.defaultProps = {
  meta: {},
  input: {},
};


export default Select;
