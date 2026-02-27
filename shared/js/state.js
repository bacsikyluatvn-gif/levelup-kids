/**
 * LevelUp Kids State Management - SUPABASE EDITION
 * Quản lý dữ liệu qua Đám Mây đồng bộ thời gian thực
 */

const TREE_MILESTONES = [
        { points: 0, name: 'Đất Trống', icon: 'yard', color: 'slate' },
        { points: 10, name: 'Hạt Giống Vàng', icon: 'potted_plant', color: 'amber' },
        { points: 40, name: 'Mầm Xanh Hy Vọng', icon: 'spa', color: 'emerald' },
        { points: 100, name: 'Cây Non Khỏe Mạnh', icon: 'nature', color: 'green' },
        { points: 250, name: 'Cây Đang Lớn', icon: 'park', color: 'teal' },
        { points: 500, name: 'Cây Trưởng Thành', icon: 'forest', color: 'cyan' },
        { points: 850, name: 'Cây Có Quả', icon: 'eco', color: 'blue' },
        { points: 1300, name: 'Cây Đại Thụ', icon: 'nature_people', color: 'indigo' },
        { points: 2000, name: 'Cây Thần Kỳ', icon: 'energy_savings_leaf', color: 'purple' },
        { points: 3000, name: 'Cây Thần Thoại', icon: 'landscape', color: 'violet' },
];
window.TREE_MILESTONES = TREE_MILESTONES;

const TITLE_MILESTONES = [
        // --- Giai đoạn Khởi Đầu (Beginner) ---
        { stickers: 3, name: 'Mầm Non Chăm Chỉ', icon: 'spa', color: 'lime' },
        { stickers: 7, name: 'Chồi Non Dũng Cảm', icon: 'eco', color: 'green' },
        { stickers: 12, name: 'Tân Binh Nhiệt Huyết', icon: 'emoji_events', color: 'teal' },
        { stickers: 20, name: 'Thợ Săn Sao Nhí', icon: 'star', color: 'cyan' },

        // --- Giai đoạn Trưởng Thành (Growing) ---
        { stickers: 30, name: 'Chiến Binh Ngôi Sao', icon: 'military_tech', color: 'blue' },
        { stickers: 45, name: 'Hiệp Sĩ Kỷ Luật', icon: 'shield', color: 'indigo' },
        { stickers: 60, name: 'Dũng Sĩ Chăm Chỉ', icon: 'security', color: 'purple' },
        { stickers: 80, name: 'Nhà Thám Hiểm Nhí', icon: 'explore', color: 'violet' },



        // --- Giai đoạn Xuất Sắc (Advanced) ---
        { stickers: 100, name: 'Anh Hùng Gia Đình', icon: 'verified_user', color: 'amber' },
        { stickers: 130, name: 'Chiến Thần Kiên Trì', icon: 'local_fire_department', color: 'orange' },
        { stickers: 170, name: 'Nhà Vô Địch Nhí', icon: 'trophy', color: 'rose' },
        { stickers: 220, name: 'Ngôi Sao Rực Rỡ', icon: 'auto_awesome', color: 'pink' },

        // --- Giai đoạn Huyền Thoại (Legendary) ---
        { stickers: 280, name: 'Bậc Thầy Kỷ Luật', icon: 'school', color: 'emerald' },
        { stickers: 350, name: 'Đại Hiệp Siêu Cấp', icon: 'workspace_premium', color: 'sky' },
        { stickers: 440, name: 'Siêu Nhân Gia Đình', icon: 'bolt', color: 'blue' },
        { stickers: 550, name: 'Huyền Thoại Sống', icon: 'diamond', color: 'indigo' },

        // --- Giai đoạn Thần Thoại (Mythic) ---
        { stickers: 700, name: 'Thần Đồng Bất Bại', icon: 'whatshot', color: 'purple' },
        { stickers: 900, name: 'Vua Chiến Binh', icon: 'castle', color: 'amber' },
        { stickers: 1200, name: 'Bất Tử Vĩnh Cửu', icon: 'shield_with_heart', color: 'rose' },
        { stickers: 2000, name: 'Thần Thoại Tối Thượng', icon: 'temp_preferences_custom', color: 'red' },
];
window.TITLE_MILESTONES = TITLE_MILESTONES;

const GROWTH_BEHAVIORS = {
        GOOD: [
                { id: 'help_sibling', text: 'Nhường nhịn, giúp đỡ em', emoji: '🤝', gold: 20, xp: 15, water: 2, sticker: 1 },
                { id: 'proactive_clean', text: 'Tự giác dọn dẹp', emoji: '🧹', gold: 15, xp: 10, water: 1, sticker: 0 },
                { id: 'polite', text: 'Lễ phép, ngoan ngoãn', emoji: '🙇', gold: 10, xp: 5, water: 0, sticker: 0 },
                { id: 'finish_food', text: 'Tự giác ăn hết suất', emoji: '😋', gold: 10, xp: 10, water: 1, sticker: 0 }
        ],
        BAD: [
                { id: 'whining', text: 'Mè nheo, nhè nhẹo', emoji: '😩', gold: -10, xp: -5, water: 0, sticker: 0 },
                { id: 'teasing', text: 'Trêu chọc, làm em khóc', emoji: '😤', gold: -20, xp: -10, water: 0, sticker: 0 },
                { id: 'lazy', text: 'Lười biếng, không nghe lời', emoji: '😴', gold: -10, xp: -5, water: 0, sticker: 0 },
                { id: 'tantrum', text: 'Ăn vạ, quấy khóc', emoji: '😭', gold: -15, xp: -10, water: 0, sticker: 0 }
        ]
};
window.GROWTH_BEHAVIORS = GROWTH_BEHAVIORS;

// --- STICKER DATA MOVED TO stickers-data.js ---
const defaultEmptyData = {
        user: { id: null, name: 'Loading...', level: 1, xp: 0, maxXp: 100, gold: 0, stickers: 0, totalStickers: 0, water: 0, avatar: '' },
        leaderboard: [],
        quests: [],
        shopItems: [],
        instantPerks: [],
        requests: [],
        challenges: [],
        tree: { streak: 0, stage: 0, stageName: 'Đất Trống' },
        title: { currentTitleName: '...' },
        treePoints: 0
};

class StateManager {
        constructor() {
                this.listeners = [];
                this.data = JSON.parse(JSON.stringify(defaultEmptyData));
                this.familyId = null;
                this.client = null;
                this._botMatchesGenerated = false;
                this._isSyncingFromDb = false;
                this._isUpdatingProfile = false;

                console.log("%c [State] VERSION 1.0.5 - FIXED ISOLATION ACTIVE ", "background: #ee9d2b; color: white; font-weight: bold; padding: 4px; border-radius: 4px;");

                // Load immediate cache for faster UI
                this.loadFromCache();

                // Tự động nhúng thư viện Supabase nếu chưa có
                this.initSupabaseSDK();
        }

        loadFromCache() {
                try {
                        // CỐ LẬP CACHE THEO PROFILE: Sử dụng ID profile trong key để tránh rò rỉ sticker giữa các trẻ
                        const profileId = localStorage.getItem('family_quest_active_profile');
                        if (!profileId) return;

                        // ĐỔI KEY ĐỂ FORCE RESET MỌI CACHE CŨ BỊ NHIỄM BẨN
                        const cacheKey = `family_quest_state_v3_cache_${profileId}`;
                        const cached = localStorage.getItem(cacheKey);
                        if (cached) {
                                const parsed = JSON.parse(cached);
                                if (parsed.user) delete parsed.user.unlockedStickers; // Luôn xóa để sync từ DB
                                // Merge with default to be safe
                                this.data = { ...this.data, ...parsed };
                                console.log(`[State] 🚀 Đã nạp dữ liệu cache riêng cho profile: ${profileId}`);
                        }
                } catch (e) {
                        console.error("[State] Cache load error:", e);
                }
        }

        saveToCache() {
                try {
                        const profileId = localStorage.getItem('family_quest_active_profile');
                        if (!profileId) return;

                        const cacheKey = `family_quest_state_v3_cache_${profileId}`;
                        // XÓA stickers khỏi cache để tránh rò rỉ dữ liệu giữa các lần load
                        const userCopy = { ...(this.data.user || {}) };
                        delete userCopy.unlockedStickers;

                        // Chỉ lưu những phần cần thiết của profile hiện tại
                        const toSave = {
                                user: userCopy,
                                tree: this.data.tree,
                                title: this.data.title,
                                treePoints: this.data.treePoints
                        };
                        localStorage.setItem(cacheKey, JSON.stringify(toSave));
                } catch (e) {
                        console.error("[State] Cache save error:", e);
                }
        }

        initSupabaseSDK() {
                const SUPABASE_URL = 'https://arvmqponpilsctcclvci.supabase.co';
                const SUPABASE_ANON_KEY = 'sb_publishable_tVZTqDVIHT_4Xfd-OuTfkA_TyDhDJPT';

                const startInit = () => {
                        if (!window.supabaseClient) {
                                window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                        }
                        this.client = window.supabaseClient;
                        this.initDatabase();
                };

                if (window.supabase) {
                        startInit();
                        return;
                }

                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
                script.onload = () => startInit();
                document.head.appendChild(script);
        }

        subscribe(callback) {
                this.listeners.push(callback);
                callback(this.data);
        }

        notify() {
                this.recalculateDerivedStats();
                this.syncUserToLeaderboard();
                this.saveToCache();
                this.listeners.forEach(cb => cb(this.data));
        }

        /**
         * Đồng bộ dữ liệu local của User hiện tại vào danh sách Leaderboard
         * Giúp BXH cập nhật "Real-time" ngay cả khi database chưa sync kịp
         */
        syncUserToLeaderboard() {
                if (!this.data.user || !this.data.leaderboard) return;
                const activeId = this.data.user.id;
                const lbEntry = this.data.leaderboard.find(u => u.id === activeId);
                if (lbEntry) {
                        const u = this.data.user;
                        lbEntry.gold = u.gold;
                        lbEntry.xp = u.xp;
                        lbEntry.level = u.level;
                        lbEntry.personalityPoints = u.personalityPoints;
                        lbEntry.weeklyXp = u.weeklyXp;
                        lbEntry.water = u.water;
                        lbEntry.stickers = u.stickers;
                        lbEntry.totalStickers = u.totalStickers;
                        lbEntry.actionStreak = u.actionStreak;
                        lbEntry.completionStreak = u.completionStreak;
                        lbEntry.weeklyStreak = u.weeklyStreak;
                }
        }

