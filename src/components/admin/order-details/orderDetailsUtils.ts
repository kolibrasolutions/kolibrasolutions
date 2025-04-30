
/**
 * Format a date string for display
 */
export const formatOrderDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('pt-BR');
};
