/* eslint-disable react/jsx-props-no-spreading, react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { get, isNull } from 'lodash';
import { renderValue } from '../helpers';
import MiniTable from '../MiniTable';
import Variable from '../Variable';
import EntityBadge from '../EntityBadge';

const directionLabel = (direction) => (
  direction === 'desc'
    ? 'DESCENDING'
    : 'ASCENDING'
);

const SortOrder = ({ rules }) => {
  const result = rules
    .map(({ property, direction }) => (
      <div>
        <Variable id={property} />
        {' '}
        <em>{directionLabel(direction)}</em>
      </div>
    ));
  return <div>{result}</div>;
};

const attributes = [
  ['layout.layoutVariable', 'Layout', (id) => <Variable id={id} />],
  ['variable', 'Variable', (id) => <Variable id={id} />],
  ['edges.create', 'Create edge', (type) => <EntityBadge entity="edge" type={type} tiny link />],
  ['createEdge', 'Create edge', (type) => <EntityBadge entity="edge" type={type} tiny link />],
  ['edgeVariable', 'Edge variable', (id) => <Variable id={id} />],
  ['highlight.allowHighlighting', 'Allow highlighting', (allow) => renderValue(allow)],
  ['highlight.variable', 'Highlight variable', (id) => <Variable id={id} />],
  ['negativeLabel', 'Negative label', (text) => text],
  ['sortOrder.property', 'Sort by property', (rules) => <SortOrder rules={rules} />],
  ['binSortOrder', 'Bin sort order', (rules) => <SortOrder rules={rules} />],
  ['bucketSortOrder', 'Bucket sort order', (rules) => <SortOrder rules={rules} />],
  ['otherVariable', 'Other variable', (id) => <Variable id={id} />],
  ['otherVariablePrompt', 'Other variable prompt', (text) => text],
  ['otherOptionLabel', 'Other option label', (text) => text],
];
const reduceAttribute = (prompt) => (acc, [path, label, renderer]) => {
  const value = get(prompt, path, null);
  if (isNull(value)) { return acc; }
  return [
    ...acc,
    [<strong>{label}</strong>, renderer(value)],
  ];
};

const Prompt = ({
  text,
  additionalAttributes,
  ...prompt
}) => {
  const attributeRows = attributes.reduce(reduceAttribute(prompt), []);

  const additionalAttributeRows = additionalAttributes
    .map(({ variable: variableId, value }) => ([
      <Variable id={variableId} />,
      renderValue(value),
    ]));

  return (
    <div className="protocol-summary-stage__prompts-item">
      <Markdown source={text} />
      { attributeRows.length > 0 && (
        <MiniTable rows={attributeRows} />
      )}
      { additionalAttributes.length > 0 && (
        <MiniTable
          rows={[
            [<strong>Variable</strong>, <strong>Value</strong>],
            ...additionalAttributeRows,
          ]}
        />
      )}
    </div>
  );
};

Prompt.propTypes = {
  text: PropTypes.string.isRequired,
  additionalAttributes: PropTypes.array,
  edges: PropTypes.shape({
    create: PropTypes.string,
  }),
  variable: PropTypes.string,
  layout: PropTypes.shape({
    layoutVariable: PropTypes.string,
  }),
  createEdge: PropTypes.string,
  edgeVariable: PropTypes.string,
};

Prompt.defaultProps = {
  additionalAttributes: [],
  edges: null,
  variable: null,
  layout: null,
  createEdge: null,
  edgeVariable: null,
};

export default Prompt;
