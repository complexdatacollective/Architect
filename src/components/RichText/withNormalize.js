/* eslint-disable no-param-reassign,no-restricted-syntax */
import { Transforms, Node, Element } from 'slate';
import { MODES } from './options';

const defaultOptions = {
  mode: MODES.full,
};

const withNormalize = (editor, userOptions) => {
  const { normalizeNode } = editor;
  const options = { ...defaultOptions, ...userOptions };

  editor.normalizeNode = ([node, path]) => {
    // Filter allowed Elements
    if (options.mode !== MODES.full) {
      if (Element.isElement(node) && node.type !== 'paragraph') {
        Transforms.setNodes(
          editor,
          { ...node, type: 'paragraph' },
          { at: path },
        );
      }
    }

    if (options.mode === MODES.single) {
      if (path.length === 0) { // for top level path only
        // If empty, insert a blank paragraph node
        if (editor.children.length < 1) {
          const defaultNode = { type: 'paragraph', children: [{ text: '' }] };
          Transforms.insertNodes(editor, defaultNode, { at: path.concat(0) });
        }

        // Force the first node to always be a paragraph and merge any
        // later nodes
        for (const [child, childPath] of Node.children(editor, path)) {
          if (Element.isElement(child) && childPath[0] === 0) {
            Transforms.setNodes(
              editor,
              { ...node, type: 'paragraph', break: false },
              { at: childPath },
            );
          } else if (Element.isElement(child)) {
            Transforms.mergeNodes(editor, { at: childPath });
          }
        }
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};

export default withNormalize;
