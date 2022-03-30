/* eslint-disable react/jsx-props-no-spreading, react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '@codaco/ui/lib/components/Fields/Markdown';
import { get, isNull } from 'lodash';
import { renderValue } from '../helpers';
import MiniTable from '../MiniTable';
import Variable from '../Variable';
import EntityBadge from '../EntityBadge';

const directionLabel = (direction) => (
  direction === 'desc' ? 'descending' : 'ascending'
);

const SortOrder = ({ rules }) => {
  if (!rules) return null;

  const result = rules
    .map(({ property, direction }) => (
      <li key={property}>
        {(property === '*') ? '*' : <Variable id={property} />}
        {' '}
        <small>
          (
          {directionLabel(direction)}
          )
        </small>
      </li>
    ));
  return <ol className="protocol-summary-stage__prompts-sort">{result}</ol>;
};

SortOrder.propTypes = {
  rules: PropTypes.array.isRequired,
};

const attributes = [
  ['layout.layoutVariable', 'Layout variable', (id) => <Variable id={id} />],
  ['variable', 'Variable', (id) => <Variable id={id} />],
  ['edges.create', 'Creates edge', (type) => <EntityBadge entity="edge" type={type} tiny link />],
  ['createEdge', 'Creates edge', (type) => <EntityBadge entity="edge" type={type} tiny link />],
  ['edgeVariable', 'Edge Strength Variable', (id) => <Variable id={id} />],
  ['highlight.allowHighlighting', 'Allow highlighting', (allow) => renderValue(allow)],
  ['highlight.variable', 'Highlight variable', (id) => <Variable id={id} />],
  ['negativeLabel', 'Negative Option Label', (text) => text],
  ['sortOrder', 'Sort by property', (rules) => <SortOrder rules={rules} />],
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
    [label, renderer(value)],
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
      <Markdown label={text} />
      { attributeRows.length > 0 && (
        <MiniTable rotated rows={attributeRows} />
      )}
      { additionalAttributes.length > 0 && (
        <MiniTable
          rows={[
            ['Variable', 'Value'],
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
