import { useState, useCallback, useMemo } from 'react';

const useTagList = (
  TAGS,
) => {
  const [selectedTags, setSelectedTags] = useState([]);

  const handleAddTag = useCallback((newTag) => {
    setSelectedTags((tags) => [...tags, newTag]);
  }, [setSelectedTags]);

  const handleRemoveTag = useCallback((existingTag) => {
    setSelectedTags(
      (tags) => tags.filter(
        (tag) => tag !== existingTag,
      ),
    );
  }, [setSelectedTags]);

  const tags = useMemo(
    () => Object.values(TAGS).map((value) => ({
      value,
      selected: selectedTags.includes(value),
    })).sort((a, b) => {
      if (a.selected && b.selected) { return 0; }
      if (a.selected && !b.selected) { return -1; }
      return 1;
    }),
    [selectedTags],
  );

  return [tags, selectedTags, handleAddTag, handleRemoveTag];
};

export default useTagList;
