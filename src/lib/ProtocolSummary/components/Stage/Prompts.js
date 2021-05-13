import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { compact } from 'lodash';
import { renderValue } from '../helpers';
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
  const attributeRows = compact([
    edges && edges.create
      && [<strong>Create edge</strong>, <EntityBadge entity="edge" type={edges.create} tiny link />],
    variable
      && [<strong>Variable</strong>, <Variable id={variable} />],
    layout && layout.layoutVariable
      && [<strong>Layout variable</strong>, <Variable id={layout.layoutVariable} />],
    createEdge
      && [<strong>Create edge</strong>, <EntityBadge entity="edge" type={createEdge} tiny link />],
    edgeVariable
      && [<strong>Edge variable</strong>, <Variable id={edgeVariable} />],
  ]);

  const additionalAttributeRows = additionalAttributes
    .map(({ variable, value }) => ([
      <Variable id={variable} />,
      renderValue(value),
    ]));

  return (
    <li key={id}>
      <div className="protocol-summary-stage__prompts-item">
        <Markdown source={text} />
        { attributeRows.length > 0 && <MiniTable rows={attributeRows} /> }
        { additionalAttributes.length > 0 && (
          <MiniTable
            rows={[
              [<strong>Variable</strong>, <strong>Value</strong>],
              ...additionalAttributeRows,
            ]}
          />
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
