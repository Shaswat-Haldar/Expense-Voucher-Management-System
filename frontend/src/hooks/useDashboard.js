import { useState, useEffect, useCallback } from 'react';
import { getDashboard } from '../api/dashboard';
import { toast } from 'sonner';

export const useDashboard = () => {
  const [data, setData] = useState({ stats: {}, recent: [] });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDashboard();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, refetch: fetchDashboard };
};
