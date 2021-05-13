import React from 'react';
import PropTypes from 'prop-types';
import MiniTable from '../MiniTable';
import EntityBadge from '../EntityBadge';
import Variable from '../Variable';

const Presets = ({ presets }) => {
  if (!presets) { return null; }

  return (
    <div className="protocol-summary-stage__presets">
      <h2>Presets</h2>

      <ol>
        {presets.map((preset) => (
          <li>
            <div className="protocol-summary-stage__presets-item">
              <h4>{preset.label}</h4>
              <MiniTable
                rows={[
                  [<strong>Layout variable</strong>, <Variable id={preset.layoutVariable} link />],
                  [
                    <strong>Show edges</strong>,
                    preset.edges.display.map((edge) => (
                      <>
                        <EntityBadge entity="edge" type={edge} tiny link />
                        <br />
                      </>
                    )),
                  ],
                  [<strong>Group by variable</strong>, <Variable id={preset.groupVariable} link />],
                  [
                    <strong>Highlight attributes</strong>,
                    preset.highlight.map((id) => (
                      <>
                        <Variable id={id} link />
                        <br />
                      </>
                    )),
                  ],
                ]}
              />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

Presets.propTypes = {
};

Presets.defaultProps = {
};

export default Presets;
// edges: {display: Array(1)}
// groupVariable: "e343a91f-628d-4175-870c-957beffa0154"
// highlight: ["03b03617-46ae-41cb-9462-9acd8a17edd6"]
// id: "preset2"
// label: "Another preset (with more text than will fit)"
// layoutVariable: "e13ca72d-aefe-4f48-841d-09f020e0e987"
