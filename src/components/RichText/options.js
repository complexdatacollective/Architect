export const BLOCKS = {
  quote: 'block_quote',
  headings: [
    'heading_one',
    'heading_two',
    'heading_three',
    'heading_four',
    'heading_five',
  ],
  lists: ['ul_list', 'ol_list'],
};

export const MARKS = {
  bold: 'bold',
  italic: 'italic',
};

export const MODES = {
  full: 'full',
  marks: 'marks',
  single: 'single',
};

export const TOOLBAR_MODES = {
  full: [...Object.keys(BLOCKS), ...Object.keys(MARKS)],
  marks: Object.keys(MARKS),
  single: Object.keys(MARKS),
};
