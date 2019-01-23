import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../../ui/components/Button';

class PromptForm extends PureComponent {
  render() {
    const onComplete = this.props.onComplete;

    return (
      <div>
        {this.form && this.form() }
        <Button onClick={onComplete}>Done</Button>
      </div>
    );
  }
}

PromptForm.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default PromptForm;
