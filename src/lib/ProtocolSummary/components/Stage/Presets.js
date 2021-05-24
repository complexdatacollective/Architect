import React from 'react';
import PropTypes from 'prop-types';
import MiniTable from '../MiniTable';
import EntityBadge from '../EntityBadge';
import Variable from '../Variable';

const Presets = ({ presets }) => {
  if (!presets) { return null; }

  return (
    <div className="protocol-summary-stage__presets">
      <div className="protocol-summary-stage__presets-content">
        <h2 className="section-heading">Presets</h2>
        <ol>
          {presets.map((preset) => (
            <li>
              <div className="protocol-summary-stage__presets-item">
                <h2 className="section-heading">{preset.label}</h2>
                <MiniTable
                  rotated
                  rows={[
                    [
                      'Layout variable',
                      <Variable id={preset.layoutVariable} link />],
                    [
                      'Show edges',
                      <ul>
                        {
                          preset.edges.display.map((edge) => (
                            <li>
                              <EntityBadge entity="edge" type={edge} tiny link />
                            </li>
                          ))
                        }
                      </ul>,
                    ],
                    ['Group variable', <Variable id={preset.groupVariable} link />],
                    [
                      'Highlight attributes',
                      <ul>
                        {
                          preset.highlight.map((id) => (
                            <li>
                              <Variable id={id} link />
                              <br />
                            </li>
                          ))
                        }
                      </ul>,
                    ],
                  ]}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

Presets.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  presets: PropTypes.object,
};

Presets.defaultProps = {
  presets: null,
};

export default Presets;
// edges: {display: Array(1)}
// groupVariable: "e343a91f-628d-4175-870c-957beffa0154"
// highlight: ["03b03617-46ae-41cb-9462-9acd8a17edd6"]
// id: "preset2"
// label: "Another preset (with more text than will fit)"
// layoutVariable: "e13ca72d-aefe-4f48-841d-09f020e0e987"
