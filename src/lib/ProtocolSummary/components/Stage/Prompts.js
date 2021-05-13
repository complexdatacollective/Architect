import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { compact } from 'lodash';
import { renderValue } from '../helpers';
import SummaryContext from '../SummaryContext';
import MiniTable from '../MiniTable';
import Variable from '../Variable';
import EntityBadge from '../EntityBadge';

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

  const attributeRows = compact([
    edges && edges.create && ['Create edge', <EntityBadge entity="edge" type={edges.create} tiny link />],
    variable && ['Variable', <Variable id={variable} />],
    layout && layout.layoutVariable && ['Layout variable', <Variable id={layout.layoutVariable} />],
    createEdge && ['Create edge', <EntityBadge entity="edge" type={createEdge} tiny link />],
    edgeVariable && ['Edge variable', <Variable id={edgeVariable} />],
  ]);

  const additionalAttributeRows = additionalAttributes.map(
    ({ variable, value }) => ([
      <Variable id={variable} />,
      renderValue(value),
    ]),
  );

  return (
    <li key={id}>
      <div className="protocol-summary-stage__prompts-prompt">
        <Markdown source={text} />
        { attributeRows.length > 0 && <MiniTable rows={attributeRows} /> }
        { additionalAttributeRows.length > 0 && (
          <MiniTable rows={additionalAttributeRows} />
        )}
      </div>
    </li>
  );
};

Prompt.defaultProps = {
  additionalAttributes: [],
};

const Prompts = ({
  prompts,
}) => {
  if (!prompts) { return null; }

  return (
    <div className="protocol-summary-stage__prompts">
      <h2>Prompts</h2>
      <ol>
        {prompts.map((prompt) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Prompt {...prompt} />
        ))}
      </ol>
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
  prompts: null,
};

export default Prompts;
