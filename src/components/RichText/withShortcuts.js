/* eslint-disable no-param-reassign */
import {
  Editor,
  Transforms,
  Range,
  Point,
  Element as SlateElement,
} from 'slate';

const SHORTCUTS = {
  '*': 'list_item',
  '-': 'list_item', // eslint-disable-line quote-props
  '+': 'list_item',
  '>': 'block_quote',
  '#': 'heading_one',
  '##': 'heading_two',
  '###': 'heading_three',
  '####': 'heading_four',
  '#####': 'heading_five',
};

const withShortcuts = (editor) => {
  const {
    deleteBackward,
    insertText,
  } = editor;

  editor.insertText = (text) => {
    const { selection } = editor;

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);
      const type = SHORTCUTS[beforeText];

      if (type) {
        Transforms.select(editor, range);
        Transforms.delete(editor);
        const newProperties = {
          type,
        };
        Transforms.setNodes(editor, newProperties, {
          match: (n) => Editor.isBlock(editor, n),
        });

        if (type === 'list_item') {
          const list = {
            type: 'ul_list',
            children: [],
          };
          Transforms.wrapNodes(editor, list, {
            match: (n) => (
              !Editor.isEditor(n)
              && SlateElement.isElement(n)
              && n.type === 'list_item'
            ),
          });
        }

        return;
      }
    }

    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          !Editor.isEditor(block)
          && SlateElement.isElement(block)
          && block.type !== 'paragraph'
          && Point.equals(selection.anchor, start)
        ) {
          const newProperties = {
            type: 'paragraph',
          };
          Transforms.setNodes(editor, newProperties);

          if (block.type === 'list_item') {
            Transforms.unwrapNodes(editor, {
              match: (n) => (
                !Editor.isEditor(n)
                && SlateElement.isElement(n)
                && n.type === 'ul_list'
              ),
              split: true,
            });
          }

          return;
        }
      }

      deleteBackward(...args);
    }
  };

  return editor;
};

export default withShortcuts;
