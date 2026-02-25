const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://arvmqponpilsctcclvci.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tVZTqDVIHT_4Xfd-OuTfkA_TyDhDJPT';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Script starting...");
supabase.from('profiles').select('id, name').limit(10).then(({data, error}) => {
    if (error) console.log("ERROR:", error.message);
    else console.log("PROFILES:", JSON.stringify(data));
}).catch(e => console.log("CATCH:", e.message));

setTimeout(() => { console.log("Timeout done"); }, 5000);
