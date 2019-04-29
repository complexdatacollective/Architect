import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { getFieldId } from '../../../utils/issues';
import RadioGroup from '../../../ui/components/Fields/RadioGroup';
import ValidatedField from '../../Form/ValidatedField';
import { Markdown, Image, Audio, Video } from '../../Form/Fields';
import Row from '../Row';
import Section from '../Section';
import { options } from './options';
import withItemHandlers from './withItemHandlers';

const contentInputs = {
  text: Markdown,
  image: Image,
  audio: Audio,
  video: Video,
};

const getInputComponent = type =>
  get(contentInputs, type, Markdown);

const ItemEditor = ({
  type,
}) => (
  <Section>
    <Row>
      <h3 id={getFieldId('type')}>Type</h3>
      <ValidatedField
        label="Type"
        name="type"
        component={RadioGroup}
        options={options}
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <h3 id={getFieldId('content')}>Content</h3>
      <ValidatedField
        label="Content"
        name="content"
        component={getInputComponent(type)}
        validation={{ required: true }}
      />
    </Row>
  </Section>
);

ItemEditor.propTypes = {
  type: PropTypes.string,
};

ItemEditor.defaultProps = {
  type: null,
};

export { ItemEditor };

export default withItemHandlers(ItemEditor);
