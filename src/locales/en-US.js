import React, { Fragment } from 'react';

export default {
  'guidance.editor.name': (
    <Fragment>
      <h3>Naming Your Stage</h3>
      <p>
        A good stage name should be descriptive, but not too long. It should help you to remember
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
  'guidance.editor.title': (
    <Fragment>
      <p>
        This text is displayed on the information screen as large centered text.
      </p>
    </Fragment>
  ),
  'guidance.editor.content_items': (
    <Fragment>
      <h3>About Content Boxes</h3>
      <p>
        Each information interface can display up to four
        &quot;content boxes&quot;. Each content box can display
        either: text, an image, a video, or some audio.
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
        Think of the node&apos;s &quot;type&quot; as its most fundamental attribute. To ascertain
        what it may be, ask yourself what the node represents. For example, is it a person? A place?
      </p>
      <p>
        Node types are fundamental to the way that Network Canvas works. A node&apos;s type
        determines it&apos;s visual properties, as well as the variables available to assign on
        other interfaces.
      </p>
    </Fragment>
  ),
  'guidance.editor.form': (
    <Fragment>
      <h3>Choosing a Form</h3>
      <p>
        Now you have selected a node type, you must decide which form is shown to the participant
        when they create a new node.
      </p>
      <p>
        By default, Network Canvas will generate a node form for you, which will contain all of the
        variables you have assigned to this node type in the variable registry. If this is
        appropriate to your needs, you can skip this section.
      </p>
      <p>
        However, you should consider which variables must be collected here, and which are better
        collected later, using a specific interview stage. Be mindful that asking the participant to
        fill out a long form each time they create a new node will dramatically increase response
        burden.
      </p>
    </Fragment>
  ),
  'guidance.editor.sociogram_prompt.nodes': (
    <Fragment>
      <h3>Prompt Node Type</h3>
      <p>guidance.editor.sociogram_prompt.nodes</p>
    </Fragment>
  ),
  'guidance.editor.sociogram_prompt.text': (
    <Fragment>
      <h3>Sociogram Prompt</h3>
      <p>guidance.editor.sociogram_prompt.text</p>
    </Fragment>
  ),
  'guidance.editor.sociogram_prompt.layout': (
    <Fragment>
      <h3>Layout Settings</h3>
      <p>guidance.editor.sociogram_prompt.layout</p>
    </Fragment>
  ),
  'guidance.editor.sociogram_prompt.background': (
    <Fragment>
      <h3>Prompt Background</h3>
      <p>guidance.editor.sociogram_prompt.background</p>
    </Fragment>
  ),
  'guidance.editor.sociogram_prompt.edges': (
    <Fragment>
      <h3>Showing and Creating Edges</h3>
      <p>guidance.editor.sociogram_prompt.edges</p>
    </Fragment>
  ),
  'guidance.editor.sociogram_prompt.sortOrder': (
    <Fragment>
      <h3>Sort Order</h3>
      <p>
        By default (with no ordering rules), Nodes will be unsorted. This means that they will be
        displayed in the order that they were created.
      </p>
      <p>
        The special <em>*</em> sort property also sorts by the order the nodes were created, but
        additionally allows you to display nodes in reverse using the <em>descending</em> option.
      </p>
    </Fragment>
  ),
  'guidance.editor.sociogram_prompt.attributes': (
    <Fragment>
      <h3>Attributes Highlighting on the Sociogram</h3>
      <p>
        guidance.editor.sociogram_prompt.attributes
      </p>
    </Fragment>
  ),
  'guidance.editor.sociogram_prompts': (
    <Fragment>
      <h3>Sociogram Prompts</h3>
      <p>
        Prompts allow you to specify one or more specific questions to post to the participant,
        in order to describe the task you want them to complete.
      </p>
      <p>
        Prompts should be carefully considered, and grounded in existing literature wherever
        possible.
      </p>
    </Fragment>
  ),
  'guidance.editor.name_generator_prompts': (
    <Fragment>
      <h3>Name Generator Prompts</h3>
      <p>
        Prompts allow you to specify one or more specific questions to post to the participant, in
        order to encourage the recall of nodes.
      </p>
      <p>
        Prompts should be carefully considered, and grounded in existing literature wherever
        possible.  Think carefully about if you want to use one name generator with muiltiple
        prompts, or many name generators with a single prompt. Your choice depends on your specific
        research goals, and the needs of your research population.
      </p>
      <p>
        Each prompt can optionally assign a value to one or more node variables. You can use this
        functionality to keep track of where a node was created, or to assign an attribute to a node
        based on the prompt (such as indicating a node is a potential family member, if elicited in
        a prompt about family).
      </p>
    </Fragment>
  ),
  'guidance.editor.node_panels': (
    <Fragment>
      <h3>Configuring Panels</h3>
      <p>
        The Name Generator interfaces allows you to configure up to two &quot;panels&quot;. Panels
        let you display lists of nodes to the participant, that may speed up the task of creating
        alters. For example, a panel could be used to show alters that the user has mentioned on a
        previous name generator, or even a previous interview.
      </p>
      <p>
        Data for panels can come from two sources:
      </p>
      <ul>
        <li>The current network for the interview session. This means any nodes that have already
          been created within this interview session.</li>
        <li>An external data source, embedded within your protocol file.</li>
      </ul>
      <p>
        Once the data source has been selected, you can optionally further filter the nodes that are
        displayed in a panel, using the network query builder syntax.
      </p>
    </Fragment>
  ),
  'guidance.interface.Information': (
    <Fragment>
      <h3>The Information Screen Interface</h3>
      <p>
        The Information Interface allows you to display text and rich media (including pictures,
        video and audio) to your participants. Use it to help explain interview tasks, or introduce
        concepts or ideas.
      </p>
    </Fragment>
  ),
  'guidance.interface.NameGenerator': (
    <Fragment>
      <h3>The Name Generator Interface</h3>
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
      <h3>The Sociogram Interface</h3>
      <p>
        The Sociogram interface is designed to do three things:
      </p>
      <ul>
        <li>
          Allow your research participants arrange the nodes they have created spatially.
        </li>
        <li>
          Provide a visual method for creating edges between nodes.
        </li>
        <li>
          Allow the toggling of binary attribute variables on nodes.
        </li>
      </ul>
      <p>
        For further help with configuring the Sociogram interface, please refer
        to our <a href={null}>Online Documentation</a>.
      </p>
    </Fragment>
  ),
  'guidance.form.title': (
    <Fragment>
      <h3>Form Title</h3>
      <p>
        A good form title should be descriptive, but not too long. It should help you to remember
        the purpose of this form later.
      </p>
      <p>
        It might help to use a standard format for the names of your forms, such as
        <code>[TYPE]: [VARIABLE]</code>
      </p>
    </Fragment>
  ),
  'guidance.form.type': (
    <Fragment>
      <h3>Form Node Type</h3>
      <p>
        Here, you can determine the type of node that this form will work with.
      </p>
    </Fragment>
  ),
  'guidance.form.continue': (
    <Fragment>
      <h3>Add Another</h3>
      <p>
        When this option is enabled, your form will allow the user to create muiltiple nodes in
        quick succession.
      </p>
    </Fragment>
  ),
  'guidance.form.variables': (
    <Fragment>
      <h3>Form Variables and Input Types</h3>
      <p>
        guidance.form.variables
      </p>
    </Fragment>
  ),
  'guidance.registry.type.label': (
    <Fragment>
      <h3>Label</h3>
      <p>
        Use the label field to give your node or edge type a name.
      </p>
    </Fragment>
  ),
  'guidance.registry.type.color': (
    <Fragment>
      <h3>Color</h3>
      <p>
        For <strong>nodes</strong> this will change the color that nodes appear for all
        interfaces.
      </p>
      <p>
        For <strong>edges</strong> this will change the color of the edge (line)
        representations, for interfaces such as the Sociogram.
      </p>
    </Fragment>
  ),
  'guidance.registry.type.icon': (
    <Fragment>
      <h3>Icon</h3>
      <p>
        When an item can be added through a form, this will change the icon for the
        &quot;new item&quot; button.
      </p>
    </Fragment>
  ),
  'guidance.registry.type.displayVariable': (
    <Fragment>
      <h3>Display Variable</h3>
      <p>
        This is the default &quot;label&quot; to be used to represent this node/edge, when
        one isn&apos;t specified elsewhere.
      </p>
    </Fragment>
  ),
  'guidance.registry.type.variables': (
    <Fragment>
      <h3>Variables</h3>
      <p>
        Use this section to add variables to this node or edge. Once you have defined a
        variable here, you can use it when configuring forms, prompts, or other
        interfaces.
      </p>
    </Fragment>
  ),
  'guidance.registry.type.variable': (
    <Fragment>
      <h3>Variable</h3>
      <p>
        For each variable you create, you must supply some basic information.
      </p>
      <h4>Name</h4>
      <p>
        Name your variable meaningfully, and in a way you will remember and recognise.
        Variable names are used when exporting interview data, so it is a good idea to
        create a consistent pattern or system for your naming.
      </p>
      <h4>Description</h4>
      <p>
        Use the description field to add any additional information you may need to help you
        recognise this variable later. You may wish to use this field to include notes about
        the purpose of the variable, its origin in theoretical literature, or other information
        or relevance.
      </p>
      <h4>Type</h4>
      <p>
        The variable type determines how and where you can use it within your interview, as
        well as the characteristics of the data it will collect. Because of this, you should
        be certain that the variable type you choose here is correct. It is not easily possible
        to change the type of a variable after it has been created.
      </p>
      <ul>
        <li><strong>Text</strong> - Used for storing text in a variable.</li>
        <li><strong>Number</strong> - Used for storing numerical values.</li>
        <li><strong>DateTime</strong> - Used for storing date or time data.</li>
        <li><strong>Boolean</strong> - Used for true or false (dichotomous) values.</li>
        <li><strong>Ordinal</strong> - An ordered categorical list of options.</li>
        <li><strong>Categorical</strong> - An unordered list of options</li>
        <li><strong>Layout</strong> - A special variable used to store sociogram layout data.</li>
        <li><strong>Location</strong> - Used for storing geospatial (Lat/Long) data.</li>
      </ul>
      <h4>Validation</h4>
      <p>
        The validation section allows you to define constraints on your variable that must be
        fulfilled. These constraints will depend on the type of variable you are editing. For
        example, a categorical variable will let you limit the minimum and maximim number of
        options that must be selected, whereas a text variable will let you set the minimum and
        maximum length.
      </p>
    </Fragment>
  ),
  'guidance.registry.nodes': (
    <Fragment>
      <h3>Node Types</h3>
      <p>
        Use this section to describe the types of node that you will collect in your interview.
      </p>
      <p>
        For example, if you are interested in capturing a network of people, you might want to
        start by creating a node type called &quot;Person&quot;.
      </p>
    </Fragment>
  ),
  'guidance.registry.edges': (
    <Fragment>
      <h3>Edge Types</h3>
      <p>
        Use this section to describe the types of edge that you will collect in your interview.
      </p>
      <p>
        For example, if you are interested in the social relationships between people, you might
        want to start by creating an edge type called &quot;Friend&quot;.
      </p>
    </Fragment>
  ),
  'guidance.skipLogicEditor': (
    <Fragment>
      <h3>Skip Logic</h3>
      <p>
        Skip logic tells Network Canvas when to skip past a stage. Using it, you can create
        different pathways through your interview.
      </p>
    </Fragment>
  ),
};