        async initDatabase() {
                if (!this.client) return;

                const { data: { session } } = await this.client.auth.getSession();

                if (!session) {
                        console.warn("Chưa đăng nhập Supabase bằng tài khoản Phụ Huynh.");
                        const cachedFid = localStorage.getItem('family_quest_fid');
                        if (cachedFid) {
                                this.familyId = cachedFid;
                        } else {
                                console.log("Đang tự động tạo một Gia đình Demo Ẩn danh...");
                                const { data: newFamily, error } = await this.client.from('families').insert({}).select().single();
                                if (newFamily) {
                                        this.familyId = newFamily.id;
                                        localStorage.setItem('family_quest_fid', this.familyId);
                                        await this.seedDemoData(this.familyId);
                                }
                        }

                        if (this.familyId) {
                                this.setupRealtimeSync();
                                await this.syncFromDatabase();
                        }
                        return;
                }

                const parentId = session.user.id;
                const { data: families } = await this.client.from('families').select('*').eq('parent_id', parentId).limit(1);
                let family = families && families.length > 0 ? families[0] : null;

                if (!family) {
                        // First time ever! Create family and seed data
                        const { data: newFamily } = await this.client.from('families').insert({ parent_id: parentId }).select().single();
                        family = newFamily;
                        if (family) {
                                await this.seedDemoData(family.id);
                        }
                }

                if (family) {
                        this.familyId = family.id;
                        localStorage.setItem('family_quest_fid', this.familyId); // Lưu cho chế độ Trẻ em ẩn danh

                        console.log("Supabase Init Khởi tạo thành công: Family ID ->", this.familyId);

                        this.setupRealtimeSync();
                        await this.syncFromDatabase();
                }
        }

        setupRealtimeSync() {
                // Setup Realtime with Throttling
                this._syncTimeout = null;
                this.client.channel('any-change').on('postgres_changes', { event: '*', schema: 'public' }, payload => {
                        if (this._isUpdatingProfile) return; // Đừng sync nếu đang bận update
                        // 1. Tránh lặp vô tận khi chính mình update bot
                        if (payload.table === 'profiles' && payload.new && payload.new.role === 'bot') return;

                        // 2. Phân tầng ưu tiên dựa trên bảng
                        const isPriority = ['profiles', 'families'].includes(payload.table);
                        const delay = isPriority ? 400 : 2000; // Ưu tiên hồ sơ cập nhật nhanh

                        if (this._syncTimeout) clearTimeout(this._syncTimeout);
                        this._syncTimeout = setTimeout(() => {
                                console.log(`[Realtime] 🔄 Đồng bộ ${isPriority ? 'ƯU TIÊN' : 'THÔNG THƯỜNG'} do thay đổi tại ${payload.table}...`);
                                this.syncFromDatabase(isPriority);
                        }, delay);
                }).subscribe();
        }

        async seedDemoData(fId) {
                // Tạo hồ sơ mẫu
                await this.client.from('profiles').insert([
                        { family_id: fId, name: 'Bố/Mẹ', role: 'parent', avatar: '../shared/assets/generated_avatars/avatar_1.png', gold: 0 },
                        { family_id: fId, name: 'Bé Sóc', role: 'child', avatar: '../shared/assets/generated_avatars/avatar_6.png' }
                ]);

                await this.client.from('quests').insert([
                        { family_id: fId, title: 'Đánh răng sáng', description: 'Chải răng thật sạch 2 phút', reward: 10, xp: 20, sticker: 1, water: 2, icon: 'dentistry', color: 'blue' },
                        { family_id: fId, title: 'Dọn đồ chơi', description: 'Cất đồ sau khi chơi', reward: 15, xp: 25, sticker: 2, water: 3, icon: 'toys', color: 'orange' }
                ]);

                await this.client.from('shop_items').insert([
                        { family_id: fId, title: 'Xem TV 30p', description: 'Xem tivi', sticker_price: 5, emoji: '📺', item_type: 'perk' },
                        { family_id: fId, title: 'Đồ chơi LEGO', description: 'Mua lego nhỏ', price: 300, item_type: 'premium' }
                ]);
        }

        async syncFromDatabase(priorityOnly = false) {
                if (!this.client || !this.familyId) return;
                if (this._isSyncingFromDb) return;
                this._isSyncingFromDb = true;

                const challengeLimit = 3000;
                const requestLimit = 2000;

                const queries = [
                        this.client.from('profiles').select('*').eq('family_id', this.familyId),
                        !priorityOnly ? this.client.from('quests').select('*').eq('family_id', this.familyId) : Promise.resolve({ data: null }),
                        !priorityOnly ? this.client.from('requests').select('*').eq('family_id', this.familyId).order('created_at', { ascending: false }).limit(requestLimit) : Promise.resolve({ data: null }),
                        !priorityOnly ? this.client.from('shop_items').select('*').eq('family_id', this.familyId) : Promise.resolve({ data: null }),
                        !priorityOnly ? this.client.from('challenges').select('*').eq('family_id', this.familyId).order('created_at', { ascending: false }).limit(challengeLimit) : Promise.resolve({ data: null }),
                        // Ta luôn lấy treePoints để tránh bị reset UI khi sync nhanh (Profiles update)
                        // Tăng limit lên 5000 để tránh bị hụt điểm khi chơi lâu
                        this.client.from('requests').select('profile_id', { count: 'exact' }).eq('family_id', this.familyId).eq('type', 'tree_watering').limit(5000)
                ];

                const results = await Promise.all(queries);
                const profRes = results[0];
                const profiles = profRes.data || [];
                this._lastRawProfiles = profiles;

                // Lưu lại điểm cũ để tránh bị reset về 0 khi đang map dở
                const oldPointsMap = new Map((this.data.leaderboard || []).map(p => [p.id, p.treePoints]));

                // --- PROCESS PROFILES (ALWAYS) ---
                this.data.leaderboard = profiles.map(p => {
                        const idHash = p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        let name = (p.name || "Bé").replace(' (Bot)', '').trim();
                        let avatar = p.avatar;

                        if (p.role === 'bot') {
                                const isBoy = idHash % 2 === 0;
                                const pool = isBoy ? ['Thành Nam', 'Minh Khôi', 'Gia Huy', 'Khôi Nguyên', 'Bảo Nam', 'Đức Anh', 'Tùng Lâm', 'Sóc Nâu', 'Bi Bi', 'Khoai Tây'] : ['Khánh Linh', 'Ngọc Diệp', 'Trà My', 'Hoài An', 'Mỹ Tâm', 'An Chi', 'Tuệ Lâm', 'Mây Xinh', 'Kem Dâu', 'Thỏ Ngọc'];
                                name = pool[idHash % pool.length];
                                const avPool = isBoy ? [1, 3, 4, 5, 9, 10, 15, 18, 19, 20] : [2, 6, 7, 8, 11, 12, 13, 14, 16, 17];
                                avatar = `../shared/assets/generated_avatars/avatar_${avPool[idHash % avPool.length]}.png`;
                        }

                        return {
                                id: p.id,
                                name,
                                role: p.role,
                                avatar,
                                pinCode: p.pin_code,
                                level: p.level || 1,
                                gold: p.gold || 0,
                                xp: p.xp || 0,
                                personalityPoints: p.personality_points || 0,
                                weeklyXp: p.weekly_xp || 0,
                                water: p.water || 0,
                                stickers: p.stickers || 0,
                                // totalStickers: Ensure we use the best available number
                                totalStickers: Math.max(
                                        p.total_stickers || 0,
                                        (Array.isArray(p.unlocked_stickers) ? p.unlocked_stickers.length : 0) + (p.stickers || 0)
                                ),
                                actionStreak: p.action_streak || 0,
                                weeklyStreak: p.weekly_streak || 0,
                                completionStreak: p.completion_streak || 0,
                                unlockedStickers: Array.isArray(p.unlocked_stickers) ? p.unlocked_stickers : [],
                                metadata: p.metadata || {}
                        };
                });

                // --- PROCESS OTHERS (ONLY IF FULL SYNC) ---
                if (!priorityOnly && results.length > 1) {
                        const questRes = results[1];
                        const reqRes = results[2];
                        const shopRes = results[3];
                        const challRes = results[4];

                        if (reqRes && reqRes.data) {
                                this.data.requests = reqRes.data.map(r => ({
                                        id: r.id, profileId: r.profile_id, user: this.getProfileName(r.profile_id, profiles),
                                        itemTitle: r.item_title, itemDesc: r.item_desc, status: r.status, type: r.type,
                                        taskId: r.task_id, reward: r.reward_gold, xp: r.reward_xp, water: r.reward_water,
                                        sticker: r.reward_sticker, price: r.price_gold, stickerPrice: r.price_sticker,
                                        image: r.image, createdAt: r.created_at, time: r.created_at ? new Date(r.created_at).toLocaleString('vi-VN') : ''
                                }));
                                // Growth Logs
                                this.data.growthLogs = this.data.requests.filter(r => ['behavior_good', 'behavior_bad', 'reflection', 'atonement'].includes(r.type));
                        }

                        if (questRes && questRes.data) {
                                const todayStr = new Date().toISOString().split('T')[0];
                                this.data.quests = questRes.data.map(q => ({
                                        id: q.id, title: q.title, desc: q.description, reward: q.reward, xp: q.xp,
                                        water: q.water, sticker: q.sticker, icon: q.icon, color: q.color,
                                        category: q.category, type: q.type,
                                        completedBy: this.data.requests.filter(r => r.taskId == q.id && r.type === 'task' && r.createdAt && r.createdAt.startsWith(todayStr)).map(r => r.profileId)
                                }));
                        }

                        if (shopRes && shopRes.data) {
                                this.data.shopItems = shopRes.data.filter(s => s.item_type === 'premium').map(s => ({
                                        id: s.id, title: s.title, desc: s.description, price: s.price, image: s.image, emoji: s.emoji, category: s.category, color: s.color
                                }));
                                this.data.instantPerks = shopRes.data.filter(s => s.item_type === 'perk').map(s => ({
                                        id: s.id, title: s.title, desc: s.description, stickerPrice: s.sticker_price, emoji: s.emoji, color: s.color
                                }));
                        }

                        if (challRes && challRes.data) {
                                this.data.challenges = challRes.data.map(c => ({
                                        id: c.id, challengerId: c.challenger_id, opponentId: c.opponent_id,
                                        taskType: c.task_type, status: c.status,
                                        challengerConfirmed: c.challenger_confirmed, opponentConfirmed: c.opponent_confirmed,
                                        winnerId: c.winner_id, date: c.date, createdAt: c.created_at,
                                        logs: c.logs || [], metadata: c.metadata || {}
                                }));
                        }

                        if (!this._botMatchesGenerated) {
                                setTimeout(() => this.generateBotMatches(), 5000);
                        }
                }

                // Finalize active profile
                // Streaks & Points - Phải tính Points trước rồi mới tính Streaks/Tree
                const wateringCounts = results[5]?.data || [];

                this.data.leaderboard.forEach(p => {
                        const dbCount = wateringCounts.filter(r => r.profile_id === p.id).length;
                        const oldPoints = oldPointsMap.get(p.id) || 0;

                        if (!priorityOnly && wateringCounts.length > 0) {
                                // Nếu là Full Sync, dùng dữ liệu DB chuẩn xác nhất
                                p.treePoints = p.role === 'bot' ? (p.actionStreak || 0) : dbCount;
                        } else {
                                // Nếu sync nhanh (Priority), dùng Math.max để giữ feedback tức thì
                                p.treePoints = p.role === 'bot' ? (p.actionStreak || 0) : Math.max(dbCount, oldPoints);
                        }
                });

                // Finalize active profile - Phải làm SAO khi đã có treePoints
                let savedId = localStorage.getItem('family_quest_active_profile');
                let activeUser = this.data.leaderboard.find(p => p.id === savedId);
                if (!activeUser && this.data.leaderboard.length > 0) activeUser = this.data.leaderboard.find(p => p.role === 'child') || this.data.leaderboard[0];

                if (activeUser) {
                        this.currentProfileId = activeUser.id;

                        // CHỈ ghi đè user local nếu CHƯA có thay đổi mới chưa kịp lưu (Tránh race condition khi đang Save)
                        if (!this._isUpdatingProfile) {
                                const oldUser = this.data.user || {};
                                const newUser = { ...activeUser, isCurrentUser: true };

                                // KIỂM TRA QUAN TRỌNG: Chỉ gộp local + db nếu là CÙNG một người dùng VÀ đã qua lần sync đầu tiên
                                // Nếu là lần đầu tiên (ngay sau load hoặc đổi profile): Trust DB hoàn toàn để xóa sạch rác cache.
                                if (oldUser.id === newUser.id && this._initialSyncDone) {
                                        // 1. Gộp danh sách Sticker (Union) - chỉ dành cho chính người đó
                                        const mergedUnlocked = Array.from(new Set([
                                                ...(oldUser.unlockedStickers || []),
                                                ...(newUser.unlockedStickers || [])
                                        ]));
                                        newUser.unlockedStickers = mergedUnlocked;

                                        // 2. Bảo vệ số dư Sticker balance local nếu DB bị cũ
                                        const localCount = (oldUser.unlockedStickers || []).length;
                                        const dbCount = (activeUser.unlockedStickers || []).length;
                                        if (localCount > dbCount && oldUser.stickers !== undefined) {
                                                if (oldUser.stickers < newUser.stickers) {
                                                        newUser.stickers = oldUser.stickers;
                                                }
                                        }
                                } else {
                                        // Nếu chuyển đổi sang profile khác hoàn toàn: 
                                        // 1. Reset các trạng thái milestone để không hiện popup cũ cho người mới
                                        this._lastTreeStage = undefined;
                                        this._lastTitleIdx = undefined;
                                        this._completedCollections = new Set();

                                        // 2. KHÔNG gộp unlockedStickers. Dữ liệu newUser sẽ hoàn toàn từ DB của người mới.
                                        console.log(`[State] 🔄 Chuyển đổi profile: ${oldUser.name} -> ${newUser.name}. Tách biệt kho Sticker.`);
                                }

                                this.data.user = newUser;
                        } else {
                                console.log("[State] 🛡️ Đang cập nhật dữ liệu... Bảo vệ profile local khỏi việc ghi đè.");
                        }
                }

                this.calculateStreaks();
                this.recalculateDerivedStats();

                this._initialSyncDone = true;
                this._isSyncingFromDb = false;
                this.notify();
                this.checkRankChange();
        }


