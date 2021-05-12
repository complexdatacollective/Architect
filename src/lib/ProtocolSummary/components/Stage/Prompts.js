import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { getVariableName } from '../../helpers';
import SummaryContext from '../SummaryContext';
import DualLink from '../DualLink';

const Prompt = ({
  id,
  text,
  additionalAttributes,
  edges,
  variable,
  layout,
  createEdge,
  edgeVariable,
}) => {
  const {
    index,
  } = useContext(SummaryContext);

  return (
    <div key={id} className="protocol-summary-stage__prompts-prompt">
      <Markdown source={text} />
      <table>
        <tbody>
          { edges && edges.create && <tr><td>Create edge {edges.create}</td></tr> }
          { variable && <tr><td>Variable {variable}</td></tr> }
          { layout && layout.layoutVariable && <tr><td>Layout variable {layout.layoutVariable}</td></tr> }
          { createEdge && <tr><td>Create edge {createEdge}</td></tr> }
          { edgeVariable && <tr><td>Edge variable {edgeVariable}</td></tr> }
        </tbody>
      </table>
      { additionalAttributes && (
        <>
          <h4>AdditionalAttributes</h4>
          <table>
            <tbody>
              {additionalAttributes.map(
                ({ variable, value }) => (
                  <tr>
                    <td>{`${getVariableName(index, variable)} ${value}`}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

const Prompts = ({
  prompts,
}) => {
  if (!prompts) { return null; }

  return (
    <div className="protocol-summary-stage__prompts">
      <h2>Prompts</h2>
      {prompts.map((prompt) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Prompt {...prompt} />
      ))}
    </div>
  );
};

const PromptType = PropTypes.shape({
  id: PropTypes.string,
  text: PropTypes.string,
});

Prompts.propTypes = {
  prompts: PropTypes.arrayOf(PromptType),
};

Prompts.defaultProps = {
  prompts: [],
};

export default Prompts;
