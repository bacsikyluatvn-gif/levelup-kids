-- ==========================================
-- LEVELUP KIDS - SUPABASE SCHEMA INITIALIZATION
-- ==========================================

-- 1. Enable UUID Extension (Nếu chưa bật)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLES
-- ==========================================

-- Bảng 1: Thông tin Gia đình (families)
CREATE TABLE IF NOT EXISTS public.families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Liên kết với Auth Auth
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 2: Hồ sơ người dùng (profiles)
-- Thay thế cho data.leaderboard & data.user gốc
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'child', -- 'parent' hoặc 'child'
    avatar VARCHAR(255),
    pin_code VARCHAR(10), -- Mã PIN (thường dùng cho Parent)
    level INTEGER DEFAULT 1,
    gold INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    weekly_xp INTEGER DEFAULT 0,
    water INTEGER DEFAULT 0,
    stickers INTEGER DEFAULT 0,
    total_stickers INTEGER DEFAULT 0,
    weekly_streak INTEGER DEFAULT 0,
    action_streak INTEGER DEFAULT 0,
    completion_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 3: Nhiệm vụ (quests)
CREATE TABLE IF NOT EXISTS public.quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'Học tập',
    reward INTEGER DEFAULT 10,
    xp INTEGER DEFAULT 5,
    water INTEGER DEFAULT 0,
    sticker INTEGER DEFAULT 0,
    icon VARCHAR(50) DEFAULT 'star',
    color VARCHAR(50) DEFAULT 'blue',
    type VARCHAR(50) DEFAULT 'mandatory', -- 'mandatory' (bắt buộc), 'bonus' (thưởng)
    completed_by UUID[], -- Mảng các profile_id đã hoàn thành
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 4: Yêu cầu / Lịch sử phần thưởng (requests)
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'delivered', 'rejected'
    type VARCHAR(50) DEFAULT 'task', -- 'task' (Xác nhận NV), 'shop' (Mua đồ), 'perk' (Đổi đặc quyền)
    task_id UUID REFERENCES public.quests(id) ON DELETE SET NULL, -- Nullable (nếu là mua đồ)
    reward_gold INTEGER DEFAULT 0,
    reward_xp INTEGER DEFAULT 0,
    reward_water INTEGER DEFAULT 0,
    reward_sticker INTEGER DEFAULT 0,
    price_gold INTEGER DEFAULT 0, -- Giá vàng (nếu là mua đồ shop)
    price_sticker INTEGER DEFAULT 0, -- Giá sticker (nếu mua perk)
    is_sticker BOOLEAN DEFAULT false,
    rewards_granted BOOLEAN DEFAULT false, -- Đã cộng thưởng trực tiếp cho bé chưa (Trust first)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 5: Cửa hàng phần thưởng & Đặc quyền (shop_items)
CREATE TABLE IF NOT EXISTS public.shop_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50), 
    price INTEGER DEFAULT 100,
    sticker_price INTEGER DEFAULT 0,
    item_type VARCHAR(50) DEFAULT 'premium', -- 'premium' (Mua bằng vàng), 'perk' (Mua bằng sticker)
    image TEXT,
    emoji VARCHAR(10),
    color VARCHAR(50) DEFAULT 'orange',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 6: Thách đấu (challenges)
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    challenger_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    opponent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_type VARCHAR(255) NOT NULL, -- e.g., 'wake_up', 'no_grumpy'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'completed'
    challenger_confirmed BOOLEAN DEFAULT FALSE,
    opponent_confirmed BOOLEAN DEFAULT FALSE,
    winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- NULL nếu hòa hoặc cùng thất bại
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- Kích hoạt RLS cho tất cả các bảng
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Policy (Quy tắc chung): Gia đình nào chỉ xem và sửa dữ liệu của gia đình đó.
-- Chú ý: Vì có giao diện Trẻ em (không Auth), chúng ta tạm thời cho phép READ/WRITE dựa trên anon route của Frontend (thâm qua LocalStorage FamilyID).
-- Để bảo mật tuyệt đối, ta có thể yêu cầu Auth Token, nhưng để đáp ứng Visual Login cho Trẻ, ta sẽ sử dụng RLS mở cấp User Level thông qua Client Policy. 
-- (Trong phiên bản thực tế, RLS nên được thắt chặt qua JWT claims).
-- Để dễ triển khai nhanh nhất qua MCP, ta sẽ tạo Policy Public tạm thời (Phù hợp giai đoạn Beta).

CREATE POLICY "Allow anon read access" ON public.families FOR SELECT USING (true);
CREATE POLICY "Allow anon insert access" ON public.families FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anon read access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow anon insert access" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update access" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete access" ON public.profiles FOR DELETE USING (true);

CREATE POLICY "Allow anon read access" ON public.quests FOR SELECT USING (true);
CREATE POLICY "Allow anon insert access" ON public.quests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update access" ON public.quests FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete access" ON public.quests FOR DELETE USING (true);

CREATE POLICY "Allow anon read access" ON public.requests FOR SELECT USING (true);
CREATE POLICY "Allow anon insert access" ON public.requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update access" ON public.requests FOR UPDATE USING (true);

CREATE POLICY "Allow anon read access" ON public.shop_items FOR SELECT USING (true);
CREATE POLICY "Allow anon insert access" ON public.shop_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update access" ON public.shop_items FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete access" ON public.shop_items FOR DELETE USING (true);

CREATE POLICY "Allow anon read access" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Allow anon insert access" ON public.challenges FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update access" ON public.challenges FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete access" ON public.challenges FOR DELETE USING (true);

-- ==========================================
-- TRIGGERS CẬP NHẬT updated_at
-- ==========================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_families_modtime BEFORE UPDATE ON public.families FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_quests_modtime BEFORE UPDATE ON public.quests FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_requests_modtime BEFORE UPDATE ON public.requests FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_shop_items_modtime BEFORE UPDATE ON public.shop_items FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_challenges_modtime BEFORE UPDATE ON public.challenges FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ==========================================
-- ENABLE REALTIME
-- ==========================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenges;
