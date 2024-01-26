const formatQuery = (filters: string): string => {
  return (filters || '').replace(/\s+/g, '%2C');
};

export default formatQuery;
