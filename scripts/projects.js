/**
 * Sorts and enriches featured projects.
 * @param {Array} projects 
 * @returns {Array} Sorted & processed projects array
 */
export function processProjects(projects = []) {
  if (!Array.isArray(projects)) return [];

  // Pinned projects first, then by star count descending
  return [...projects].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (b.stars || 0) - (a.stars || 0);
  });
}
