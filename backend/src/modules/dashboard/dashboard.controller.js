import { getClient } from '../../config/db.js';

export const getDashboard = async (req, res, next) => {
  let client;
  try {
    client = await getClient();
    const { role, id } = req.user;
    
    let stats = {};
    let recent = [];

    if (role === 'employee') {
      const { rows } = await client.query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'draft') as draft,
          COUNT(*) FILTER (WHERE status = 'pending_approval') as pending,
          COUNT(*) FILTER (WHERE status = 'approved') as approved,
          COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
          COALESCE(SUM(amount), 0) as total_amount
        FROM vouchers WHERE employee_id = $1
      `, [id]);
      
      stats = {
        total: parseInt(rows[0].total, 10),
        draft: parseInt(rows[0].draft, 10),
        pending: parseInt(rows[0].pending, 10),
        approved: parseInt(rows[0].approved, 10),
        rejected: parseInt(rows[0].rejected, 10),
        total_amount: parseFloat(rows[0].total_amount)
      };
    } else if (role === 'director') {
      const { rows } = await client.query(`
        SELECT
          COUNT(*) FILTER (WHERE status = 'pending_approval') as pending,
          COUNT(*) FILTER (WHERE status = 'approved' AND DATE(approved_at) = CURRENT_DATE) as approved_today,
          COUNT(*) FILTER (WHERE status = 'rejected' AND DATE(rejected_at) = CURRENT_DATE) as rejected_today,
          COALESCE(SUM(amount) FILTER (WHERE status = 'pending_approval'), 0) as total_pending_amount
        FROM vouchers
      `);

      stats = {
        pending: parseInt(rows[0].pending, 10),
        approved_today: parseInt(rows[0].approved_today, 10),
        rejected_today: parseInt(rows[0].rejected_today, 10),
        total_pending_amount: parseFloat(rows[0].total_pending_amount)
      };

      const { rows: recentRows } = await client.query(`
        SELECT * FROM vouchers 
        WHERE status != 'draft' 
        ORDER BY updated_at DESC LIMIT 10
      `);
      recent = recentRows;
    } else if (role === 'accounts') {
      const { rows } = await client.query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'pending_approval') as pending,
          COUNT(*) FILTER (WHERE status = 'approved') as approved,
          COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
          COALESCE(SUM(amount) FILTER (WHERE status = 'approved'), 0) as total_approved_amount
        FROM vouchers WHERE status != 'draft'
      `);

      stats = {
        total: parseInt(rows[0].total, 10),
        pending: parseInt(rows[0].pending, 10),
        approved: parseInt(rows[0].approved, 10),
        rejected: parseInt(rows[0].rejected, 10),
        total_approved_amount: parseFloat(rows[0].total_approved_amount)
      };

      const { rows: recentRows } = await client.query(`
        SELECT * FROM vouchers 
        WHERE status = 'approved' 
        ORDER BY updated_at DESC LIMIT 10
      `);
      recent = recentRows;
    }

    res.status(200).json({
      success: true,
      data: {
        stats,
        recent
      }
    });
  } catch (error) {
    next(error);
  } finally {
    if (client) client.release();
  }
};
