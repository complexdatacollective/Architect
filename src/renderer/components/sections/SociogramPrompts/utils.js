/**
 * Compare selected edges to edge filters to determine if a warning should be shown
 * @param {Array} filters - edge filters
 * @param {Array} edges - selected edges
 * There are four main cases to consider:
 * 1. Selected edge is in the filters with rule EXISTS -- no warning
 * 2. Selected edge is not in the filters with rule EXISTS -- show a warning
 * 3. Selected edge is in the filters with rule DOES_NOT_EXIST -- show a warning
 * 4. Selected edge is not in the filters with rule DOES_NOT_EXIST -- no warning
 */

const getEdgeFilteringWarning = (filters, edges) => {
  const existFilters = filters.filter((rule) => rule.options.operator === 'EXISTS');
  const doesNotExistFilters = filters.filter((rule) => rule.options.operator === 'NOT_EXISTS');

  // if any edge should show a warning, return true
  return edges?.some((edge) => {
    const isEdgeInExistFilters = existFilters.some((rule) => rule.options.type === edge);
    const isEdgeInDoesNotExistFilters = doesNotExistFilters.some(
      (rule) => rule.options.type === edge,
    );

    // case 1
    if (isEdgeInExistFilters) {
      return false;
    }

    // case 2
    if (!isEdgeInExistFilters && existFilters.length > 0) {
      return true;
    }

    // case 3
    if (isEdgeInDoesNotExistFilters) {
      return true;
    }

    // No warning in other cases
    return false;
  }) ?? false;
};

export default getEdgeFilteringWarning;
