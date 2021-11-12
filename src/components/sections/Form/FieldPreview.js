import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Markdown } from '@codaco/ui/lib/components/Fields';
import { getColorForType } from '@app/config/variables';
import { getVariablesForSubject } from '@selectors/codebook';
import withSubject from '@components/enhancers/withSubject';
import Badge from '@components/Badge';

const FieldPreview = ({
  variable,
  prompt,
  entity,
  type,
}) => {
  const subjectVariables = useSelector((state) => getVariablesForSubject(state, { entity, type }));
  const codebookVariable = get(subjectVariables, variable, {});

  return (
    <div className="field-preview">
      <Markdown
        label={prompt}
        className="field-preview__rich-content"
      />
      <div className="field-preview__badges">
        <Badge color={getColorForType(codebookVariable.type)}>
          <strong>{codebookVariable.type}</strong>
          {' variable using '}
          <strong>{codebookVariable.component}</strong>
          {' input control'}
        </Badge>
      </div>
    </div>
  );
};

FieldPreview.propTypes = {
  variable: PropTypes.string.isRequired,
  prompt: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired,
  type: PropTypes.string,
};

FieldPreview.defaultProps = {
  // type can be null because entity can be 'ego' which has no types
  type: null,
};

export default withSubject(FieldPreview);
