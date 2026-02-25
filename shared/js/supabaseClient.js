// Cấu hình Supabase Client
const SUPABASE_URL = 'https://arvmqponpilsctcclvci.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tVZTqDVIHT_4Xfd-OuTfkA_TyDhDJPT';

// Tải thư viện Supabase JS tự động nếu chưa có
function loadSupabaseAndInit(callback) {
    if (window.supabase) {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        if (callback) callback();
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        if (callback) callback();
    };
    document.head.appendChild(script);
}

window.loadSupabaseAndInit = loadSupabaseAndInit;
