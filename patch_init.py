import os

file_path = "/Users/admin/Downloads/00. Tai Lieu/Project Antigravity/family-quest/shared/js/state.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

new_init = """
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
        let { data: family } = await this.client.from('families').select('*').eq('parent_id', parentId).single();

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
"""

# Replace the block from `async initDatabase() {` to the end of it
# Using regex to find the old initDatabase block

start_idx = content.find("async initDatabase() {")
end_idx = content.find("setupRealtimeSync() {", start_idx)

if start_idx != -1 and end_idx != -1:
    # Need to keep setupRealtimeSync, so we just replace up to just before it
    # Find the closing brace of initDatabase() before `setupRealtimeSync`
    text_to_replace = content[start_idx:end_idx]
    
    # We strip trailing spaces and newlines to be safe
    # It should be safe to just string replace it
    new_content = content[:start_idx] + new_init.strip() + "\\n\\n    " + content[end_idx:]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("PATCH_SUCCESS")
else:
    print("NOT_FOUND")
