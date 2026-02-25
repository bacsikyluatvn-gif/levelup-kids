const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://arvmqponpilsctcclvci.supabase.co';
const supabaseKey = 'sb_publishable_tVZTqDVIHT_4Xfd-OuTfkA_TyDhDJPT';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('--- REPAIR BROKEN QUEST ARRAYS ---');
  // First, we just fetch all quests
  const { data: quests } = await supabase.from('quests').select('id, completed_by');
  if (quests) {
      for (const q of quests) {
         if (q.completed_by && q.completed_by.length > 0) {
             let broken = false;
             for (const cb of q.completed_by) {
                 if (cb.length < 30) broken = true; // UUIDs are 36 chars, Name is normally shorter, like 'Khôi'
             }
             if (broken) {
                 await supabase.from('quests').update({ completed_by: [] }).eq('id', q.id);
                 console.log('Fixed quest', q.id);
             }
         }
      }
  }
  console.log('--- DONE ---');
}

run();
