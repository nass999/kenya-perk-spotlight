
export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'No expiration';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
