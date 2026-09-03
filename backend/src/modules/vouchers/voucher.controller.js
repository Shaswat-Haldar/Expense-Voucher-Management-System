import { getClient } from '../../config/db.js';
import { generateVoucherNumber } from '../../utils/voucherNumber.js';
import { getUploadPath, deleteFile } from '../../utils/fileHelpers.js';
import { createVoucherSchema, updateVoucherSchema, rejectVoucherSchema } from './voucher.validation.js';

export const createVoucher = async (req, res, next) => {
  const client = await getClient();
  try {
    const data = createVoucherSchema.parse(req.body);
    
    await client.query('BEGIN');
    const voucherNumber = await generateVoucherNumber(client);
    const voucherDate = data.voucher_date || new Date().toISOString().split('T')[0];

    const { rows } = await client.query(`
      INSERT INTO vouchers (
        voucher_number, voucher_date, expense_date, department,
        expense_title, expense_category, expense_description, amount,
        employee_id, employee_name
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      voucherNumber, voucherDate, data.expense_date, data.department,
      data.expense_title, data.expense_category, data.expense_description, data.amount,
      req.user.id, req.user.name
    ]);

    await client.query('COMMIT');
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: { message: 'Validation error', details: error.errors } });
    }
    next(error);
  } finally {
    client.release();
  }
};

export const listVouchers = async (req, res, next) => {
  const client = await getClient();
  try {
    const { 
      status, department, category, employee_name, voucher_number, 
      date_from, date_to, amount_min, amount_max, 
      sort_by = 'created_at', sort_dir = 'DESC', page = 1, limit = 20 
    } = req.query;

    const offset = (page - 1) * limit;
    let queryParams = [];
    let whereClauses = [];

    if (req.user.role === 'employee') {
      queryParams.push(req.user.id);
      whereClauses.push(`employee_id = $${queryParams.length}`);
    }

    if (status) { queryParams.push(status); whereClauses.push(`status = $${queryParams.length}`); }
    if (department) { queryParams.push(`%${department}%`); whereClauses.push(`department ILIKE $${queryParams.length}`); }
    if (category) { queryParams.push(category); whereClauses.push(`expense_category = $${queryParams.length}`); }
    if (employee_name) { queryParams.push(`%${employee_name}%`); whereClauses.push(`employee_name ILIKE $${queryParams.length}`); }
    if (voucher_number) { queryParams.push(`%${voucher_number}%`); whereClauses.push(`voucher_number ILIKE $${queryParams.length}`); }
    if (date_from) { queryParams.push(date_from); whereClauses.push(`expense_date >= $${queryParams.length}`); }
    if (date_to) { queryParams.push(date_to); whereClauses.push(`expense_date <= $${queryParams.length}`); }
    if (amount_min) { queryParams.push(amount_min); whereClauses.push(`amount >= $${queryParams.length}`); }
    if (amount_max) { queryParams.push(amount_max); whereClauses.push(`amount <= $${queryParams.length}`); }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    // Sort validation to prevent SQL injection
    const allowedSortColumns = ['created_at', 'expense_date', 'amount', 'status', 'voucher_number'];
    const sortColumn = allowedSortColumns.includes(sort_by) ? sort_by : 'created_at';
    const sortDirection = sort_dir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const sql = `
      SELECT * FROM vouchers
      ${whereSql}
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    const countSql = `SELECT COUNT(*) FROM vouchers ${whereSql}`;

    const { rows: data } = await client.query(sql, [...queryParams, limit, offset]);
    const { rows: countRows } = await client.query(countSql, queryParams);
    
    const total = parseInt(countRows[0].count, 10);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  } finally {
    client.release();
  }
};

export const getVoucher = async (req, res, next) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    const { rows } = await client.query('SELECT * FROM vouchers WHERE id = $1', [id]);
    const voucher = rows[0];

    if (!voucher) return res.status(404).json({ success: false, error: { message: 'Voucher not found' } });
    if (req.user.role === 'employee' && voucher.employee_id !== req.user.id) {
      return res.status(403).json({ success: false, error: { message: 'Forbidden' } });
    }

    res.status(200).json({ success: true, data: voucher });
  } catch (error) {
    next(error);
  } finally {
    client.release();
  }
};

export const updateVoucher = async (req, res, next) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    const data = updateVoucherSchema.parse(req.body);
    
    const { rows } = await client.query('SELECT * FROM vouchers WHERE id = $1', [id]);
    const voucher = rows[0];

    if (!voucher) return res.status(404).json({ success: false, error: { message: 'Voucher not found' } });
    if (voucher.employee_id !== req.user.id) return res.status(403).json({ success: false, error: { message: 'Forbidden' } });
    if (voucher.status !== 'draft') return res.status(422).json({ success: false, error: { message: 'Cannot edit voucher not in draft status' } });

    let updateClauses = [];
    let queryParams = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && key !== 'employee_id_field') {
        updateClauses.push(`${key} = $${idx}`);
        queryParams.push(value);
        idx++;
      }
    }

    if (updateClauses.length === 0) {
      return res.status(200).json({ success: true, data: voucher });
    }

    queryParams.push(new Date());
    updateClauses.push(`updated_at = $${idx}`);
    idx++;

    queryParams.push(id);
    const sql = `UPDATE vouchers SET ${updateClauses.join(', ')} WHERE id = $${idx} RETURNING *`;
    
    const { rows: updatedRows } = await client.query(sql, queryParams);
    res.status(200).json({ success: true, data: updatedRows[0] });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: { message: 'Validation error', details: error.errors } });
    }
    next(error);
  } finally {
    client.release();
  }
};

