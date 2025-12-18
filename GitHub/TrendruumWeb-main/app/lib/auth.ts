export const getToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  return token;
}; 