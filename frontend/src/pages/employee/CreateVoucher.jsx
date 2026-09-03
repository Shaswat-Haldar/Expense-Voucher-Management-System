import React from 'react';
import VoucherForm from '../../components/VoucherForm';
import { useVouchers } from '../../hooks/useVouchers';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CreateVoucher = () => {
  const { create, uploadSig, submit, loading } = useVouchers();
  const navigate = useNavigate();

  const handleDraft = async (data) => {
    const res = await create(data);
    if (res.success) {
      toast.success('Draft saved successfully');
      navigate('/employee/vouchers');
    }
  };

  const handleFinal = async (data, signatureFile) => {
    // 1. Create draft
    const createRes = await create(data);
    if (!createRes.success) return;
    
    const voucherId = createRes.data.id;

    // 2. Upload signature
    const sigRes = await uploadSig(voucherId, 'employee', signatureFile);
    if (!sigRes.success) return;

    // 3. Submit
    const submitRes = await submit(voucherId);
    if (submitRes.success) {
      toast.success('Voucher submitted for approval');
      navigate('/employee/vouchers');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Create Voucher</h2>
      <VoucherForm 
        onSubmitDraft={handleDraft} 
        onSubmitFinal={handleFinal} 
        loading={loading} 
      />
    </div>
  );
};

export default CreateVoucher;
