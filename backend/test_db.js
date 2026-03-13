const { Client } = require('pg');
const connectionString = 'postgresql://postgres:UJjoXkrASgRTtQpArqYjWMVcHbIgiuwT@hopper.proxy.rlwy.net:25276/railway';

const client = new Client({
  connectionString: connectionString,
});

async function test() {
  await client.connect();
  console.log('Connected successfully!');
  const res = await client.query('SELECT NOW()');
  console.log(res.rows[0]);
  await client.end();
}

test().catch(err => {
  console.error('Connection error', err.stack);
  process.exit(1);
});
