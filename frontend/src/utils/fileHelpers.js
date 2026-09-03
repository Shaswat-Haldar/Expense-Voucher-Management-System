export const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  // Clean up any leading slash or api prefix
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Backend host (without /api)
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
  const backendHost = apiBase.replace(/\/api\/?$/, '');
  
  return `${backendHost}${cleanPath}`;
};
