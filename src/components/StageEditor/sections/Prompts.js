/* eslint-disable */

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { has } from 'lodash';
import { Section, Editor, Guidance } from '../../Guided';
import SortableItems from './SortableItems';
import Prompt from './Prompt';

const dummyItems = [{ text: 'test a' }, { text: 'test b' }, { text: 'test c' }];

const Prompts = ({ stage: { prompts }, show, onChange, dispatch, ...props }) => {
  const items = prompts || dummyItems;
  return (
    <Section className="stage-editor-section" {...props}>
      <Editor className="stage-editor-section__edit">
        <h2>Prompts</h2>
        <p>Name gen prompt specific</p>
        <SortableItems
          onChange={(items) => { onChange({ prompts: items }) }}
          component={Prompt}
          items={items}
        />
      </Editor>
      <Guidance className="stage-editor-section__guidance">
        This is guidance for prompts.
      </Guidance>
    </Section>
  );
}

const mapStateToProps = (state, props) => ({
  show: has(props, 'stage.nodeType'),
});

export { Prompts };

export default compose(
  connect(mapStateToProps),
)(Prompts);
