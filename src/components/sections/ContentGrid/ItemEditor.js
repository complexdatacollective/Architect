import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { getFieldId } from '../../../utils/issues';
import RadioGroup from '../../../ui/components/Fields/RadioGroup';
import TextArea from '../../../ui/components/Fields/TextArea';
import ValidatedField from '../../Form/ValidatedField';
import { Image, Audio, Video } from '../../Form/Fields';
import Row from '../Row';
import Section from '../Section';
import { options } from './options';
import withItemHandlers from './withItemHandlers';

const contentInputs = {
  text: TextArea,
  image: Image,
  audio: Audio,
  video: Video,
};

const getInputComponent = type =>
  get(contentInputs, type, TextArea);

const ItemEditor = ({
  type,
}) => (
  <Section>
    <Row>
      <h3 id={getFieldId('type')}>Type</h3>
      <ValidatedField
        name="type"
        component={RadioGroup}
        options={options}
        validation={{ required: true }}
      />
    </Row>
    <Row disabled={!type}>
      <h3 id={getFieldId('content')}>Content</h3>
      <ValidatedField
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
