import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toPairs } from 'lodash';
import { Guided } from './Guided';
import Filter from './Filter';
import { NetworkRule, DropDown } from './Filter/Rule';

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
        ...predicate
      },
    } = this.props;

    return (
      <Guided defaultGuidance="guidance.skipLogicEditor">
        <div className="editor edit-skip-logic">
          <div className="editor__window">
            <div className="editor__content">
              <h1 className="editor__heading">Edit Skip Logic</h1>

              <div className="edit-skip-logic__section edit-skip-logic__section--first">
                <div className="edit-skip-logic__action">
                  <DropDown
                    options={toPairs({ SHOW: 'Show this stage if', SKIP: 'Skip this stage if' })}
                    onChange={value => onChange({ action: value })}
                    value={action}
                  />
                </div>
              </div>
              <div className="edit-skip-logic__section">
                <div className="edit-skip-logic__rule">
                  <NetworkRule
                    logic={predicate}
                    onChange={logic => onChange(logic)}
                  />
                </div>
              </div>
              <div className="edit-skip-logic__section">
                <Filter
                  filter={filter}
                  onChange={newFilter => onChange({ filter: newFilter })}
                />
              </div>
            </div>
          </div>
        </div>
      </Guided>
    );
  }
}

export { SkipLogicEditor };

export default SkipLogicEditor;