        checkDailyBonus() {
                if (!this.data.user || this.data.user.role !== 'child') return;
                const todayStr = new Date().toISOString().split('T')[0];
                const lastLogin = localStorage.getItem(`daily_bonus_${this.data.user.id}`);

                if (lastLogin !== todayStr) {
                        localStorage.setItem(`daily_bonus_${this.data.user.id}`, todayStr);

                        // Trì hoãn một chút để đảm bảo UI đã sẵn sàng
                        setTimeout(() => {
                                this.addRewardsToLocalUser(20, 50, 5, 1);
                                if (window.celebrate) {
                                        window.celebrate({
                                                type: 'shop',
                                                title: "QUÀ NGÀY MỚI!",
                                                subtitle: "Tuyệt vời! Chào mừng con đã quay trở lại. Nhận ngay 20 Vàng và 50 XP nhé!",
                                                icon: "redeem"
                                        });
                                }
                                this.syncLocalUserToDb();
                        }, 1500);
                }
        }

        checkRankChange() {
                if (!this.data.user) return;
                const currentRank = this.data.leaderboard
                        .sort((a, b) => (b.totalStickers || 0) - (a.totalStickers || 0))
                        .findIndex(u => u.id === this.data.user.id) + 1;

                if (this._lastRank && currentRank < this._lastRank && currentRank <= 5 && this._initialSyncDone) {
                        // Delay slighty to avoid clashing with other immediate sync popups
                        setTimeout(() => {
                                window.celebrate({
                                        type: 'title',
                                        title: `TOP ${currentRank}!`,
                                        subtitle: `Xuất sắc! Con đã vượt qua thử thách và vươn lên vị trí số ${currentRank} trên Bảng Xếp Hạng Sticker toàn gia đình!`,
                                        icon: 'leaderboard'
                                });
                        }, 2000);
                }
                this._lastRank = currentRank;
        }

        calculateMemberStreak(userId) {
                if (!this.data.requests) return { actionStreak: 0, completionStreak: 0, weeklyLog: [] };

                const taskReqs = this.data.requests.filter(r => r.profileId === userId && r.type === 'task' && r.createdAt);

                const getLocalDateStr = (date) => {
                        const d = typeof date === 'string' ? new Date(date) : date;
                        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
                };

                const todayStr = getLocalDateStr(new Date());

                // 1. CHUỖI HÀNH ĐỘNG
                let actionStreak = 0;
                let checkDay = new Date();

                const hasToday = taskReqs.some(r => getLocalDateStr(r.createdAt) === todayStr);

                if (!hasToday) {
                        checkDay.setDate(checkDay.getDate() - 1);
                }

                while (true) {
                        const dStr = getLocalDateStr(checkDay);
                        const hasWork = taskReqs.some(r => getLocalDateStr(r.createdAt) === dStr);

                        if (hasWork) {
                                actionStreak++;
                                checkDay.setDate(checkDay.getDate() - 1);
                        } else {
                                break;
                        }
                        if (actionStreak > 365) break;
                }

                // 2. CHUỖI HOÀN THÀNH
                const mandatoryQuests = this.data.quests.filter(q => q.type !== 'optional');
                const reqCount = mandatoryQuests.length;

                let completionStreak = 0;
                checkDay = new Date();

                const todayDone = taskReqs.filter(r => getLocalDateStr(r.createdAt) === todayStr).length;

                if (todayDone < reqCount || reqCount === 0) {
                        checkDay.setDate(checkDay.getDate() - 1);
                }

                while (true) {
                        const dStr = getLocalDateStr(checkDay);
                        const doneCount = taskReqs.filter(r => getLocalDateStr(r.createdAt) === dStr).length;

                        if (doneCount >= reqCount && reqCount > 0) {
                                completionStreak++;
                                checkDay.setDate(checkDay.getDate() - 1);
                        } else {
                                break;
                        }
                        if (completionStreak > 365) break;
                }

                // 3. TRẠNG THÁI TUẦN
                const weeklyLog = [false, false, false, false, false, false, false];
                const now = new Date();
                const dayOfWeek = (now.getDay() + 6) % 7;

                for (let i = 0; i <= 6; i++) {
                        const d = new Date(now);
                        d.setDate(d.getDate() - (dayOfWeek - i));
                        const dStr = getLocalDateStr(d);

                        const doneCount = taskReqs.filter(r => getLocalDateStr(r.createdAt) === dStr).length;

                        if (doneCount >= reqCount && reqCount > 0) {
                                weeklyLog[i] = true;
                        }
                }

                return { actionStreak, completionStreak, weeklyLog };
        }

        calculateStreaks() {
                if (!this.data.user) return;
                const streaks = this.calculateMemberStreak(this.data.user.id);
                this.data.user.actionStreak = streaks.actionStreak;
                this.data.user.completionStreak = streaks.completionStreak;
                this.data.user.weeklyLog = streaks.weeklyLog;
        }

        getProfileName(id, profiles) {
                let p = profiles.find(x => x.id === id);
                if (!p) return 'Nhà thám hiểm';
                return p.role === 'bot' ? p.name.replace(' (Bot)', '').trim() : p.name;
        }

        recalculateDerivedStats() {
                const user = this.data.user;
                if (!user || user.level === undefined) return;
                user.maxXp = Math.floor(100 * Math.pow(user.level, 1.5));

                let streak = user.treePoints || 0;
                let sIdx = 0;
                for (let i = 0; i < window.TREE_MILESTONES.length; i++) {
                        if (streak >= window.TREE_MILESTONES[i].points) sIdx = i;
                }
                this.data.tree = { streak, stage: sIdx, stageName: window.TREE_MILESTONES[sIdx].name };

                let tIdx = -1;
                for (let i = 0; i < window.TITLE_MILESTONES.length; i++) {
                        if ((user.totalStickers || 0) >= window.TITLE_MILESTONES[i].stickers) tIdx = i;
                }
                this.data.title = { currentTitleIndex: tIdx, currentTitleName: tIdx >= 0 ? window.TITLE_MILESTONES[tIdx].name : 'Chưa có danh hiệu' };

                // --- MILESTONE CELEBRATIONS ---
                if (window.celebrate && this._initialSyncDone) {
                        // 1. Tree Milestone
                        if (this._lastTreeStage !== undefined && sIdx > this._lastTreeStage) {
                                const m = window.TREE_MILESTONES[sIdx];
                                setTimeout(() => {
                                        window.celebrate({
                                                type: 'sticker',
                                                title: m.name.toUpperCase(),
                                                subtitle: `Tuyệt vời! Cây thần kỳ đã lớn thêm một bậc mới: ${m.name}!`,
                                                icon: m.icon
                                        });
                                }, 500);
                        }
                        this._lastTreeStage = sIdx;

                        // 2. Title Milestone
                        if (this._lastTitleIdx !== undefined && tIdx > this._lastTitleIdx) {
                                const m = window.TITLE_MILESTONES[tIdx];
                                setTimeout(() => {
                                        window.celebrate({
                                                type: 'title',
                                                title: m.name.toUpperCase(),
                                                subtitle: `Thành tích khủng! Con đã đạt được danh hiệu cao quý mới: ${m.name}!`,
                                                icon: m.icon
                                        });
                                }, 1500);
                        }
                        this._lastTitleIdx = tIdx;

                        // 3. Sticker Collection Completion
                        if (window.STICKER_COLLECTIONS && window.STICKER_CATALOG) {
                                if (!this._completedCollections) this._completedCollections = new Set();
                                const unlocked = user.unlockedStickers || [];

                                Object.keys(window.STICKER_COLLECTIONS).forEach(colId => {
                                        if (this._completedCollections.has(colId)) return;

                                        const colStickers = window.STICKER_CATALOG.filter(s => s.collection === colId);
                                        const isDone = colStickers.length > 0 && colStickers.every(s => unlocked.includes(s.id));

                                        if (isDone) {
                                                this._completedCollections.add(colId);
                                                const info = window.STICKER_COLLECTIONS[colId];
                                                setTimeout(() => {
                                                        window.celebrate({
                                                                type: 'sticker',
                                                                title: "BỘ SƯU TẬP HOÀN TẤT!",
                                                                subtitle: `Tuyệt đỉnh! Con đã sưu tầm trọn bộ sticker "${info.name}"!`,
                                                                icon: 'auto_awesome'
                                                        });
                                                }, 3000);
                                        }
                                });
                        }
                }
                this._lastTitleIdx = tIdx;
        }

