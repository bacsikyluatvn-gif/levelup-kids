const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/admin/Downloads/00. Tai Lieu/Project Antigravity/family-quest/.env' });

const supabaseUrl = process.env.SUPABASE_URL || 'https://arvmqponpilsctcclvci.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_tVZTqDVIHT_4Xfd-OuTfkA_TyDhDJPT';
const supabase = createClient(supabaseUrl, supabaseKey);

async function purgeAndFix() {
    console.log('--- PURGE BOTS AND FIX PARENTS ---');
    // 1. Delete all existing bots
    const { error: delErr } = await supabase.from('profiles').delete().eq('role', 'bot');
    if (delErr) {
        console.error('Failed to delete bots:', delErr);
    } else {
        console.log('Deleted all old bots successfully!');
    }

    // 2. Ensure existing Bố/Mẹ are definitively explicitly "parent"
    const { data: parents } = await supabase.from('profiles').select('*').ilike('name', '%Bố%');
    const { data: mothers } = await supabase.from('profiles').select('*').ilike('name', '%Mẹ%');
    const allToCheck = [...(parents || []), ...(mothers || [])];

    for (let p of allToCheck) {
        await supabase.from('profiles').update({ role: 'parent' }).eq('id', p.id);
    }
    console.log(`Ensured ${allToCheck.length} parents are marked with role 'parent'`);

    // Print all remaining users for verification
    const { data: all } = await supabase.from('profiles').select('name, role');
    console.log('VERIFICATION - Final profiles table:', all);
    console.log('--- DONE ---');
}

purgeAndFix();
