import { getClient } from '../../config/db.js';

export const getAllUsers = async ({ search, role, is_active, page = 1, limit = 10 }) => {
  const client = await getClient();
  try {
    const offset = (page - 1) * limit;
    let queryParams = [];
    let whereClauses = [];

    if (search) {
      queryParams.push(`%${search}%`);
      whereClauses.push(`(name ILIKE $${queryParams.length} OR email ILIKE $${queryParams.length})`);
    }

    if (role) {
      queryParams.push(role);
      whereClauses.push(`role = $${queryParams.length}`);
    }

    if (is_active !== undefined) {
      queryParams.push(is_active);
      whereClauses.push(`is_active = $${queryParams.length}`);
    }

    const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM users ${whereStr}`;
    const { rows: countRows } = await client.query(countQuery, queryParams);
    const total = parseInt(countRows[0].count, 10);

    const dataQuery = `
      SELECT id, name, email, role, employee_id, is_active, last_login_at, created_at
      FROM users
      ${whereStr}
      ORDER BY created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;
    const { rows: users } = await client.query(dataQuery, [...queryParams, limit, offset]);

    return {
      users,
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / limit)
    };
  } finally {
    client.release();
  }
};

export const getUserById = async (id) => {
  const client = await getClient();
  try {
    const { rows } = await client.query(`
      SELECT id, name, email, role, employee_id, is_active, last_login_at, created_at
      FROM users WHERE id = $1
    `, [id]);
    return rows[0] || null;
  } finally {
    client.release();
  }
};

export const createUser = async ({ name, email, password_hash, role, employee_id }) => {
  const client = await getClient();
  try {
    const { rows } = await client.query(`
      INSERT INTO users (name, email, password_hash, role, employee_id, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING id, name, email, role, employee_id, is_active, created_at
    `, [name, email, password_hash, role, employee_id]);
    return rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw { code: 'EMAIL_EXISTS' };
    }
    throw error;
  } finally {
    client.release();
  }
};

export const updateUser = async (id, { name, role, employee_id }) => {
  const client = await getClient();
  try {
    let updates = [];
    let queryParams = [];
    let idx = 1;

    if (name !== undefined) { updates.push(`name = $${idx++}`); queryParams.push(name); }
    if (role !== undefined) { updates.push(`role = $${idx++}`); queryParams.push(role); }
    if (employee_id !== undefined) { updates.push(`employee_id = $${idx++}`); queryParams.push(employee_id); }

    updates.push(`updated_at = now()`);

    if (updates.length === 1) return null; // Only updated_at

    queryParams.push(id);
    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${idx}
      RETURNING id, name, email, role, employee_id, is_active, last_login_at, created_at
    `;

    const { rows } = await client.query(query, queryParams);
    return rows[0];
  } finally {
    client.release();
  }
};

export const toggleUserActive = async (id, is_active) => {
  const client = await getClient();
  try {
    const { rows } = await client.query(`
      UPDATE users SET is_active = $1, updated_at = now()
      WHERE id = $2
      RETURNING id, name, email, role, employee_id, is_active, last_login_at, created_at
    `, [is_active, id]);
    return rows[0];
  } finally {
    client.release();
  }
};

export const updateLastLogin = async (id) => {
  const client = await getClient();
  try {
    await client.query(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [id]);
  } finally {
    client.release();
  }
};

export const getUserStats = async () => {
  const client = await getClient();
  try {
    const { rows } = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE role = 'employee') as employees,
        COUNT(*) FILTER (WHERE role = 'director') as directors,
        COUNT(*) FILTER (WHERE role = 'accounts') as accounts,
        COUNT(*) FILTER (WHERE is_active = true) as active,
        COUNT(*) FILTER (WHERE is_active = false) as inactive
      FROM users
    `);
    
    // Parse counts to integers
    const stats = rows[0];
    Object.keys(stats).forEach(key => stats[key] = parseInt(stats[key], 10));
    return stats;
  } finally {
    client.release();
  }
};