        setCurrentUser(id) {
                if (this.data.user && this.data.user.id !== id) {
                        // Reset local state for celebrations to avoid old notifications
                        this._lastTreeStage = undefined;
                        this._lastTitleIdx = undefined;
                        this._completedCollections = new Set();
                        this._initialSyncDone = false; // Reset sync flag for the new person
                        console.log(`[State] Switching profile to ${id}, resetting local celebrations state.`);
                }

                localStorage.setItem('family_quest_active_profile', id);
                this.loadFromCache(); // Load new profile cache immediately
                this.syncFromDatabase();
        }

        // ==========================================
        // ACTIONS (ASYNC SUPABASE)
        // ==========================================

        async logBehavior(profileId, behaviorId, type = 'GOOD', customData = null) {
                if (!this.familyId) return null;

                let title = '';
                let description = '';
                let rewardGold = 0;
                let rewardXp = 0;
                let rewardWater = 0;
                let rewardSticker = 0;

                if (behaviorId === 'custom' && customData) {
                        title = customData.title || (type === 'GOOD' ? 'Việc tốt khác' : 'Nhắc nhở khác');
                        description = customData.description || '';
                        rewardGold = parseInt(customData.gold) || 0;
                        rewardXp = parseInt(customData.xp) || 0;
                        rewardWater = parseInt(customData.water) || 0;
                        rewardSticker = parseInt(customData.sticker) || 0;
                } else {
                        const behavior = window.GROWTH_BEHAVIORS[type].find(b => b.id === behaviorId);
                        if (!behavior) return null;

                        title = behavior.text;
                        description = customData?.description || ''; // Allow adding desc to preset
                        rewardGold = customData?.gold !== undefined ? parseInt(customData.gold) : behavior.gold;
                        rewardXp = customData?.xp !== undefined ? parseInt(customData.xp) : behavior.xp;
                        rewardWater = customData?.water !== undefined ? parseInt(customData.water) : behavior.water;
                        rewardSticker = customData?.sticker !== undefined ? parseInt(customData.sticker) : behavior.sticker;
                }

                const profile = this.data.leaderboard.find(p => p.id === profileId);
                if (!profile) return null;

                const reqData = {
                        family_id: this.familyId,
                        profile_id: profileId,
                        item_title: description ? `${title} | ${description}` : title,
                        status: 'approved',
                        type: type === 'GOOD' ? 'behavior_good' : 'behavior_bad',
                        reward_gold: rewardGold,
                        reward_xp: rewardXp,
                        reward_water: rewardWater,
                        reward_sticker: rewardSticker,
                        rewards_granted: true,
                        created_at: new Date().toISOString()
                };

                // Insert the log
                const { data, error } = await this.client.from('requests').insert(reqData).select().single();
                if (error) {
                        console.error("Error logging behavior:", error);
                        return null;
                }

                // Tự động cộng/trừ điểm nhân cách: Tốt +10, Xấu -5
                const personalityChange = type === 'GOOD' ? 10 : -5;

                // Update profile stats immediately
                await this.client.from('profiles').update({
                        gold: Math.max(0, (profile.gold || 0) + rewardGold),
                        xp: Math.max(0, (profile.xp || 0) + rewardXp),
                        weekly_xp: Math.max(0, (profile.weeklyXp || 0) + rewardXp),
                        water: Math.max(0, (profile.water || 0) + rewardWater),
                        stickers: Math.max(0, (profile.stickers || 0) + rewardSticker),
                        total_stickers: Math.max(0, (profile.totalStickers || 0) + rewardSticker),
                        personality_points: Math.max(0, (profile.personalityPoints || 0) + personalityChange)
                }).eq('id', profileId);

                await this.syncFromDatabase();
                return data;
        }

        async resolveBehavior(logId, resolutionData) {
                if (!this.familyId) return null;

                const profileId = this.data.user ? this.data.user.id : null;
                if (!profileId) return null;

                // --- GIAI ĐOẠN 1: CON HỨA SỬA LỖI ---
                if (logId) {
                        // 1. Tìm bản ghi bị phạt gốc
                        const { data: originalLog, error: fetchError } = await this.client
                                .from('requests')
                                .select('*')
                                .eq('id', logId)
                                .single();

                        if (fetchError || !originalLog) return null;

                        const recoveryGold = Math.abs(originalLog.reward_gold || 0);
                        const recoveryXp = Math.abs(originalLog.reward_xp || 0);

                        // 2. Tạo một yêu cầu "Phê duyệt sửa lỗi" gửi cho Ba Mẹ
                        const atonementReq = {
                                family_id: this.familyId,
                                profile_id: profileId,
                                item_title: `[HỨA SỬA SAI] ${originalLog.item_title.split(' | ')[0]} | Lời hứa: ${resolutionData.description}`,
                                status: 'pending',
                                type: 'atonement',
                                reward_gold: recoveryGold, // Hoàn 100%
                                reward_xp: recoveryXp,
                                reward_sticker: 1, // Thưởng thêm sticker Dũng cảm
                                rewards_granted: false, // CHƯA CỘNG QUÀ NGAY
                                created_at: new Date().toISOString()
                        };

                        const { data: newAtone, error: atoneError } = await this.client.from('requests').insert(atonementReq).select().single();

                        if (atoneError) {
                                console.error("Error creating atonement request:", atoneError);
                                return null;
                        }

                        // 3. Cập nhật bản ghi gốc sang trạng thái "Đang sửa lỗi"
                        const updatedTitle = originalLog.item_title.split(' (')[0] + " (Ba mẹ đang kiểm tra lời hứa ⏳)";
                        await this.client.from('requests').update({
                                item_title: updatedTitle,
                                status: 'repairing' // Trạng thái đặc biệt
                        }).eq('id', logId);

                        await this.syncFromDatabase();
                        return newAtone;
                }

                // --- GIAI ĐOẠN 2: NHẬT KÝ TỰ PHẢN CHIẾU (Daily Reflection) ---
                const reqData = {
                        family_id: this.familyId,
                        profile_id: profileId,
                        item_title: resolutionData.title + (resolutionData.description ? ` | ${resolutionData.description}` : ""),
                        status: 'approved',
                        type: 'reflection',
                        reward_gold: 5,
                        reward_xp: 10,
                        reward_water: 2,
                        reward_sticker: 1,
                        is_sticker: false,
                        rewards_granted: true,
                        created_at: new Date().toISOString()
                };

                const { data: log, error } = await this.client.from('requests').insert(reqData).select().single();

                if (error) {
                        console.error("Error saving reflection:", error);
                        return null;
                }

                const u = this.data.leaderboard.find(p => p.id === profileId);
                if (u) {
                        await this.client.from('profiles').update({
                                gold: (u.gold || 0) + 5,
                                xp: (u.xp || 0) + 10,
                                weekly_xp: (u.weeklyXp || 0) + 10,
                                water: (u.water || 0) + 2,
                                stickers: (u.stickers || 0) + 1,
                                total_stickers: (u.totalStickers || 0) + 1
                        }).eq('id', profileId);
                }

                await this.syncFromDatabase();
                return log;
        }

        async completeTask(taskId) {
                if (!this.data.user || !this.data.user.id) return;
                const task = this.data.quests.find(q => q.id === taskId);
                if (!task || task.completedBy.includes(this.data.user.id)) return;

                // Optimistic UI
                if (!this._pendingCompletions) this._pendingCompletions = new Set();
                this._pendingCompletions.add(taskId);

                task.completedBy.push(this.data.user.id);
                this.addRewardsToLocalUser(task.reward, task.xp, task.water, task.sticker);
                this.notify();

                try {
                        // Upload Request Log
                        const { data: newReq } = await this.client.from('requests').insert({
                                family_id: this.familyId,
                                profile_id: this.data.user.id,
                                item_title: task.title,
                                status: 'pending',
                                type: 'task',
                                task_id: taskId,
                                reward_gold: task.reward || 0,
                                reward_xp: task.xp || 0,
                                reward_water: task.water || 0,
                                reward_sticker: task.sticker || 0,
                                rewards_granted: true
                        }).select().single();

                        if (newReq) {
                                // Add to local requests if not already synced
                                if (!this.data.requests.find(r => r.id === newReq.id)) {
                                        this.data.requests.unshift({
                                                id: newReq.id,
                                                profileId: newReq.profile_id,
                                                user: this.getProfileName(newReq.profile_id, this._lastRawProfiles || []),
                                                itemTitle: newReq.item_title,
                                                status: newReq.status,
                                                type: newReq.type,
                                                taskId: newReq.task_id,
                                                reward: newReq.reward_gold,
                                                xp: newReq.reward_xp,
                                                water: newReq.reward_water,
                                                sticker: newReq.reward_sticker,
                                                rewardsGranted: newReq.rewards_granted,
                                                time: new Date(newReq.created_at).toLocaleString('vi-VN')
                                        });
                                        this.notify();
                                }
                        }

                        // Update Backend Profile 
                        this.calculateStreaks();
                        this.notify();
                        await this.syncLocalUserToDb();

                        // Thành công thì mới xóa khỏi pending
                        this._pendingCompletions.delete(taskId);
                } catch (e) {
                        console.error("Lỗi hoàn thành nhiệm vụ:", e);
                        // Có thể rollback local state ở đây nếu cần
                }
        }

        addRewardsToLocalUser(gold, xp, water, sticker) {
                const u = this.data.user;
                u.gold = Math.max(0, (u.gold || 0) + parseInt(gold || 0));
                u.xp = Math.max(0, (u.xp || 0) + parseInt(xp || 0));
                u.weeklyXp = Math.max(0, (u.weeklyXp || 0) + parseInt(xp || 0));
                u.water = Math.max(0, (u.water || 0) + parseInt(water || 0));
                u.stickers = Math.max(0, (u.stickers || 0) + parseInt(sticker || 0));
                // totalStickers là tích lũy trọn đời (dùng cho Xếp hạng và Danh hiệu)
                u.totalStickers = Math.max(0, (u.totalStickers || 0) + parseInt(sticker || 0));

                this._lastUpdate = Date.now();

                let req = Math.floor(100 * Math.pow(u.level, 1.5));
                let leveledUp = false;
                while (u.xp >= req) {
                        u.level += 1;
                        u.xp -= req;
                        req = Math.floor(100 * Math.pow(u.level, 1.5));
                        leveledUp = true;
                }

                if (leveledUp && window.celebrate) {
                        setTimeout(() => {
                                window.celebrate({
                                        type: 'level',
                                        title: `CẤP ĐỘ ${u.level}`,
                                        subtitle: `Chúc mừng con đã thăng lên Cấp độ ${u.level}! Hãy tiếp tục nỗ lực nhé!`,
                                        icon: 'military_tech'
                                });
                        }, 100);
                }

                this.notify();
        }

        addRewards(g, x, w, s) { this.addRewardsToLocalUser(g, x, w, s); }

