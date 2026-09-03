import React, { useEffect, useState } from 'react';
import VoucherForm from '../../components/VoucherForm';
import { useVouchers } from '../../hooks/useVouchers';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const EditVoucher = () => {
  const { id } = useParams();
  const { getById, update, uploadSig, submit, loading } = useVouchers();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);

  useEffect(() => {
    const fetchVoucher = async () => {
      const res = await getById(id);
      if (res.success) {
        if (res.data.status !== 'draft') {
          toast.error('Only draft vouchers can be edited');
          navigate('/employee/vouchers');
          return;
        }
        setVoucher(res.data);
      } else {
        navigate('/employee/vouchers');
      }
    };
    fetchVoucher();
  }, [id, getById, navigate]);

  const handleDraft = async (data) => {
    const res = await update(id, data);
    if (res.success) {
      toast.success('Draft updated successfully');
      navigate('/employee/vouchers');
    }
  };

  const handleFinal = async (data, signatureFile) => {
    // 1. Update draft
    const updateRes = await update(id, data);
    if (!updateRes.success) return;
    
    // 2. Upload signature if new file provided
    if (signatureFile) {
      const sigRes = await uploadSig(id, 'employee', signatureFile);
      if (!sigRes.success) return;
    }

    // 3. Submit
    const submitRes = await submit(id);
    if (submitRes.success) {
      toast.success('Voucher submitted for approval');
      navigate('/employee/vouchers');
    }
  };

  if (!voucher) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Edit Draft Voucher</h2>
      <VoucherForm 
        initialData={voucher}
        onSubmitDraft={handleDraft} 
        onSubmitFinal={handleFinal} 
        loading={loading} 
      />
    </div>
  );
};

export default EditVoucher;
