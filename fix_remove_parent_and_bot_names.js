const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://arvmqponpilsctcclvci.supabase.co';
const supabaseKey = 'sb_publishable_tVZTqDVIHT_4Xfd-OuTfkA_TyDhDJPT';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('--- KHỞI ĐỘNG XÓA BỐ/MẸ KHỎI ROLE CHILD & RENAME BOT ---');

  // 1. Rename existing bots to remove "(Bot)" suffix in the DB directly
  const { data: bots } = await supabase.from('profiles').select('*').eq('role', 'bot');
  if (bots && bots.length > 0) {
      console.log(`Đang dọn dẹp tên cho ${bots.length} con Bot...`);
      for (let b of bots) {
          if (b.name.includes('(Bot)')) {
              await supabase.from('profiles').update({ name: b.name.replace(' (Bot)', '').trim() }).eq('id', b.id);
          }
      }
      console.log('=> Đã gỡ chữ (Bot) thành công trong database!');
  }
  
  // 2. Clear any Parent mislabeled as "child" or duplicate parents
  const { data: parents } = await supabase.from('profiles').select('*').ilike('name', '%Bố%');
  const { data: mothers } = await supabase.from('profiles').select('*').ilike('name', '%Mẹ%');
  
  if (parents || mothers) {
      const allToCheck = [...(parents||[]), ...(mothers||[])];
      for (let p of allToCheck) {
          await supabase.from('profiles').update({ role: 'parent' }).eq('id', p.id);
      }
      console.log('=> Đã ép role="parent" cho toàn bộ tài khoản có chữ Bố/Mẹ để 100% tàng hình khỏi BXH');
  }

  console.log('--- HOÀN TẤT ---');
}

run();
