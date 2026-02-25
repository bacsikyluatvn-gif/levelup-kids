const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/admin/Downloads/00. Tai Lieu/Project Antigravity/family-quest/.env' });

const supabaseUrl = process.env.SUPABASE_URL || 'https://arvmqponpilsctcclvci.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_tVZTqDVIHT_4Xfd-OuTfkA_TyDhDJPT';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: bots } = await supabase.from('profiles').select('name, role');
  console.log("All profiles:");
  console.log(bots);
}
run();
