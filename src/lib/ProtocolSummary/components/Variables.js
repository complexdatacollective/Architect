import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { toPairs, get, find } from 'lodash';
import Markdown from 'react-markdown';
import { ALLOWED_MARKDOWN_LABEL_TAGS } from '@codaco/ui/src/utils/config';
import SummaryContext from './SummaryContext';
import DualLink from './DualLink';

const getStageName = (protocol) => (stageId) => {
  const stageConfiguration = find(protocol.stages, ['id', stageId]);
  return get(stageConfiguration, 'label');
};

// TODO: Make this part of the index?
const makeGetUsedIn = (protocol) => (indexEntry) => {
  const stages = get(indexEntry, 'stages', []);

  return stages.map((stageId) => ([
    stageId,
    getStageName(protocol)(stageId),
  ]));
};

const OptionsTable = ({ options }) => (
  <table className="protocol-summary-variables__options">
    {options.map((option) => (
      <tr key={option.value}>
        <td>
          <em>{option.value}</em>
        </td>
        <td>
          <Markdown
            source={option.label}
            allowedTypes={ALLOWED_MARKDOWN_LABEL_TAGS}
          />
        </td>
      </tr>
    ))}
  </table>
);

const OptionType = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.string,
});

OptionsTable.propTypes = {
  options: PropTypes.arrayOf(OptionType).isRequired,
};

const Variables = ({ variables }) => {
  const {
    protocol,
    index,
  } = useContext(SummaryContext);

  const getUsedIn = makeGetUsedIn(protocol, index);

  return (
    <div className="protocol-summary-variables">
      <h2>Variables</h2>

      <table className="protocol-summary-variables__data">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Detail</th>
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          {toPairs(variables).map(([variableId, variableConfiguration]) => {
            const {
              name,
              type,
              options,
            } = variableConfiguration;

            const indexEntry = index.find(({ id }) => id === variableId);

            return (
              <tr key={variableId} id={`variable-${variableId}`}>
                <td>{name}</td>
                <td>{type}</td>
                <td>
                  <table className="protocol-summary-variables__details">
                    {indexEntry && indexEntry.prompt && (
                      <tr>
                        <th>Label</th>
                        <td><Markdown source={indexEntry.prompt} /></td>
                      </tr>
                    )}
                    {options && (
                      <tr>
                        <th>Values</th>
                        <td><OptionsTable options={options} /></td>
                      </tr>
                    )}
                  </table>
                </td>
                <td>
                  {getUsedIn(indexEntry).map(([stageId, stageName]) => (
                    <>
                      <DualLink to={`#stage-${stageId}`}>{stageName}</DualLink>
                      <br />
                    </>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

Variables.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  variables: PropTypes.object.isRequired,
};

export default Variables;
