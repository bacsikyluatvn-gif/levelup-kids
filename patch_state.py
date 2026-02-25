import os

new_state = """/**
 * LevelUp Kids State Management - SUPABASE EDITION
 * Quản lý dữ liệu qua Đám Mây đồng bộ thời gian thực
 */

const TREE_MILESTONES = [
    { points: 0, name: 'Đất Trống', icon: 'yard', color: 'slate' },
    { points: 10, name: 'Hạt Giống', icon: 'potted_plant', color: 'emerald' },
    { points: 50, name: 'Mầm Xanh', icon: 'spa', color: 'green' },
    { points: 150, name: 'Cây Non', icon: 'nature', color: 'teal' },
    { points: 300, name: 'Cây Trưởng Thành', icon: 'park', color: 'cyan' },
    { points: 500, name: 'Cây Đại Thụ', icon: 'forest', color: 'blue' },
    { points: 750, name: 'Cây Cổ Thụ', icon: 'eco', color: 'indigo' },
    { points: 1000, name: 'Cây Thần Kỳ', icon: 'energy_savings_leaf', color: 'purple' },
    { points: 1500, name: 'Vườn Thần Thoại', icon: 'landscape', color: 'violet' },
];
window.TREE_MILESTONES = TREE_MILESTONES;

const TITLE_MILESTONES = [
    { stickers: 10, name: 'Tân Binh Nhiệt Huyết', icon: 'emoji_events', color: 'slate' },
    { stickers: 20, name: 'Thợ Săn Tích Cực', icon: 'explore', color: 'lime' },
    { stickers: 50, name: 'Chiến Binh Chăm Chỉ', icon: 'military_tech', color: 'emerald' },
    { stickers: 100, name: 'Siêu Nhân Gia Đình', icon: 'verified_user', color: 'blue' }
];
window.TITLE_MILESTONES = TITLE_MILESTONES;

const defaultEmptyData = {
    user: { id: null, name: 'Loading...', level: 1, xp: 0, maxXp: 100, gold: 0, stickers: 0, totalStickers: 0, water: 0 },
    leaderboard: [],
    quests: [],
    shopItems: [],
    instantPerks: [],
    requests: [],
    tree: { stage: 0, streak: 0, stageName: '...' },
    title: { currentTitleName: '...' }
};

class StateManager {
    constructor() {
        this.listeners = [];
        this.data = JSON.parse(JSON.stringify(defaultEmptyData));
        this.familyId = null;
        this.client = null;

        if (window.loadSupabaseAndInit) {
            window.loadSupabaseAndInit(() => this.initDatabase());
        }
    }

    subscribe(callback) {
        this.listeners.push(callback);
        callback(this.data);
    }

    notify() {
        this.recalculateDerivedStats();
        this.listeners.forEach(cb => cb(this.data));
    }

    async initDatabase() {
        this.client = window.supabaseClient;
        const { data: { session } } = await this.client.auth.getSession();
        
        if (!session) {
            console.warn("Chưa đăng nhập Supabase, dùng dữ liệu trắng.");
            return;
        }

        const parentId = session.user.id;
        let { data: family } = await this.client.from('families').select('*').eq('parent_id', parentId).single();
        
        if (!family) {
            // First time ever! Create family and seed data
            const { data: newFamily } = await this.client.from('families').insert({ parent_id: parentId }).select().single();
            family = newFamily;
            await this.seedDemoData(family.id);
        }

        this.familyId = family.id;
        await this.syncFromDatabase();
        
        // Setup Realtime
        this.client.channel('public:*').on('postgres_changes', { event: '*', schema: 'public' }, payload => {
            this.syncFromDatabase(); // Nạp lại bảng nếu có biến động
        }).subscribe();
    }

    async seedDemoData(fId) {
        // Tạo hồ sơ mẫu
        await this.client.from('profiles').insert([
            { family_id: fId, name: 'Bố/Mẹ', role: 'parent', avatar: '../shared/assets/generated_avatars/avatar_1.png', gold: 9999 },
            { family_id: fId, name: 'Bé Sóc', role: 'child', avatar: '../shared/assets/generated_avatars/avatar_6.png' }
        ]);

        await this.client.from('quests').insert([
            { family_id: fId, title: 'Đánh răng sáng', description: 'Chải răng thật sạch 2 phút', reward: 10, xp: 20, sticker: 1 },
            { family_id: fId, title: 'Dọn đồ chơi', description: 'Cất đồ sau khi chơi', reward: 15, xp: 25, sticker: 2 }
        ]);

        await this.client.from('shop_items').insert([
            { family_id: fId, title: 'Xem TV 30p', description: 'Xem tivi', sticker_price: 5, emoji: '📺', item_type: 'perk' },
            { family_id: fId, title: 'Đồ chơi LEGO', description: 'Mua lego nhỏ', price: 300, item_type: 'premium' }
        ]);
    }

    async syncFromDatabase() {
        if (!this.familyId) return;
        
        const [profRes, questRes, reqRes, shopRes] = await Promise.all([
            this.client.from('profiles').select('*').eq('family_id', this.familyId),
            this.client.from('quests').select('*').eq('family_id', this.familyId),
            this.client.from('requests').select('*').eq('family_id', this.familyId).order('created_at', { ascending: false }),
            this.client.from('shop_items').select('*').eq('family_id', this.familyId)
        ]);

        const profiles = profRes.data || [];
        
        this.data.leaderboard = profiles.map(p => ({
            id: p.id,
            name: p.name,
            role: p.role,
            avatar: p.avatar,
            level: p.level || 1,
            gold: p.gold || 0,
            xp: p.xp || 0,
            weeklyXp: p.weekly_xp || 0,
            water: p.water || 0,
            stickers: p.stickers || 0,
            totalStickers: p.total_stickers || 0,
            actionStreak: p.action_streak || 0,
            weeklyStreak: p.weekly_streak || 0,
            completionStreak: p.completion_streak || 0,
            isCurrentUser: false
        }));

        this.data.quests = (questRes.data || []).map(q => ({
            id: q.id,
            title: q.title,
            desc: q.description,
            reward: q.reward,
            xp: q.xp,
            water: q.water,
            sticker: q.sticker,
            icon: q.icon,
            color: q.color,
            category: q.category,
            type: q.type,
            completedBy: q.completed_by || []
        }));

        this.data.shopItems = (shopRes.data || []).filter(s => s.item_type === 'premium').map(s => ({
            id: s.id, title: s.title, desc: s.description, price: s.price, image: s.image, category: s.category, color: s.color
        }));

        this.data.instantPerks = (shopRes.data || []).filter(s => s.item_type === 'perk').map(s => ({
            id: s.id, title: s.title, desc: s.description, stickerPrice: s.sticker_price, emoji: s.emoji, color: s.color
        }));

        this.data.requests = (reqRes.data || []).map(r => ({
            id: r.id,
            profileId: r.profile_id,
            user: this.getProfileName(r.profile_id, profiles),
            itemTitle: r.item_title,
            status: r.status,
            type: r.type,
            taskId: r.task_id,
            reward: r.reward_gold,
            xp: r.reward_xp,
            water: r.reward_water,
            sticker: r.reward_sticker,
            price: r.price_gold,
            stickerPrice: r.price_sticker,
            isSticker: r.is_sticker,
            rewardsGranted: r.rewards_granted,
            time: new Date(r.created_at).toLocaleString('vi-VN')
        }));

        // Khôi phục user hiện tại trên thiết bị
        let savedId = localStorage.getItem('level_up_kids_active_profile');
        let activeUser = this.data.leaderboard.find(p => p.id === savedId);
        if (!activeUser && this.data.leaderboard.length > 0) activeUser = this.data.leaderboard[0];
        
        if (activeUser) {
            activeUser.isCurrentUser = true;
            this.data.user = { ...activeUser };
        }
        
        this.notify();
    }

    getProfileName(id, profiles) {
        let p = profiles.find(x => x.id === id);
        return p ? p.name : 'Unknown';
    }

    recalculateDerivedStats() {
        const user = this.data.user;
        if (!user || user.level === undefined) return;
        user.maxXp = Math.floor(100 * Math.pow(user.level, 1.5));
        
        let streak = Math.floor((user.water || 0) / 10);
        let sIdx = 0;
        for (let i = 0; i < window.TREE_MILESTONES.length; i++) {
            if (streak >= window.TREE_MILESTONES[i].points) sIdx = i;
        }
        this.data.tree = { streak, stage: sIdx, stageName: window.TREE_MILESTONES[sIdx].name };

        let tIdx = 0;
        for (let i = 0; i < window.TITLE_MILESTONES.length; i++) {
            if ((user.totalStickers || 0) >= window.TITLE_MILESTONES[i].stickers) tIdx = i;
        }
        this.data.title = { currentTitleIndex: tIdx, currentTitleName: window.TITLE_MILESTONES[tIdx].name };
    }

    setCurrentUser(id) {
        localStorage.setItem('level_up_kids_active_profile', id);
        this.syncFromDatabase();
    }

    // ==========================================
    // ACTIONS (ASYNC SUPABASE)
    // ==========================================
    
    async completeTask(taskId) {
        if (!this.data.user || !this.data.user.id) return;
        const task = this.data.quests.find(q => q.id === taskId);
        if (!task || task.completedBy.includes(this.data.user.name)) return; // Dùng ID trên thực tế sẽ tốt hơn, nhưng tạm xài Name cho tương đồng code rẽ nhánh

        // Optimistic UI
        task.completedBy.push(this.data.user.name);
        this.addRewardsToLocalUser(task.reward, task.xp, task.water, task.sticker);
        this.notify();

        // Push to DB
        await this.client.from('quests').update({
            completed_by: task.completedBy
        }).eq('id', taskId);

        // Upload Request Log
        await this.client.from('requests').insert({
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
        });

        // Update Backend Profile 
        this.syncLocalUserToDb();
    }

    addRewardsToLocalUser(gold, xp, water, sticker) {
        const u = this.data.user;
        u.gold = Math.max(0, (u.gold || 0) + (gold || 0));
        u.xp = Math.max(0, (u.xp || 0) + (xp || 0));
        u.water = Math.max(0, (u.water || 0) + (water || 0));
        u.stickers = Math.max(0, (u.stickers || 0) + (sticker || 0));
        u.totalStickers = Math.max(0, (u.totalStickers || 0) + (sticker || 0));
        
        let req = Math.floor(100 * Math.pow(u.level, 1.5));
        while(u.xp >= req) {
            u.level += 1;
            u.xp -= req;
            req = Math.floor(100 * Math.pow(u.level, 1.5));
        }
    }

    async syncLocalUserToDb() {
        if(!this.data.user || !this.data.user.id) return;
        await this.client.from('profiles').update({
            gold: this.data.user.gold,
            xp: this.data.user.xp,
            water: this.data.user.water,
            stickers: this.data.user.stickers,
            total_stickers: this.data.user.totalStickers,
            level: this.data.user.level
        }).eq('id', this.data.user.id);
    }

    async redeemPerk(perkId) {
        const perk = this.data.instantPerks.find(p => p.id === perkId);
        if (!perk || this.data.user.stickers < perk.stickerPrice) return false;

        // Optimistic
        this.data.user.stickers -= perk.stickerPrice;
        this.notify();

        // Push
        await this.syncLocalUserToDb();
        await this.client.from('requests').insert({
            family_id: this.familyId, profile_id: this.data.user.id,
            item_title: perk.title + ' (Quà tức thì)',
            status: 'delivered', type: 'perk', is_sticker: true,
            price_sticker: perk.stickerPrice
        });
        return perk;
    }

    async redeemShopItem(itemId) {
        const item = this.data.shopItems.find(i => i.id === itemId);
        if (!item || this.data.user.gold < item.price) return false;

        this.data.user.gold -= item.price;
        this.notify();

        await this.syncLocalUserToDb();
        await this.client.from('requests').insert({
            family_id: this.familyId, profile_id: this.data.user.id,
            item_title: item.title, status: 'pending', type: 'shop',
            price_gold: item.price
        });
        return item;
    }

    async markRequestDelivered(reqId) {
        // Optimistic
        const r = this.data.requests.find(x => x.id === reqId);
        if(r) r.status = 'delivered';
        this.notify();

        await this.client.from('requests').update({ status: 'delivered' }).eq('id', reqId);
    }

    async rejectRequest(reqId) {
        const r = this.data.requests.find(x => x.id === reqId);
        if(r) {
            r.status = 'rejected';
            // Khôi phục điểm 
            const u = this.data.leaderboard.find(x => x.id === r.profileId);
            if (u) {
                if (r.type === 'task' && r.rewardsGranted) {
                    u.gold = Math.max(0, u.gold - r.reward);
                    u.xp = Math.max(0, u.xp - r.xp);
                    u.water = Math.max(0, u.water - r.water);
                    u.stickers = Math.max(0, u.stickers - r.sticker);
                } else if (r.type === 'shop') {
                    u.gold += r.price;
                } else if (r.type === 'perk') {
                    u.stickers += r.stickerPrice;
                }
                
                await this.client.from('profiles').update({
                    gold: u.gold, xp: u.xp, water: u.water, stickers: u.stickers
                }).eq('id', u.id);
            }
            this.notify();
            await this.client.from('requests').update({ status: 'rejected' }).eq('id', reqId);
        }
    }

    // Backend compatibility cho component code cũ
    addRewardsToUserByName(userName, gold, xp, water, sticker) {
        // Dummy fallback nếu code UI gọi trực tiếp
        if (this.data.user.name === userName) {
            this.addRewardsToLocalUser(gold, xp, water, sticker);
            this.syncLocalUserToDb();
            this.notify();
        }
    }

    addUser(data) {
        if(!this.familyId) return;
        this.client.from('profiles').insert({
            family_id: this.familyId, name: data.name, avatar: data.avatar, role: 'child'
        }).then(() => this.syncFromDatabase());
    }

    deleteUser(id) {
        this.client.from('profiles').delete().eq('id', id).then(() => this.syncFromDatabase());
    }

    addTask(task) {
        this.client.from('quests').insert({
            family_id: this.familyId, title: task.title, description: task.desc, 
            reward: task.reward, xp: task.xp, sticker: task.sticker, type: task.type
        }).then(() => this.syncFromDatabase());
    }

    deleteTask(id) {
        this.client.from('quests').delete().eq('id', id).then(() => this.syncFromDatabase());
    }
}

window.AppState = new StateManager();
"""

with open("/Users/admin/Downloads/00. Tai Lieu/Project Antigravity/family-quest/shared/js/state.js", "w", encoding="utf-8") as f:
    f.write(new_state)

print("STATE JS OVERWRITTEN")
