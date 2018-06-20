import React, { Fragment } from 'react';

export default {
  'guidance.editor.title': (
    <Fragment>
      <p>
        A good stage title should be descriptive, but not too long. It should help you to remember
        the purpose of this stage later.
      </p>
      <p>
        It might help to use a standard format for the names of your interview stages, such as
        <code>[TYPE]: [VARIABLE]</code>
      </p>
      <p>
        This text is displayed in the menu within Network Canvas, and on the timeline in Architect.
      </p>
    </Fragment>
  ),
  'guidance.editor.content_items': (
    <Fragment>
      <h3>Content Items help</h3>
      <p>
        Each information interface can display up to four &quot;content boxes&quot;. Each content box
        can display either: text, an image, a video, or some audio.
      </p>
      <p>
        You can use markdown style syntax to add formatting to your text. Supported formatting
        includes headings, bold, italic, and external links.
      </p>
      <p>
        If you are adding media, you can either select from existing assets, or drag new media into
        the content box you prefer.
      </p>
    </Fragment>
  ),
  'guidance.editor.node_type': (
    <Fragment>
      <h3>Node Type</h3>
      <p>
        Here, you can determine the type of node that this name generator will work with. Either
        choose from your existing node types, or create a new one.
      </p>
      <p>
        Think of the node&qt;s &quot;type&quot; as its most fundamental attribute. To ascertain what
        it may be, ask yourself what the node represents. For example, is it a person? A place?
      </p>
      <p>
        Node types are fundamental to the way that Network Canvas works. A node&qt;s type determines
        it&qt;s visual properties, as well as the variables available to assign on other interfaces.
      </p>
    </Fragment>
  ),
  'guidance.editor.form': (
    <Fragment>
      <h3>Form help</h3>
      <p>
        Now you have selected a node type, you must decide which form is shown to the participant when
        they create a new node.
      </p>
      <p>
        By default, Network Canvas will generate a node form for you, which will contain all of the
        variables you have assigned to this node type in the variable registry. If this is appropriate
        to your needs, you can skip this section.
      </p>
      <p>
        However, you should consider which variables must be collected here, and which are better
        collected later, using a specific interview stage. Be mindful that asking the participant to
        fill out a long form each time they create a new node will dramatically increase response
        burden.
      </p>
    </Fragment>
  ),
  'guidance.editor.sociogram_prompt.attributes': (
    <Fragment>
      <h3>Attributes</h3>
      <p>
        Demo item specific guidance.
      </p>
    </Fragment>
  ),
  'guidance.editor.sociogram_prompts': (
    <Fragment>
      <h3>Prompts help</h3>
      <p>
        Prompts allow you to specify one or more specific questions to post to the participant,
        in order to encourage the recall of nodes.
      </p>
      <p>
        Prompts should be carefully considered, and grounded in existing literature wherever
        possible. Think carefully about if you want to use one name generator with muiltiple
        prompts, or many name generators with a single prompt. Your choice depends on your specific
        research goals, and the needs of your research population.
      </p>
    </Fragment>
  ),
  'guidance.editor.name_generator_prompts': (
    <Fragment>
      <h3>Prompts help</h3>
      <p>
        Prompts allow you to specify one or more specific questions to post to the participant, in
        order to encourage the recall of nodes.
      </p>
      <p>
        Prompts should be carefully considered, and grounded in existing literature wherever possible.
        Think carefully about if you want to use one name generator with muiltiple prompts, or many
        name generators with a single prompt. Your choice depends on your specific research goals,
        and the needs of your research population.
      </p>
      <p>
        Each prompt can optionally assign a value to one or more node variables. You can use this
        functionality to keep track of where a node was created, or to assign an attribute to a node
        based on the prompt (such as indicating a node is a potential family member, if elicited in a
        prompt about family).
      </p>
    </Fragment>
  ),
  'guidance.interface.Information': (
    <Fragment>
      <h3>Information screen guidance</h3>
      <p>
        The Information Interface allows you to display text and rich media (including pictures,
        video and audio) to your participants. Use it to help explain interview tasks, or introduce
        concepts or ideas.
      </p>
    </Fragment>
  ),
  'guidance.interface.NameGenerator': (
    <Fragment>
      <h3>Name Generator guidance</h3>
      <p>
        The Name Generator interface is designed to allow your research participants
        to name alters for later analysis.
      </p>
      <p>
        After giving your stage a descriptive title, you should determine the type
        of node that you wish to elicit. Either choose from your existing node types,
        or create a new one.
      </p>
      <p>
        For further help with configuring the Name Generator interface, please refer
        to our <a href={null}>Online Documentation</a>.
      </p>
    </Fragment>
  ),
  'guidance.interface.Sociogram': (
    <Fragment>
      <h3>Sociogram guidance</h3>
      <p>
        TBD.
      </p>
    </Fragment>
  ),
};