        async syncLocalUserToDb() {
                if (!this.data.user || !this.data.user.id) return;
                // NGẮN CHẶN POLLUTION: Nếu chưa sync xong từ DB lần đầu, tuyệt đối không được push local lên DB
                if (!this._initialSyncDone) {
                        console.warn("[State] Blocked syncLocalUserToDb: Initial sync not yet complete.");
                        return;
                }
                this._isUpdatingProfile = true;
                try {
                        await this.client.from('profiles').update({
                                gold: this.data.user.gold,
                                xp: this.data.user.xp,
                                water: this.data.user.water,
                                stickers: this.data.user.stickers,
                                total_stickers: this.data.user.totalStickers,
                                level: this.data.user.level,
                                name: this.data.user.name,
                                avatar: this.data.user.avatar,
                                weekly_xp: this.data.user.weeklyXp,
                                weekly_streak: this.data.user.weeklyStreak,
                                completion_streak: this.data.user.completionStreak,
                                action_streak: this.data.user.actionStreak, // Keep action_streak for task streaks
                                unlocked_stickers: this.data.user.unlockedStickers || [],
                                personality_points: this.data.user.personalityPoints || 0
                        }).eq('id', this.data.user.id);
                } catch (e) {
                        console.error("[State] syncLocalUserToDb error:", e);
                } finally {
                        this._isUpdatingProfile = false;
                        // Chỉ trigger sync sau khi update xong một lát để server kịp ghi dữ liệu
                        setTimeout(() => this.syncFromDatabase(true), 1200);
                }
        }

        async updateProfile(name, avatar) {
                if (!this.data.user) return;
                this.data.user.name = name;
                this.data.user.avatar = avatar;

                // Update in leaderboard too
                const lbUser = this.data.leaderboard.find(u => u.id === this.data.user.id);
                if (lbUser) {
                        lbUser.name = name;
                        lbUser.avatar = avatar;
                }

                this._lastUpdate = Date.now();
                await this.syncLocalUserToDb();
                this.notify();
        }

        async redeemPerk(perkId) {
                const perk = this.data.instantPerks.find(p => p.id === perkId);
                if (!perk || this.data.user.stickers < perk.stickerPrice) return false;

                // Optimistic
                this.data.user.stickers -= perk.stickerPrice;
                this.notify();

                // Push
                await this.syncLocalUserToDb();
                // Gửi yêu cầu đổi quà vào database
                // LƯU Ý: Loại bỏ trường 'image' vì cột này không tồn tại trong bảng 'requests' của Supabase
                // Chúng ta sẽ khôi phục hình ảnh từ title trong hàm syncFromDatabase
                const { error } = await this.client.from('requests').insert({
                        family_id: this.familyId,
                        profile_id: this.data.user.id,
                        item_title: perk.title + ' (Đặc quyền Sticker)',
                        status: 'pending',
                        type: 'perk',
                        is_sticker: true,
                        price_sticker: perk.stickerPrice
                        // image: perk.emoji || perk.icon || 'star' -- CỘT KHÔNG TỒN TẠI
                });

                if (error) console.error("[State] RedeemPerk Error:", error);

                await this.syncFromDatabase();
                return perk;
        }

        async redeemShopItem(itemId) {
                const item = this.data.shopItems.find(i => i.id === itemId);
                if (!item || this.data.user.gold < item.price) return false;

                this.data.user.gold -= item.price;
                this.notify();

                await this.syncLocalUserToDb();
                const { error } = await this.client.from('requests').insert({
                        family_id: this.familyId, profile_id: this.data.user.id,
                        item_title: item.title, status: 'pending', type: 'shop',
                        price_gold: item.price
                        // image: item.image -- CỘT KHÔNG TỒN TẠI
                });

                if (error) console.error("[State] RedeemShopItem Error:", error);

                await this.syncFromDatabase();
                return item;
        }

        async markRequestDelivered(reqId) {
                // Optimistic
                const r = this.data.requests.find(x => x.id === reqId);
                if (r) {
                        r.status = 'delivered';

                        // If rewards were NOT granted yet (e.g., Atonement or non-trust tasks), grant them now
                        if (!r.rewardsGranted) {
                                const u = this.data.leaderboard.find(x => x.id === r.profileId);
                                if (u) {
                                        u.gold = (u.gold || 0) + (r.reward || 0);
                                        u.xp = (u.xp || 0) + (r.xp || 0);
                                        u.weeklyXp = (u.weeklyXp || 0) + (r.xp || 0);
                                        u.water = (u.water || 0) + (r.water || 0);
                                        u.stickers = (u.stickers || 0) + (r.sticker || 0);
                                        u.totalStickers = (u.totalStickers || 0) + (r.sticker || 0);

                                        await this.client.from('profiles').update({
                                                gold: u.gold,
                                                xp: u.xp,
                                                weekly_xp: u.weeklyXp,
                                                water: u.water,
                                                stickers: u.stickers,
                                                total_stickers: u.totalStickers
                                        }).eq('id', u.id);

                                        // Update original log if it was an atonement
                                        if (r.type === 'atonement') {
                                                // Find the original bad behavior log that was being repaired
                                                const originalLogTitleToFind = r.itemTitle.replace('[HỨA SỬA SAI] ', '');
                                                const { data: logs } = await this.client.from('requests')
                                                        .select('id, item_title')
                                                        .eq('profile_id', r.profileId)
                                                        .eq('status', 'repairing')
                                                        .ilike('item_title', `%${originalLogTitleToFind}%`);

                                                if (logs && logs.length > 0) {
                                                        const logToUpdate = logs[0];
                                                        const cleanTitle = logToUpdate.item_title.split(' (')[0] + ' (Đã sửa lỗi hoàn hảo ✨)';
                                                        await this.client.from('requests').update({
                                                                item_title: cleanTitle,
                                                                status: 'resolved'
                                                        }).eq('id', logToUpdate.id);
                                                }
                                        }
                                }
                        }
                        this.notify();
                }

                await this.client.from('requests').update({ status: 'delivered', rewards_granted: true }).eq('id', reqId);
                await this.syncFromDatabase();
        }

        async rejectRequest(reqId) {
                const r = this.data.requests.find(x => x.id === reqId);
                if (r) {
                        r.status = 'rejected';
                        // Khôi phục điểm 
                        const u = this.data.leaderboard.find(x => x.id === r.profileId);
                        if (u) {
                                if (r.type === 'task' && r.rewardsGranted) {
                                        u.gold = Math.max(0, u.gold - r.reward);
                                        u.xp = Math.max(0, u.xp - r.xp);
                                        u.weeklyXp = Math.max(0, (u.weeklyXp || 0) - r.xp);
                                        u.water = Math.max(0, u.water - r.water);
                                        u.stickers = Math.max(0, u.stickers - r.sticker);
                                        u.totalStickers = Math.max(0, (u.totalStickers || 0) - r.sticker);
                                } else if (r.type === 'shop') {
                                        u.gold += r.price;
                                } else if (r.type === 'perk') {
                                        u.stickers += r.stickerPrice;
                                }

                                // Trả lại thẻ nhiệm vụ để con làm lại
                                if (r.type === 'task') {
                                        const quest = this.data.quests.find(q => q.id === r.taskId);
                                        if (quest && quest.completedBy.includes(r.profileId)) {
                                                quest.completedBy = quest.completedBy.filter(id => id !== r.profileId);
                                                await this.client.from('quests').update({ completed_by: quest.completedBy }).eq('id', quest.id);
                                        }
                                }

                                await this.client.from('profiles').update({
                                        gold: u.gold,
                                        xp: u.xp,
                                        weekly_xp: u.weeklyXp,
                                        water: u.water,
                                        stickers: u.stickers,
                                        total_stickers: u.totalStickers
                                }).eq('id', u.id);
                        }
                        this.notify();
                        await this.client.from('requests').update({ status: 'rejected' }).eq('id', reqId);
                }
        }

        // Backend compatibility cho component code cũ
        addRewardsToUserByName(userName, gold, xp, water, sticker) {
                if (!this.data.user) return;
                if (this.data.user.name === userName) {
                        this.addRewardsToLocalUser(gold, xp, water, sticker);
                        this.syncLocalUserToDb();
                        this.notify();
                }
        }

        async addUser(data) {
                if (!this.familyId) {
                        alert("Lỗi: Chưa có Mã số Gia đình. Bố/Mẹ hãy quay lại trang Đăng Nhập Phụ Huynh để kích hoạt trước nhé!");
                        return;
                }
                try {
                        const { error } = await this.client.from('profiles').insert({
                                family_id: this.familyId, name: data.name, avatar: data.avatar, role: 'child',
                                personality_points: 0
                        });

                        if (error) {
                                console.error("Supabase lỗi khi thêm bé:", error);
                                alert("Supabase lỗi: " + error.message);
                        } else {
                                console.log("[State] Added new child:", data.name);
                                await this.syncFromDatabase();
                        }
                } catch (e) {
                        console.error("Lỗi hệ thống khi thêm bé:", e);
                }
        }

        async deleteUser(id) {
                if (!this.client) return;
                try {
                        const { error } = await this.client.from('profiles').delete().eq('id', id);
                        if (error) {
                                console.error("Lỗi xóa nhân vật:", error);
                                alert("Lỗi: Không thể xóa nhân vật này. " + error.message);
                        } else {
                                console.log(`[State] Deleted user ${id}`);
                                // Xóa cả trong cache local để UI mượt hơn
                                if (this.data.user && this.data.user.id === id) {
                                        this.data.user = JSON.parse(JSON.stringify(defaultEmptyData.user));
                                }
                                await this.syncFromDatabase();
                        }
                } catch (e) {
                        console.error("Lỗi hệ thống khi xóa:", e);
                }
        }

        async updatePin(newPin) {
                if (!this.familyId) return;
                const parentUser = this.data.leaderboard.find(u => u.role === 'parent');
                if (parentUser) {
                        await this.client.from('profiles').update({ pin_code: newPin }).eq('id', parentUser.id);
                        this.syncFromDatabase();
                }
        }

        addTask(task) {
                this.client.from('quests').insert({
                        family_id: this.familyId,
                        title: task.title,
                        description: task.desc,
                        reward: task.reward,
                        xp: task.xp,
                        sticker: task.sticker,
                        water: task.water || 0,
                        icon: task.icon,
                        category: task.category,
                        type: task.type
                }).then(() => this.syncFromDatabase());
        }

        async updateTask(id, data) {
                await this.client.from('quests').update({
                        title: data.title,
                        description: data.desc || data.title, // description in DB, desc in local object
                        reward: data.reward,
                        xp: data.xp,
                        water: data.water,
                        sticker: data.sticker,
                        icon: data.icon,
                        category: data.category,
                        type: data.type
                }).eq('id', id);
                this.syncFromDatabase();
        }

        deleteTask(id) {
                this.client.from('quests').delete().eq('id', id).then(() => this.syncFromDatabase());
        }

        // ==========================================
        // CÁC HÀM CŨ ĐỂ TƯƠNG THÍCH VỚI GIAO DIỆN HIỆN TẠI
        // ==========================================

