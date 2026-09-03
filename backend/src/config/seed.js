import bcrypt from 'bcryptjs';
import { getClient } from './db.js';

async function seed() {
  let client;
  try {
    client = await getClient();
    await client.query('BEGIN');
    
    const hash = async (pwd) => await bcrypt.hash(pwd, 10);
    
    const users = [
      { name: 'Demo Employee', email: 'employee@demo.com', password: await hash('Employee@123'), role: 'employee', empId: 'EMP-001' },
      { name: 'Demo Employee 2', email: 'employee2@demo.com', password: await hash('Employee@123'), role: 'employee', empId: 'EMP-002' },
      { name: 'Demo Director', email: 'director@demo.com', password: await hash('Director@123'), role: 'director', empId: null },
      { name: 'Demo Accounts', email: 'accounts@demo.com', password: await hash('Accounts@123'), role: 'accounts', empId: null },
    ];

    for (const user of users) {
      await client.query(`
        INSERT INTO users (name, email, password_hash, role, employee_id)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO NOTHING
      `, [user.name, user.email, user.password, user.role, user.empId]);
    }

    await client.query('COMMIT');
    console.log('Database seeded successfully.');
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error('Seed failed:', error.message || error);
    throw error;
  } finally {
    if (client) client.release();
  }
}

seed().then(() => process.exit(0)).catch((err) => {
  console.error('Failed to seed database. Please check your PostgreSQL connection.');
  process.exit(1);
});
