import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Guided } from './Guided';
import { Query, withStoreConnector } from './Query';
import Select from './Form/Fields/Select';

const ConnectedQuery = withStoreConnector(Query);

class SkipLogicEditor extends PureComponent {
  static propTypes = {
    rules: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    if (!this.props.rules) { return null; }

    const {
      onChange,
      rules: {
        action,
        filter,
      },
    } = this.props;

    return (

      <Guided
        className="edit-skip-logic"
        defaultGuidance="guidance.skipLogicEditor"
      >
        <h1>Edit Skip Logic</h1>
        <div>
          <div>
            <Select
              options={[
                { value: 'SHOW', label: 'Show this stage if' },
                { value: 'SKIP', label: 'Skip this stage if' },
              ]}
              onChange={value => onChange({ action: value })}
              value={action}
            />
          </div>
        </div>
        <div>
          <ConnectedQuery
            rules={filter.rules}
            join={filter.join}
            onChange={newFilter => onChange({ filter: newFilter })}
          />
        </div>
      </Guided>
    );
  }
}

export { SkipLogicEditor };

export default SkipLogicEditor;