        async growTree(waterAmount = 10) {
                if (!this.data.user || (this.data.user.water || 0) < waterAmount) return;

                // Trừ nước
                this.data.user.water -= waterAmount;

                // Ghi nhận hành động tưới cây vào database để lưu vĩnh viễn
                await this.client.from('requests').insert({
                        family_id: this.familyId,
                        profile_id: this.data.user.id,
                        item_title: 'Tưới cây thần kỳ',
                        status: 'completed',
                        type: 'tree_watering',
                        reward_water: -waterAmount
                });

                // Tăng điểm cây local - Cập nhật cả 2 nơi để đồng bộ tuyệt đối
                this.data.user.treePoints = (this.data.user.treePoints || 0) + 1;
                const lItem = this.data.leaderboard.find(p => p.id === this.data.user.id);
                if (lItem) lItem.treePoints = this.data.user.treePoints;

                this.notify();
                await this.syncLocalUserToDb();
        }

        async waterAll() {
                const water = this.data.user.water || 0;
                if (water < 10) return;

                const fullSets = Math.floor(water / 10);
                const totalWaterUsed = fullSets * 10;

                this.data.user.water -= totalWaterUsed;

                // Ghi nhận hàng loạt hành động tưới cây
                const waterBatch = Array.from({ length: fullSets }).map(() => ({
                        family_id: this.familyId,
                        profile_id: this.data.user.id,
                        item_title: 'Tưới cây thần kỳ (Tất cả)',
                        status: 'completed',
                        type: 'tree_watering',
                        reward_water: -10
                }));

                await this.client.from('requests').insert(waterBatch);

                // Tăng điểm cây local - Cập nhật cả 2 nơi để đồng bộ tuyệt đối
                this.data.user.treePoints = (this.data.user.treePoints || 0) + fullSets;
                const lItem = this.data.leaderboard.find(p => p.id === this.data.user.id);
                if (lItem) lItem.treePoints = this.data.user.treePoints;

                this.notify();
                await this.syncLocalUserToDb();
                return fullSets;
        }

        async spendGold(amount, itemTitle = null, image = null) {
                if (!this.data.user || (this.data.user.gold || 0) < amount) return false;

                this.data.user.gold -= parseInt(amount);
                this.notify();
                await this.syncLocalUserToDb();

                if (itemTitle) {
                        await this.client.from('requests').insert({
                                family_id: this.familyId,
                                profile_id: this.data.user.id,
                                item_title: itemTitle,
                                status: 'pending',
                                type: 'shop',
                                price_gold: parseInt(amount),
                                image: image
                        });
                }
                return true;
        }

        async spendPersonalityPoints(amount, itemTitle = null, image = null) {
                if (!this.data.user || (this.data.user.personalityPoints || 0) < amount) return false;

                this.data.user.personalityPoints -= parseInt(amount);
                this.notify();
                await this.syncLocalUserToDb();

                if (itemTitle) {
                        await this.client.from('requests').insert({
                                family_id: this.familyId,
                                profile_id: this.data.user.id,
                                item_title: `[POWER CARD] ${itemTitle}`,
                                status: 'pending',
                                type: 'shop',
                                price_personality: parseInt(amount),
                                image: image
                        });
                }
                return true;
        }

        addShopItem(item) {
                if (!this.familyId) return;
                this.client.from('shop_items').insert({
                        family_id: this.familyId,
                        title: item.title,
                        description: item.desc,
                        price: item.price || 0,
                        personality_price: item.personalityPrice || 0,
                        image: item.image,
                        emoji: item.emoji,
                        item_type: item.itemType || 'premium',
                        color: item.color,
                        category: item.category
                }).then(({ error }) => {
                        if (error) {
                                console.error("Lỗi thêm vật phẩm:", error);
                                alert("Lỗi khi lưu vật phẩm: " + error.message);
                        }
                        this.syncFromDatabase();
                });
        }

        addInstantPerk(perk) {
                if (!this.familyId) return;
                this.client.from('shop_items').insert({
                        family_id: this.familyId, title: perk.title, description: perk.desc, sticker_price: perk.stickerPrice, emoji: perk.emoji, item_type: 'perk', color: perk.color
                }).then(() => this.syncFromDatabase());
        }

        deleteShopItem(id) {
                this.client.from('shop_items').delete().eq('id', id).then(() => this.syncFromDatabase());
        }

        deleteInstantPerk(id) {
                this.deleteShopItem(id);
        }

        async updateShopItem(id, data) {
                await this.client.from('shop_items').update({
                        title: data.title,
                        description: data.desc || data.description,
                        price: data.price || 0,
                        personality_price: data.personalityPrice || 0,
                        image: data.image,
                        emoji: data.emoji,
                        item_type: data.itemType || 'premium',
                        category: data.category,
                        color: data.color
                }).eq('id', id);
                this.syncFromDatabase();
        }

        async updateGrowthLog(id, title, description) {
                if (!id) return false;
                const fullTitle = description ? `${title} | ${description}` : title;
                const { error } = await this.client.from('requests')
                        .update({ item_title: fullTitle })
                        .eq('id', id);

                if (error) {
                        console.error("[AppState] Error updating growth log:", error);
                        return false;
                }
                await this.syncFromDatabase();
                return true;
        }

        async unlockSticker(stickerId) {
                if (!this.data.user) return false;
                const u = this.data.user;
                if ((u.stickers || 0) <= 0) return false;

                // Đảm bảo unlockedStickers được khởi tạo
                if (!u.unlockedStickers) u.unlockedStickers = [];
                if (u.unlockedStickers.includes(stickerId)) {
                        console.warn("[Sticker] Đã mở sticker này rồi:", stickerId);
                        return false;
                }

                // --- 1. OPTIMISTIC UPDATE (Update local immediately) ---
                const oldStickers = u.stickers;
                const oldUnlocked = [...u.unlockedStickers];
                const oldTotal = u.totalStickers;

                u.stickers = u.stickers - 1;
                u.unlockedStickers = Array.from(new Set([...u.unlockedStickers, stickerId]));
                // totalStickers: số đã mở + số chưa mở (vẫn giữ nguyên vì 1 cái chuyển từ chưa mở sang đã mở)
                u.totalStickers = Math.max(u.totalStickers || 0, u.unlockedStickers.length + u.stickers);

                console.log(`[Sticker] Optimistic unlock: ${stickerId}. Lượt còn lại: ${u.stickers}`);
                this.notify(); // Cập nhật UI ngay lập tức

                // --- 2. DB BACKGROUND SYNC ---
                this._isUpdatingProfile = true;
                try {
                        console.log("[Sticker] 📤 Đang lưu vào database...");

                        const { error } = await this.client.from('profiles').update({
                                stickers: u.stickers,
                                unlocked_stickers: u.unlockedStickers,
                                total_stickers: u.totalStickers
                        }).eq('id', u.id);

                        if (error) throw error;

                        console.log("[Sticker] ✅ Database đã cập nhật xong.");
                        return true;
                } catch (error) {
                        console.error('Lỗi nghiêm trọng khi mở sticker (Rollback):', error);
                        // Hoàn tác nếu lỗi
                        u.stickers = oldStickers;
                        u.unlockedStickers = oldUnlocked;
                        u.totalStickers = oldTotal;
                        this.notify();

                        alert("Lỗi kết nối: Không thể lưu Sticker. Vui lòng kiểm tra mạng!");
                        return false;
                } finally {
                        this._isUpdatingProfile = false;
                        // Đợi lâu hơn một chút (3s) để đảm bảo server đã thực sự hoàn tất mọi trigger/index
                        setTimeout(() => this.syncFromDatabase(true), 3000);
                }
        }

        async updateInstantPerk(id, data) {
                await this.client.from('shop_items').update({
                        title: data.title,
                        description: data.desc || data.description,
                        sticker_price: data.stickerPrice,
                        emoji: data.emoji,
                        color: data.color
                }).eq('id', id);
                this.syncFromDatabase();
        }

        // --- CHALLENGE SYSTEM ACTIONS ---

        getDailyChallengeCount(userId, mode = 'all') {
                const now = new Date();
                const arenaDay = new Date(now.getTime() - (19 * 60 * 60 * 1000)).toISOString().split('T')[0];

                const challenges = this.data.challenges.filter(c => {
                        const cTime = c.createdAt ? new Date(c.createdAt).getTime() : new Date(c.date + "T12:00:00").getTime();
                        const cArenaDay = new Date(cTime - (19 * 60 * 60 * 1000)).toISOString().split('T')[0];
                        return cArenaDay === arenaDay;
                });

                if (mode === 'active') {
                        // Lượt mình đi thách đấu người khác
                        return challenges.filter(c => c.challengerId === userId).length;
                }

                if (mode === 'passive') {
                        // Lượt người khác thách đấu mình (Bao gồm cả Bot và người thật)
                        return challenges.filter(c => c.opponentId === userId).length;
                }

                return challenges.filter(c => (c.challengerId === userId || c.opponentId === userId)).length;
        }

        async createChallenge(opponentId, taskType, betAmount = 0) {
                if (!this.data.user || !this.familyId) return null;

                // 1. Kiểm tra giới hạn 3 lượt CHỦ ĐỘNG thách đấu/ngày
                if (this.getDailyChallengeCount(this.data.user.id, 'active') >= 3) {
                        console.warn("Con đã hết 3 lượt chủ động thách đấu hôm nay rồi.");
                        return { error: 'LIMIT_REACHED' };
                }

                // 2. Kiểm tra số dư vàng
                if (betAmount > (this.data.user.gold || 0)) {
                        console.warn("Con không đủ vàng để đặt cược mức này.");
                        return { error: 'INSUFFICIENT_GOLD' };
                }

                const opponent = this.data.leaderboard.find(p => p.id === opponentId);
                if (!opponent) return null;

                // 3. Kiểm tra giới hạn BỊ ĐỘNG của đối thủ (nếu là người)
                if (opponent.role !== 'bot' && this.getDailyChallengeCount(opponentId, 'passive') >= 3) {
                        console.warn("Bạn này đã nhận đủ 3 lời thách đấu hôm nay rồi, hãy chọn bạn khác nhé!");
                        return { error: 'OPPONENT_LIMIT_REACHED' };
                }

                if (opponent.role === 'bot') {
                        const today = new Date().toISOString().split('T')[0];
                        const botMatches = this.data.challenges.filter(c => c.date === today && (c.challengerId === opponentId || c.opponentId === opponentId));

                        if (botMatches.length >= 3) {
                                // Tìm xem có trận nào là Bot vs Bot không để "đuổi khéo" trận đó đi
                                const botVsBotMatch = botMatches.find(c => {
                                        const challenger = this.data.leaderboard.find(u => u.id === c.challengerId);
                                        const opponent = this.data.leaderboard.find(u => u.id === c.opponentId);
                                        return challenger && challenger.role === 'bot' && opponent && opponent.role === 'bot';
                                });

                                if (botVsBotMatch) {
                                        // Xóa trận giả để nhường chỗ cho Bé
                                        await this.client.from('challenges').delete().eq('id', botVsBotMatch.id);
                                        // Cập nhật local state ngay để bypass check tiếp theo
                                        this.data.challenges = this.data.challenges.filter(c => c.id !== botVsBotMatch.id);
                                } else {
                                        // Cả 3 trận đều là người đấu với Bot này -> Bot thực sự bận
                                        console.warn("Bạn võ sĩ này hôm nay đã nhận đủ 3 lời thách đấu từ các bạn rồi.");
                                        return { error: 'OPPONENT_LIMIT_REACHED' };
                                }
                        }
                }

                const isBot = opponent.role === 'bot';
                const botSuccess = Math.random() < 0.5;
                const today = new Date().toISOString().split('T')[0];

                // Trừ tiền đặt cược ngay lập tức (Stake)
                if (betAmount > 0) {
                        this.data.user.gold -= betAmount;
                        await this.client.from('profiles').update({ gold: this.data.user.gold }).eq('id', this.data.user.id);
                }

                // Lưu mức cược vào task_type theo format: "Tên nhiệm vụ||BET:Số tiền cược"
                const finalTaskType = betAmount > 0 ? `${taskType}||BET:${betAmount}` : taskType;

                const challengeData = {
                        family_id: this.familyId,
                        challenger_id: this.data.user.id,
                        opponent_id: opponentId,
                        task_type: finalTaskType,
                        status: 'active',
                        challenger_confirmed: null,
                        opponent_confirmed: isBot ? botSuccess : null,
                        date: today
                };

                const { data, error } = await this.client.from('challenges').insert(challengeData).select().single();

                if (error) {
                        console.error("Lỗi tạo thách đấu:", error);
                        return null;
                }

                await this.syncFromDatabase();
                return data;
        }

