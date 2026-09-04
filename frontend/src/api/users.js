import api from './axios'; // Match existing pattern from vouchers.js

export const getUsers = async (params) => {
  const response = await api.get('/users', { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (data) => {
  const response = await api.post('/users', data);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.patch(`/users/${id}`, data);
  return response.data;
};

export const toggleUserActive = async (id, is_active) => {
  const response = await api.patch(`/users/${id}/toggle-active`, { is_active });
  return response.data;
};

export const getUserStats = async () => {
  const response = await api.get('/users/stats');
  return response.data;
};
