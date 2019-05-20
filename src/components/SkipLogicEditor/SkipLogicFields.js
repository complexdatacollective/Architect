import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query, withStoreConnector } from '../Query';
import Select from '../Form/Fields/Select';

const ConnectedQuery = withStoreConnector(Query);

class SkipLogicEditor extends PureComponent {
  static propTypes = {
    logic: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    if (!this.props.logic) { return null; }

    const {
      onChange,
      logic: {
        action,
        filter,
      },
    } = this.props;

    return (
      <div>
        <h1>Edit Skip Logic</h1>
        <div>
          <Select
            options={[
              { value: 'SHOW', label: 'Show this stage if' },
              { value: 'SKIP', label: 'Skip this stage if' },
            ]}
            onChange={value => onChange('action', value.value)}
            input={{
              value: action,
            }}
          />
        </div>
        <div>
          <ConnectedQuery
            rules={filter.rules}
            join={filter.join}
            onChange={value => onChange('filter', value)}
          />
        </div>
      </div>
    );
  }
}

export { SkipLogicEditor };

export default SkipLogicEditor;
