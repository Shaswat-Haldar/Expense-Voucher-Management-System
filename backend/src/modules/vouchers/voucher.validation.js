import { z } from 'zod';

export const createVoucherSchema = z.object({
  department: z.string().min(1),
  expense_title: z.string().min(1),
  expense_date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  amount: z.number().positive(),
  expense_description: z.string().optional(),
  expense_category: z.string().default('General'),
  voucher_date: z.string().optional(),
  employee_id_field: z.string().optional(),
});

export const updateVoucherSchema = createVoucherSchema.partial();

export const rejectVoucherSchema = z.object({
  rejection_reason: z.string().min(10)
});