        // --- NEW: Bot Challenge Human ---
        async createBotChallenge(botId, taskType) {
                if (!this.data.user || !this.familyId) return null;

                // Kiểm tra giới hạn BỊ ĐỘNG của chính mình
                if (this.getDailyChallengeCount(this.data.user.id, 'passive') >= 3) {
                        return { error: 'LIMIT_REACHED' };
                }

                const today = new Date().toISOString().split('T')[0];
                const botSuccess = Math.random() < 0.6; // Bot "quyết tâm" hơn khi chủ động thách đấu

                const challengeData = {
                        family_id: this.familyId,
                        challenger_id: botId,
                        opponent_id: this.data.user.id,
                        task_type: taskType,
                        status: 'active',
                        challenger_confirmed: botSuccess, // Bot báo cáo (giả lập)
                        opponent_confirmed: null,
                        date: today
                };

                const { data, error } = await this.client.from('challenges').insert(challengeData).select().single();

                if (error) {
                        console.error("[Arena] Lỗi ghi nhận lời thách đấu từ Bot:", error);
                        return null;
                }

                await this.syncFromDatabase();
                return data;
        }

        // Bé tự báo cáo kết quả của mình (Trust-First Model)
        async selfCompleteChallenge(challengeId, isSuccess = true) {
                if (!this.data.user || !this.client) {
                        throw new Error("Thông tin người dùng chưa sẵn sàng");
                }

                const chall = this.data.challenges.find(c => c.id === challengeId);
                if (!chall) {
                        console.warn("Không tìm thấy kèo đấu:", challengeId);
                        return;
                }

                if (chall.status === 'completed') return;

                const isChallenger = String(chall.challengerId) === String(this.data.user.id);
                const updateField = isChallenger ? 'challenger_confirmed' : 'opponent_confirmed';

                // Cập nhật trạng thái tự báo cáo của bé lên DB
                const { error } = await this.client.from('challenges')
                        .update({ [updateField]: isSuccess })
                        .eq('id', challengeId);

                if (error) {
                        console.error("Lỗi xác nhận hoàn thành:", error);
                        throw error; // Throw để catch block ở UI có thể bắt được
                }

                // Đồng bộ lại dữ liệu
                await this.syncFromDatabase();
        }

        // Method mới: Công bố kết quả và tính điểm (Mở rương)
        async revealChallenge(challengeId) {
                const chall = this.data.challenges.find(c => c.id === challengeId);
                if (!chall) return null;

                const now = new Date();
                const currentHour = now.getHours();
                const todayStr = now.toISOString().split('T')[0];
                const challengeDateStr = chall.date; // Format ISO YYYY-MM-DD

                // 1. Kiểm tra giờ giới hạn (19:00)
                // Nếu trận đấu của hôm nay hoặc tương lai, chỉ được mở sau 19:00
                if (challengeDateStr >= todayStr && currentHour < 19) {
                        const waitMsg = `Kèo này phải đợi tới sau 19:00 tối nay mới mở hộp được bé ơi! Hiện tại là ${currentHour}:${now.getMinutes().toString().padStart(2, '0')}.`;
                        window.showFamilyQuestAlert && window.showFamilyQuestAlert("Chưa đến giờ G", waitMsg, "info");
                        return null;
                }

                // 2. Kiểm tra giới hạn lượt (3 Tấn công, 3 Phòng thủ)
                const user = this.data.user;
                const isChallenger = chall.challengerId === user.id;
                const roleKey = isChallenger ? 'reveal_attack' : 'reveal_defense';

                let meta = user.metadata || {};
                const arenaDay = new Date(now.getTime() - (19 * 60 * 60 * 1000)).toISOString().split('T')[0];
                const lastArenaDay = meta.last_arena_day || "";

                if (lastArenaDay !== arenaDay) {
                        meta.reveal_attack = 0;
                        meta.reveal_defense = 0;
                        meta.last_arena_day = arenaDay;
                        meta.last_reveal_reset = todayStr;
                }

                const currentCount = meta[roleKey] || 0;
                if (currentCount >= 3) {
                        window.showFamilyQuestAlert && window.showFamilyQuestAlert("Hết lượt", `Con đã hết 3 lượt ${isChallenger ? 'tấn công' : 'phòng thủ'} trong ngày hôm nay rồi! Hãy đợi sau 19:00 lượt sẽ được reset nhé.`, "warning");
                        return null;
                }

                // Nếu đã hoàn thành trước đó (đã mở rồi), trả về kết quả cũ
                if (chall.status === 'completed') {
                        const myId = this.data.user?.id;
                        const iWon = chall.winnerId === myId;
                        const isDraw = chall.winnerId === null;
                        return {
                                winnerId: chall.winnerId,
                                draw: isDraw,
                                pointsG_C: iWon ? 50 : (isDraw ? 20 : -20),
                                pointsXP_C: iWon ? 30 : (isDraw ? 20 : -10),
                                spins_C: iWon ? 3 : (isDraw ? 1 : 0),
                                pointsG_O: iWon ? -20 : (isDraw ? 20 : 50),
                                pointsXP_O: iWon ? -10 : (isDraw ? 20 : 30),
                                spins_O: iWon ? 0 : (isDraw ? 1 : 3),
                                alreadyCompleted: true
                        };
                }

                // Tăng lượt mở và lưu vào metadata
                meta[roleKey] = currentCount + 1;
                this.data.user.metadata = meta;
                await this.syncLocalUserToDb();

                // Not yet completed — finalize now
                return await this.finalizeChallenge(challengeId);
        }

        async addChallengeLog(challengeId, text) {
                const chall = this.data.challenges.find(c => c.id === challengeId);
                if (!chall) return false;

                const newLog = {
                        time: new Date().toISOString(),
                        text: text,
                        authorId: this.data.user.id,
                        authorName: this.data.user.name
                };

                const updatedLogs = [...(chall.logs || []), newLog];

                const { error } = await this.client.from('challenges')
                        .update({ logs: updatedLogs })
                        .eq('id', challengeId);

                if (!error) {
                        chall.logs = updatedLogs;
                        this.notifyListeners();
                        return true;
                }
                return false;
        }

        // Phụ huynh xác nhận/từ chối kết quả (tùy chọn — dùng cho trường hợp cần kiểm tra)
        async parentConfirmChallenge(challengeId, profileId, isSuccess) {
                const chall = this.data.challenges.find(c => c.id === challengeId);
                if (!chall || chall.status === 'completed') return;

                const isChallenger = chall.challengerId === profileId;
                const updateField = isChallenger ? 'challenger_confirmed' : 'opponent_confirmed';

                await this.client.from('challenges')
                        .update({ [updateField]: isSuccess })
                        .eq('id', challengeId);

                // Cập nhật local
                if (isChallenger) chall.challengerConfirmed = isSuccess;
                else chall.opponentConfirmed = isSuccess;

                // Kiểm tra xem đây có phải lượt cuối không
                const cDone = chall.challengerConfirmed !== null && chall.challengerConfirmed !== undefined;
                const oDone = chall.opponentConfirmed !== null && chall.opponentConfirmed !== undefined;

                if (cDone && oDone) {
                        await this.finalizeChallenge(challengeId);
                } else {
                        await this.syncFromDatabase();
                }
        }

