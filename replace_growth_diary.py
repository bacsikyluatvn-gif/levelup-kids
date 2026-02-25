import re

file_path = "/Users/admin/Downloads/00. Tai Lieu/Project Antigravity/family-quest/shared/js/components.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_class = """class GrowthDiaryView extends HTMLElement {
    connectedCallback() {
        if (window.AppState) {
            window.AppState.subscribe(data => this.render(data));
            this.render(window.AppState.data);
        }
    }

    render(data) {
        if (!data || !data.user) return;
        const logs = (data.growthLogs || [])
            .filter(l => l.profileId === data.user.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const goodCount = logs.filter(l => l.type === 'behavior_good').length;
        const badCount = logs.filter(l => l.type === 'behavior_bad').length;
        const personalityScore = Math.max(0, (goodCount * 10) - (badCount * 5));

        let auraTitle = "Hạt Giống Nhân Cách";
        let auraColor = "slate";
        if (personalityScore > 100) { auraTitle = "Hào Quang Rực Rỡ"; auraColor = "amber"; }
        else if (personalityScore > 50) { auraTitle = "Trái Tim Ấm Áp"; auraColor = "emerald"; }
        else if (personalityScore > 20) { auraTitle = "Bé Ngoan Đáng Yêu"; auraColor = "blue"; }

        // Group logs by day
        const groupedLogs = {};
        logs.forEach(log => {
            const date = new Date(log.createdAt).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            if (!groupedLogs[date]) groupedLogs[date] = { GOOD: [], BAD: [] };
            if (log.type === 'behavior_good') groupedLogs[date].GOOD.push(log);
            else groupedLogs[date].BAD.push(log);
        });

        const dateKeys = Object.keys(groupedLogs);

        this.innerHTML = `
            <div class="space-y-10">
                <!-- Summary Header -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-[#2c2215] p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-${auraColor}-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    
                    <div class="flex flex-col justify-center text-center md:text-left">
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Cấp độ tâm hồn</p>
                        <h3 class="text-3xl font-black text-${auraColor}-600 dark:text-${auraColor}-400 mb-1 leading-none">${auraTitle}</h3>
                        <p class="text-sm font-bold text-slate-500">Con đã gieo trồng <span class="text-emerald-500">${goodCount} mầm tốt</span></p>
                    </div>

                    <div class="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Điểm Nhân Cách</span>
                        <div class="flex items-center gap-3">
                            <div class="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <span class="material-symbols-outlined text-3xl text-primary" style="font-variation-settings:'FILL' 1">favorite</span>
                            </div>
                            <span class="text-5xl font-black text-slate-800 dark:text-white tabular-nums">${personalityScore}</span>
                        </div>
                    </div>

                    <div class="flex flex-col justify-center p-6 space-y-3">
                        <div class="flex justify-between items-end">
                            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Tỷ lệ rèn luyện</span>
                            <span class="text-[10px] font-black text-emerald-500">${Math.round(goodCount + badCount > 0 ? (goodCount / (goodCount + badCount) * 100) : 100)}% Tốt</span>
                        </div>
                        <div class="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
                            <div class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 shadow-sm" style="width: ${goodCount + badCount > 0 ? (goodCount / (goodCount + badCount) * 100) : 100}%"></div>
                        </div>
                        <div class="flex justify-between items-center text-[10px] font-bold text-slate-500">
                            <span>${goodCount} Việc tốt</span>
                            <span>${badCount} Nhắc nhở</span>
                        </div>
                    </div>
                </div>

                <!-- Daily History Section -->
                <div class="space-y-8">
                    <div class="flex items-center justify-between">
                        <h4 class="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                            <span class="material-symbols-outlined text-primary text-3xl">Auto_Stories</span>
                            Hành Trình Trưởng Thành
                        </h4>
                    </div>

                    ${dateKeys.length === 0 ? `
                        <div class="py-20 text-center bg-white dark:bg-[#2c2215] rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-4">
                            <div class="size-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                <span class="material-symbols-outlined text-5xl text-slate-300">import_contacts</span>
                            </div>
                            <h3 class="text-xl font-black text-slate-800 dark:text-white">Trang giấy trắng</h3>
                            <p class="text-slate-500 max-w-xs mx-auto text-sm font-medium">Bé ơi hãy cùng Ba Mẹ ghi lại những khoảnh khắc tuyệt vời đầu tiên nhé!</p>
                        </div>
                    ` : dateKeys.map((date, idx) => `
                        <div class="bg-white dark:bg-[#2c2215]/50 rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <!-- Day Header -->
                            <details ${idx === 0 ? 'open' : ''} class="group">
                                <summary class="flex items-center justify-between p-6 sm:p-8 cursor-pointer list-none select-none">
                                    <div class="flex items-center gap-4">
                                        <div class="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                            <span class="material-symbols-outlined">calendar_today</span>
                                        </div>
                                        <div>
                                            <h5 class="text-lg font-black text-slate-800 dark:text-white group-open:text-primary transition-colors">${date === new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) ? 'Hôm nay' : date}</h5>
                                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">${groupedLogs[date].GOOD.length} Tốt • ${groupedLogs[date].BAD.length} Nhắc nhở</p>
                                        </div>
                                    </div>
                                    <div class="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-open:rotate-180 transition-transform duration-300">
                                        <span class="material-symbols-outlined text-slate-400">expand_more</span>
                                    </div>
                                </summary>
                                
                                <div class="px-6 sm:px-8 pb-8 pt-2">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
                                        <!-- Vertical Divider (Desktop Only) -->
                                        <div class="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800 -translate-x-px"></div>

                                        <!-- GOOD COLUMN -->
                                        <div class="space-y-4">
                                            <div class="flex items-center gap-2 mb-4">
                                                <span class="material-symbols-outlined text-emerald-500 text-sm">sunny</span>
                                                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 opacity-60">Ươm mầm (Việc tốt)</span>
                                            </div>
                                            ${groupedLogs[date].GOOD.length === 0 ? `
                                                <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 text-center italic text-xs text-slate-400 font-medium">Hôm nay chưa có việc tốt nào được ghi nhận</div>
                                            ` : groupedLogs[date].GOOD.map(log => this.renderLogItem(log, true)).join('')}
                                        </div>

                                        <!-- BAD COLUMN -->
                                        <div class="space-y-4">
                                            <div class="flex items-center gap-2 mb-4">
                                                <span class="material-symbols-outlined text-rose-500 text-sm">dark_mode</span>
                                                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 opacity-60">Rèn luyện (Cần sửa)</span>
                                            </div>
                                            ${groupedLogs[date].BAD.length === 0 ? `
                                                <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 text-center italic text-xs text-slate-400 font-medium">Tuyết vời! Không có nhắc nhở nào</div>
                                            ` : groupedLogs[date].BAD.map(log => this.renderLogItem(log, false)).join('')}
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderLogItem(log, isGood) {
        const behaviorList = window.GROWTH_BEHAVIORS[isGood ? 'GOOD' : 'BAD'] || [];
        const behavior = behaviorList.find(b => b.text === log.itemTitle);
        const emoji = behavior ? behavior.emoji : (isGood ? '🌟' : '⚠️');

        return `
            <div class="group/item p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1a140c] border border-slate-100 dark:border-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md transition-all">
                <div class="flex items-start gap-4">
                    <span class="text-3xl sm:text-4xl group-hover/item:scale-110 transition-transform duration-300 select-none">${emoji}</span>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start mb-1">
                            <h6 class="font-black text-slate-800 dark:text-white text-sm sm:text-base leading-tight truncate mr-2">${log.itemTitle}</h6>
                            <span class="text-[9px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-lg shrink-0">${log.time ? log.time.split(' ')[0] : '...'}</span>
                        </div>
                        
                        <div class="flex flex-wrap gap-1.5 mt-2">
                            ${log.reward !== 0 ? `
                                <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black ${log.reward > 0 ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'}">
                                    <span class="material-symbols-outlined text-[12px]" style="font-variation-settings:'FILL' 1">monetization_on</span>
                                    ${log.reward > 0 ? '+' : ''}${log.reward}
                                </div>
                            ` : ''}
                            ${log.xp !== 0 ? `
                                <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black ${log.xp > 0 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}">
                                    <span class="material-symbols-outlined text-[12px]">military_tech</span>
                                    ${log.xp > 0 ? '+' : ''}${log.xp}
                                </div>
                            ` : ''}
                            ${log.water > 0 ? `
                                <div class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black">
                                    <span class="material-symbols-outlined text-[12px]" style="font-variation-settings:'FILL' 1">water_drop</span>
                                    +${log.water}
                                </div>
                            ` : ''}
                            ${log.sticker > 0 ? `
                                <div class="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-black">
                                    <span class="material-symbols-outlined text-[11px] transform rotate-12" style="font-variation-settings:'FILL' 1">sell</span>
                                    +${log.sticker}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('growth-diary-view', GrowthDiaryView);"""

pattern = r"class GrowthDiaryView extends HTMLElement \{.*?customElements\.define\('growth-diary-view', GrowthDiaryView\);"
content = re.sub(pattern, new_class, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Replacement complete.")
