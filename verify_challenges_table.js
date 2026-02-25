
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://arvmqponpilsctcclvci.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tVZTqDVIHT_4Xfd-OuTfkA_TyDhDJPT';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verify() {
    console.log('--- Kiểm tra bảng challenges ---');

    // Thử truy vấn bảng challenges
    const { data, error } = await supabase.from('challenges').select('*').limit(1);

    if (error) {
        console.error('Lỗi khi truy cập bảng challenges:', error.message);
        if (error.code === '42P01') {
            console.log('HÀNH ĐỘNG: Bảng challenges CHƯA TỒN TẠI trong cơ sở dữ liệu.');
        } else if (error.status === 404) {
            console.log('HÀNH ĐỘNG: Supabase trả về 404 - Kiểm tra lại tên bảng hoặc RLS.');
        }
    } else {
        console.log('Thành công: Bảng challenges đã tồn tại.');
        console.log('Dữ liệu mẫu:', data);
    }
}

verify();