        async finalizeChallenge(challengeId) {
                // ... (existing implementation)
                // Lấy dữ liệu mới nhất từ DB để tránh race condition
                const { data: freshChall } = await this.client.from('challenges')
                        .select('*')
                        .eq('id', challengeId)
                        .single();

                if (!freshChall || freshChall.status === 'completed') return;

                // Coi null (quên báo cáo) là false (thất bại)
                const cSuccess = !!freshChall.challenger_confirmed;
                const oSuccess = !!freshChall.opponent_confirmed;

                // Phân tích mức cược nếu có
                let betAmount = 0;
                let taskName = freshChall.task_type;
                if (taskName && taskName.includes('||BET:')) {
                        const parts = taskName.split('||BET:');
                        taskName = parts[0];
                        betAmount = parseInt(parts[1]) || 0;
                }

                let flavor = "";
                const lossPool = [
                        "Con đã làm rất tốt, nhưng đối thủ hôm nay có một pha bứt phá ngoạn mục! Đừng nản lòng nhé!",
                        "Nỗ lực tuyệt vời! Hôm nay may mắn hơi nghiêng về phía bạn của con một chút, cố gắng lần sau nhé!",
                        "Suýt soát quá! Con đã chiến đấu cực kỳ xuất sắc, chỉ thiếu một chút xíu may mắn thôi!",
                        "Ba mẹ thấy con đã rất cố gắng. Thắng thua không quan trọng bằng việc con đã hoàn thành mục tiêu!",
                        "Một trận đấu mãn nhãn! Đối thủ đã rất nỗ lực để vượt qua con hôm nay đấy."
                ];

                if (cSuccess && oSuccess) {
                        // Tỉ lệ 5% thua ngẫu nhiên dù đã hoàn thành (tăng tính kịch tính)
                        const cLuck = Math.random();
                        const oLuck = Math.random();

                        // Nếu cả hai đều rất may mắn (> 0.05) hoặc cả hai đều đen đủi (<= 0.05) -> HÒA
                        if ((cLuck > 0.05 && oLuck > 0.05) || (cLuck <= 0.05 && oLuck <= 0.05)) {
                                // HÒA: Cùng nỗ lực
                                spins_C = 1; pointsXP_C = 20; pointsG_C = 20 + betAmount;
                                spins_O = 1; pointsXP_O = 20; pointsG_O = 20;
                                flavor = "Bất phân thắng bại! Cả hai đều đã hoàn thành xuất sắc nhiệm vụ.";
                        } else if (cLuck > 0.05 && oLuck <= 0.05) {
                                // Challenger thắng nhờ may mắn (hoặc Opponent đen đủi)
                                winnerId = freshChall.challenger_id;
                                spins_C = 3; pointsXP_C = 30; pointsG_C = 50 + (betAmount * 2);
                                pointsG_O = -20; pointsXP_O = -10;
                                flavor = lossPool[Math.floor(Math.random() * lossPool.length)];
                        } else {
                                // Opponent thắng
                                winnerId = freshChall.opponent_id;
                                spins_O = 3; pointsXP_O = 30; pointsG_O = 50;
                                pointsG_C = -20; pointsXP_C = -10;
                                flavor = lossPool[Math.floor(Math.random() * lossPool.length)];
                        }
                } else if (cSuccess && !oSuccess) {
                        // Challenger thắng
                        winnerId = freshChall.challenger_id;
                        spins_C = 3; pointsXP_C = 30; pointsG_C = 50 + (betAmount * 2);
                        pointsG_O = -20; pointsXP_O = -10;
                        flavor = "Chiến thắng thuyết phục! Con đã hoàn thành xuất sắc trong khi đối thủ chưa kịp về đích.";
                } else if (!cSuccess && oSuccess) {
                        // Opponent thắng
                        winnerId = freshChall.opponent_id;
                        spins_O = 3; pointsXP_O = 30; pointsG_O = 50;
                        pointsG_C = -20; pointsXP_C = -10;
                        flavor = "Cần nỗ lực hơn nữa! Đối thủ đã về đích trước con rồi.";
                } else {
                        // Cả hai cùng thất bại
                        pointsG_C = -20; pointsXP_C = -10;
                        pointsG_O = -20; pointsXP_O = -10;
                        flavor = "Cả hai đều lỡ hẹn với chiến thắng. Hãy cùng cố gắng hơn vào ngày mai nhé!";
                }

                await this.client.from('challenges').update({
                        status: 'completed',
                        winner_id: winnerId
                }).eq('id', challengeId);

                const profiles = this._lastRawProfiles || [];
                const pC = profiles.find(p => p.id === freshChall.challenger_id);
                const pO = profiles.find(p => p.id === freshChall.opponent_id);

                if (pC && pC.role !== 'bot') {
                        await this.client.from('profiles').update({
                                gold: Math.max(0, (pC.gold || 0) + pointsG_C),
                                xp: Math.max(0, (pC.xp || 0) + pointsXP_C),
                                weekly_xp: Math.max(0, (pC.weekly_xp || 0) + pointsXP_C),
                                stickers: (pC.stickers || 0) + spins_C,
                                metadata: pC.id === this.data.user.id ? this.data.user.metadata : pC.metadata
                        }).eq('id', pC.id);
                }

                if (pO && pO.role !== 'bot') {
                        await this.client.from('profiles').update({
                                gold: Math.max(0, (pO.gold || 0) + pointsG_O),
                                xp: Math.max(0, (pO.xp || 0) + pointsXP_O),
                                weekly_xp: Math.max(0, (pO.weekly_xp || 0) + pointsXP_O),
                                stickers: (pO.stickers || 0) + spins_O,
                                metadata: pO.id === this.data.user.id ? this.data.user.metadata : pO.metadata
                        }).eq('id', pO.id);
                }

                await this.syncFromDatabase();

                return {
                        winnerId,
                        draw: (cSuccess && oSuccess) || (!cSuccess && !oSuccess),
                        pointsG_C, pointsXP_C, spins_C,
                        pointsG_O, pointsXP_O, spins_O,
                        flavor
                };
        }

        async generateBotMatches() {
                if (this._botMatchesGenerated) return;
                this._botMatchesGenerated = true; // Chặn việc spam

                const bots = (this.data.leaderboard || []).filter(p => p.role === 'bot');
                if (bots.length < 5) {
                        this._botMatchesGenerated = false;
                        return;
                }

                const today = new Date().toISOString().split('T')[0];
                const tasks = ["DẬY SỚM", "LÀM VIỆC NHÀ", "ĂN XONG SUẤT", "DỌN PHÒNG", "HỌC BÀI"];
                const newMatches = [];
                let attempts = 0;

                while (newMatches.length < 8 && attempts < 20) {
                        attempts++;
                        const availableBots = bots.filter(b => this.getDailyChallengeCount(b.id) < 3);
                        if (availableBots.length < 2) break;

                        const b1 = availableBots[Math.floor(Math.random() * availableBots.length)];
                        const availableOpponents = availableBots.filter(b => b.id !== b1.id);
                        if (availableOpponents.length === 0) continue;

                        const b2 = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
                        const task = tasks[Math.floor(Math.random() * tasks.length)];

                        const r = Math.random();
                        let challenger_confirmed = false, opponent_confirmed = false, winner_id = null;
                        if (r < 0.45) { challenger_confirmed = true; winner_id = b1.id; }
                        else if (r < 0.9) { opponent_confirmed = true; winner_id = b2.id; }
                        else { challenger_confirmed = true; opponent_confirmed = true; }

                        newMatches.push({
                                family_id: this.familyId,
                                challenger_id: b1.id,
                                opponent_id: b2.id,
                                task_type: task,
                                status: 'completed',
                                challenger_confirmed,
                                opponent_confirmed,
                                winner_id,
                                date: today
                        });

                        // Fake push to avoid over-limit in same loop
                        this.data.challenges.push({ challengerId: b1.id, opponentId: b2.id, date: today, status: 'completed' });
                }

                if (newMatches.length > 0) {
                        console.log(`[BotEngine] 🤖 Đang tạo nhanh ${newMatches.length} trận đấu giả lập...`);
                        await this.client.from('challenges').insert(newMatches);
                        await this.syncFromDatabase();
                }
        }

        async simulateBotActivity(bots, humans) {
                const luckyBot = bots[Math.floor(Math.random() * bots.length)];

                // Kiểm tra giới hạn trận đấu của luckyBot trước khi tiếp tục
                const botMatchCount = this.getDailyChallengeCount(luckyBot.id);

                let maxLevel = (humans.length > 0) ? Math.max(...humans.map(h => h.level || 1)) : 1;
                if (luckyBot.level > maxLevel + 4) return;

                const xpGain = Math.floor(Math.random() * 25) + 10;
                let newXp = (luckyBot.xp || 0) + xpGain;
                let newLvl = luckyBot.level || 1;
                let newWeeklyXp = (luckyBot.weekly_xp || 0) + xpGain;

                let newStickers = luckyBot.total_stickers || 0;
                let newGold = luckyBot.gold || 0;
                let newWater = luckyBot.water || 0;
                let newWeeklyStreak = luckyBot.weekly_streak || 0;

                // 30% cơ hội bot phát triển nhẹ. 
                // Giới hạn để Bot không bao giờ vượt quá 30 stickers (để user dễ leo top hơn)
                if (Math.random() < 0.3 && (luckyBot.total_stickers || 0) < 30) {
                        newStickers += 1;
                        newGold += Math.floor(Math.random() * 20) + 10;
                        newWater += 1;
                }

                const limitXp = Math.floor(100 * Math.pow(newLvl, 1.5));
                if (newXp >= limitXp) { newLvl++; newXp -= limitXp; }

                let newCompletionStreak = luckyBot.completion_streak || 0;
                if (Math.random() < 0.3) newCompletionStreak++;

                let newActionStreak = luckyBot.action_streak || 0;
                if (Math.random() < 0.4) newActionStreak++;

                await this.client.from('profiles').update({
                        xp: newXp,
                        level: newLvl,
                        weekly_xp: newWeeklyXp,
                        weekly_streak: newWeeklyStreak,
                        total_stickers: newStickers,
                        gold: newGold,
                        water: newWater,
                        completion_streak: newCompletionStreak,
                        action_streak: newActionStreak
                }).eq('id', luckyBot.id);

                // Mô phỏng Kèo Đấu (Win/Loss/Draw) - CHỈ tạo nếu bot chưa đủ 3 trận
                if (Math.random() < 0.8 && botMatchCount < 3) {
                        // HEALING: Bot CHỈ thách đấu Bot khác (theo yêu cầu: người ko bị nhận thách đấu từ bot)
                        const pool = bots.filter(u => u.id !== luckyBot.id && this.getDailyChallengeCount(u.id) < 3);

                        if (pool.length > 0) {
                                const opponent = pool[Math.floor(Math.random() * pool.length)];
                                const r = Math.random();
                                let wId = null;
                                if (r < 0.45) wId = luckyBot.id; // Lucky Bot thắng
                                else if (r < 0.75) wId = opponent.id; // Đối thủ thắng
                                // draw otherwise

                                await this.client.from('challenges').insert({
                                        family_id: this.familyId,
                                        challenger_id: luckyBot.id,
                                        opponent_id: opponent.id,
                                        status: 'completed',
                                        winner_id: wId,
                                        date: new Date().toISOString().split('T')[0],
                                        task_type: 'Đại chiến Arena'
                                });
                                // Cập nhật local state để UI đồng bộ ngay
                                this.data.challenges.push({
                                        challengerId: luckyBot.id,
                                        opponentId: opponent.id,
                                        date: new Date().toISOString().split('T')[0],
                                        status: 'completed'
                                });
                        }
                }
        }

        async testResetDailyTasks() {
                alert("Đang kiểm tra dữ liệu để reset...");
                if (!this.familyId) {
                        alert("Lỗi: Không tìm thấy Family ID. Vui lòng F5 trang.");
                        return;
                }

                const todayCurrent = new Date();
                const todayStr = todayCurrent.toISOString().split('T')[0];

                // Yesterday date
                const yesterdayDate = new Date(todayCurrent);
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

                // Update all task logs from today to yesterday in DB for this family
                const { error } = await this.client.from('requests')
                        .update({ created_at: yesterdayStr + 'T23:59:59Z' })
                        .eq('family_id', this.familyId)
                        .eq('type', 'task')
                        .gte('created_at', todayStr + 'T00:00:00Z');

                if (error) {
                        console.error("Test Reset Error:", error);
                        alert("Lỗi khi reset: " + error.message);
                } else {
                        alert("THÀNH CÔNG! Đã khôi phục nhiệm vụ. Hãy quay lại app Của Bé để kiểm tra nhé.");
                        await this.syncFromDatabase();
                }
        }
}

window.AppState = new StateManager();

// CÔNG CỤ DEBUG: Cho phép gọi reset từ bất cứ đâu
window.testResetDailyTasks = function () {
        if (window.AppState && window.AppState.testResetDailyTasks) {
                window.AppState.testResetDailyTasks();
        } else {
                alert("Lỗi: Hệ thống StateManager chưa sẵn sàng hoặc bị ghi đè. Vui lòng Ctrl+F5.");
        }
};

if (window.AppState) {
        window.AppState.testResetDailyTasks = window.AppState.testResetDailyTasks.bind(window.AppState);
        console.log(">>> [State Management] Đã sẵn sàng. testResetDailyTasks() đã được đăng ký.");
}

// Theme Initialization
(function () {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.documentElement.classList.add('dark');
        } else {
                document.documentElement.classList.remove('dark');
        }
})();
