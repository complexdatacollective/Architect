import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import RadioGroup from '@codaco/ui/lib/components/Fields/RadioGroup';
import { Field as RichTextField } from '@codaco/ui/lib/components/Fields/RichText';
import { Section, Row } from '@components/EditorLayout';
import ValidatedField from '@components/Form/ValidatedField';
import { Image, Audio, Video } from '@components/Form/Fields';
import { getFieldId } from '@app/utils/issues';
import { typeOptions } from './options';
import withItemHandlers from './withItemHandlers';

const contentInputs = {
  text: RichTextField,
  image: Image,
  audio: Audio,
  video: Video,
};

const getInputProps = (type) => {
  const component = get(contentInputs, type, RichTextField);
  return {
    component,
  };
};

const ItemEditor = ({
  type,
  handleChangeType,
}) => (
  <Section>
    <Row>
      <h3 id={getFieldId('type')}>Type</h3>
      <ValidatedField
        name="type"
        component={RadioGroup}
        options={typeOptions}
        validation={{ required: true }}
        onChange={handleChangeType}
      />
    </Row>
    <Row disabled={!type}>
      <h3 id={getFieldId('content')}>Content</h3>
      <ValidatedField
        name="content"
        {...getInputProps(type)}
      />
    </Row>
  </Section>
);

ItemEditor.propTypes = {
  type: PropTypes.string,
  handleChangeType: PropTypes.func.isRequired,
};

ItemEditor.defaultProps = {
  type: null,
};

export { ItemEditor };

export default withItemHandlers(ItemEditor);
