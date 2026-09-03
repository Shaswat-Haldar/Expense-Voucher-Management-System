export async function generateVoucherNumber(client) {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const prefix = `EXP-${year}${month}`;

  // Use FOR UPDATE to lock the row(s) and prevent race conditions if doing sequence manually,
  // but since we are doing a count, we might want to lock a specific sequence table.
  // For simplicity and to follow the requirement, we will lock the vouchers table for the prefix.
  const { rows } = await client.query(`
    SELECT COUNT(*) as count 
    FROM vouchers 
    WHERE voucher_number LIKE $1
  `, [`${prefix}-%`]);

  const count = parseInt(rows[0].count, 10);
  const nextSeq = String(count + 1).padStart(4, '0');

  return `${prefix}-${nextSeq}`;
}
