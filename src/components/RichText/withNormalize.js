/* eslint-disable no-param-reassign,no-restricted-syntax */
import { Transforms, Node, Element } from 'slate';
import { MODES } from './options';

const defaultOptions = {
  mode: MODES.full,
};

/**
 * This extends the editor with a custom normalization
 * function to support 'single' line, and 'marks' only
 * modes.
 */
const withNormalize = (userOptions) => (editor) => {
  const { normalizeNode } = editor;
  const options = { ...defaultOptions, ...userOptions };

  editor.normalizeNode = ([node, path]) => {
    /**
     * 'single' mode
     *
     * We can the top-level nodes, for each
     * subsequent element after the first we
     * merge it with the previous, creating
     * a single node.
     */

    // for top level paths only
    if (options.mode === MODES.single && path.length === 0) {
      // If empty, insert a blank paragraph node
      if (editor.children.length < 1) {
        const defaultNode = { type: 'paragraph', children: [{ text: '' }] };
        Transforms.insertNodes(editor, defaultNode, { at: path.concat(0) });
      }

      // Force the first node to always be a paragraph and merge any
      // later nodes
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && childPath[0] === 0 && node.type !== 'paragraph') {
          Transforms.setNodes(
            editor,
            { type: 'paragraph', break: false },
            { at: childPath },
          );
        } else if (Element.isElement(child)) {
          Transforms.mergeNodes(editor, { at: childPath });
        }
      }
    }

    /**
     * 'marks' mode
     *
     * Ensures that all elements are paragraphs
     */
    // Filter allowed Elements
    if (options.mode === MODES.marks) {
      if (Element.isElement(node) && node.type !== 'paragraph') {
        Transforms.setNodes(
          editor,
          { type: 'paragraph' },
          { at: path },
        );
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};

export default withNormalize;
