const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: Please configure DATABASE_URL (PostgreSQL connection string) in .env.local');
  process.exit(1);
}

const sqlPath = path.join(__dirname, '../supabase/migrations/20260714120000_init_production_v1_revised.sql');

async function main() {
  console.log('Reading migration file...');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Connecting to database...');
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false } // Required for Supabase external connections
  });

  try {
    await client.connect();
    console.log('Connected successfully. Running migration SQL...');
    
    // Execute the complete script
    await client.query(sql);
    
    console.log('Migration executed successfully! All tables, triggers, and RPCs created.');
  } catch (err) {
    console.error('Migration failed with error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
