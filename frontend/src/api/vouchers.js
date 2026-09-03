import api from './axios';

export const listVouchers = async (params = {}) => {
  const response = await api.get('/vouchers', { params });
  return response.data;
};

export const getVoucher = async (id) => {
  const response = await api.get(`/vouchers/${id}`);
  return response.data;
};

export const createVoucher = async (data) => {
  const response = await api.post('/vouchers', data);
  return response.data;
};

export const updateVoucher = async (id, data) => {
  const response = await api.patch(`/vouchers/${id}`, data);
  return response.data;
};

export const deleteVoucher = async (id) => {
  const response = await api.delete(`/vouchers/${id}`);
  return response.data;
};

export const submitVoucher = async (id) => {
  const response = await api.post(`/vouchers/${id}/submit`);
  return response.data;
};

export const approveVoucher = async (id) => {
  const response = await api.post(`/vouchers/${id}/approve`);
  return response.data;
};

export const rejectVoucher = async (id, reason) => {
  const response = await api.post(`/vouchers/${id}/reject`, { rejection_reason: reason });
  return response.data;
};

export const uploadSignature = async (id, role, file) => {
  const formData = new FormData();
  formData.append('signature', file);
  const response = await api.post(`/vouchers/${id}/signature/${role}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
