import { useState, useCallback } from 'react';
import * as api from '../api/vouchers';
import { toast } from 'sonner';

export const useVouchers = () => {
  const [loading, setLoading] = useState(false);
  
  const execute = async (apiFunc, ...args) => {
    setLoading(true);
    try {
      const response = await apiFunc(...args);
      return { success: true, data: response?.data || response };
    } catch (error) {
      const msg = error.response?.data?.error?.message || 'An error occurred';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const getList = useCallback((params) => execute(api.listVouchers, params), []);
  const getById = useCallback((id) => execute(api.getVoucher, id), []);
  const create = useCallback((data) => execute(api.createVoucher, data), []);
  const update = useCallback((id, data) => execute(api.updateVoucher, id, data), []);
  const remove = useCallback((id) => execute(api.deleteVoucher, id), []);
  const submit = useCallback((id) => execute(api.submitVoucher, id), []);
  const approve = useCallback((id) => execute(api.approveVoucher, id), []);
  const reject = useCallback((id, reason) => execute(api.rejectVoucher, id, reason), []);
  const uploadSig = useCallback((id, role, file) => execute(api.uploadSignature, id, role, file), []);

  return {
    loading,
    getList, getById, create, update, remove,
    submit, approve, reject, uploadSig
  };
};
