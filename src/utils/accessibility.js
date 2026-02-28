export const generateId = (prefix) => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getAriaLabel = (t, key, context = {}) => {
  const label = t(key);
  
  // Add context-specific information if needed
  if (context.required) {
    return `${label} (required)`;
  }
  
  if (context.optional) {
    return `${label} (optional)`;
  }
  
  return label;
};

export const getAriaDescribedBy = (descriptionId, helperId) => {
  const ids = [];
  if (descriptionId) ids.push(descriptionId);
  if (helperId) ids.push(helperId);
  return ids.length > 0 ? ids.join(' ') : undefined;
};
