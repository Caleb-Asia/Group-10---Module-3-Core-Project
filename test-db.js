require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  for (const port of [3306, 3307]) {
    for (const pw of ['newpassword', 'root', '']) {
      try {
        const conn = await mysql.createConnection({
          host: '127.0.0.1', port, user: 'root',
          password: pw, database: 'foodboxx'
        });
        console.log(`\n✓ SUCCESS on port ${port} with password: "${pw}"`);
        await conn.end();
        return;
      } catch (e) {
        console.log(`✗ port ${port} pw "${pw}": ${e.code || e.message}`);
      }
    }
  }
  console.log('\nNothing worked.');
})();