export const deleteVoucher = async (req, res, next) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    
    const { rows } = await client.query('SELECT * FROM vouchers WHERE id = $1', [id]);
    const voucher = rows[0];

    if (!voucher) return res.status(404).json({ success: false, error: { message: 'Voucher not found' } });
    if (voucher.employee_id !== req.user.id) return res.status(403).json({ success: false, error: { message: 'Forbidden' } });
    if (voucher.status !== 'draft') return res.status(422).json({ success: false, error: { message: 'Cannot delete voucher not in draft status' } });

    if (voucher.employee_sig_path) {
      deleteFile(voucher.employee_sig_path);
    }

    await client.query('DELETE FROM vouchers WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    next(error);
  } finally {
    client.release();
  }
};

export const uploadEmployeeSignature = async (req, res, next) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    
    const { rows } = await client.query('SELECT * FROM vouchers WHERE id = $1', [id]);
    const voucher = rows[0];

    if (!voucher) return res.status(404).json({ success: false, error: { message: 'Voucher not found' } });
    if (voucher.employee_id !== req.user.id) return res.status(403).json({ success: false, error: { message: 'Forbidden' } });
    
    if (!req.file) {
      return res.status(400).json({ success: false, error: { message: 'No file uploaded' } });
    }

    const filePath = getUploadPath(req.file.filename);

    const { rows: updatedRows } = await client.query(
      'UPDATE vouchers SET employee_sig_path = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      [filePath, new Date(), id]
    );

    res.status(200).json({ success: true, data: updatedRows[0] });
  } catch (error) {
    next(error);
  } finally {
    client.release();
  }
};

export const uploadDirectorSignature = async (req, res, next) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    
    const { rows } = await client.query('SELECT * FROM vouchers WHERE id = $1', [id]);
    const voucher = rows[0];

    if (!voucher) return res.status(404).json({ success: false, error: { message: 'Voucher not found' } });
    // Any director can upload signature
    
    if (!req.file) {
      return res.status(400).json({ success: false, error: { message: 'No file uploaded' } });
    }

    const filePath = getUploadPath(req.file.filename);

    const { rows: updatedRows } = await client.query(
      'UPDATE vouchers SET director_sig_path = $1, director_id = $2, updated_at = $3 WHERE id = $4 RETURNING *',
      [filePath, req.user.id, new Date(), id]
    );

    res.status(200).json({ success: true, data: updatedRows[0] });
  } catch (error) {
    next(error);
  } finally {
    client.release();
  }
};

export const submitVoucher = async (req, res, next) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    const { rows } = await client.query('SELECT * FROM vouchers WHERE id = $1', [id]);
    const voucher = rows[0];

    if (!voucher) return res.status(404).json({ success: false, error: { message: 'Voucher not found' } });
    if (voucher.employee_id !== req.user.id) return res.status(403).json({ success: false, error: { message: 'Forbidden' } });
    if (voucher.status !== 'draft') return res.status(422).json({ success: false, error: { message: 'Cannot submit voucher not in draft status' } });
    if (!voucher.employee_sig_path) return res.status(400).json({ success: false, error: { message: 'Signature required before submission' } });

    const { rows: updatedRows } = await client.query(
      "UPDATE vouchers SET status = 'pending_approval', submitted_at = $1, updated_at = $1 WHERE id = $2 RETURNING *",
      [new Date(), id]
    );
    res.status(200).json({ success: true, data: updatedRows[0] });
  } catch (error) {
    next(error);
  } finally {
    client.release();
  }
};

export const approveVoucher = async (req, res, next) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    const { rows } = await client.query('SELECT * FROM vouchers WHERE id = $1', [id]);
    const voucher = rows[0];

    if (!voucher) return res.status(404).json({ success: false, error: { message: 'Voucher not found' } });
    if (voucher.status !== 'pending_approval') return res.status(422).json({ success: false, error: { message: 'Cannot approve voucher not in pending_approval status' } });
    if (!voucher.director_sig_path) return res.status(400).json({ success: false, error: { message: 'Director signature required' } });

    const { rows: updatedRows } = await client.query(
      "UPDATE vouchers SET status = 'approved', approved_at = $1, director_id = $2, updated_at = $1 WHERE id = $3 RETURNING *",
      [new Date(), req.user.id, id]
    );
    res.status(200).json({ success: true, data: updatedRows[0] });
  } catch (error) {
    next(error);
  } finally {
    client.release();
  }
};

export const rejectVoucher = async (req, res, next) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    const data = rejectVoucherSchema.parse(req.body);

    const { rows } = await client.query('SELECT * FROM vouchers WHERE id = $1', [id]);
    const voucher = rows[0];

    if (!voucher) return res.status(404).json({ success: false, error: { message: 'Voucher not found' } });
    if (voucher.status !== 'pending_approval') return res.status(422).json({ success: false, error: { message: 'Cannot reject voucher not in pending_approval status' } });

    const { rows: updatedRows } = await client.query(
      "UPDATE vouchers SET status = 'rejected', rejected_at = $1, rejection_reason = $2, director_id = $3, updated_at = $1 WHERE id = $4 RETURNING *",
      [new Date(), data.rejection_reason, req.user.id, id]
    );
    res.status(200).json({ success: true, data: updatedRows[0] });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: { message: 'Validation error', details: error.errors } });
    }
    next(error);
  } finally {
    client.release();
  }
};
