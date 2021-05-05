import React from 'react';

// form: {title: "An example ego form", fields: Array(11)}
// id: "ego-form-1"
// interviewScript: "This is a **markdown field** that contains notes for the interviewer that are printed with the codebook, and can be reviewed during the interview.↵↵For now it will only support rich text, but not images or audio."
// introductionPanel: {title: "Introduction to the ego form", text: "# There are multiple ways to describe **you**.↵"}
// label: "Ego Form"
// type: "EgoForm"

const stageVariables = (codebook, stageId) => codebook
  .reduce(
    (memo, variable) => {
      if (!variable.stages.includes(stageId)) { return memo; }
      return [...memo, variable.name];
    },
    [],
  )
  .join(', ');

const Stage = ({
  index,
  type,
  label,
  id,
  configuration,
  codebook,
}) => (
  <div>
    <div>
      <h1>
        {index}
        {'. '}
        {label}
      </h1>

      <div>
        {type}
      </div>

      <div>
        <h2>Variables</h2>
        { stageVariables(codebook, id) }
      </div>
    </div>

    { configuration.interviewScript && (
      <div>
        <h2>Script</h2>
        {configuration.interviewScript}
      </div>
    )}

    { configuration.prompts && (
      <div>
        <h2>Prompts</h2>
        <ol>
          {configuration.prompts.map((prompt) => (
            <li>{prompt.text}</li>
          ))}
        </ol>
      </div>
    )}
  </div>
);

export default Stage;
