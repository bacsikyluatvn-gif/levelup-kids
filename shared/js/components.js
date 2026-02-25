/**
 * LevelUp Kids Component Library
 * Sử dụng Web Components để tạo giao diện tái sử dụng
 */

// Global theme management
window.toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// Global Utility for beautiful popups
window.showLevelUpAlert = (title, message, type = 'success', onConfirm = null) => {
    const existing = document.getElementById('lu-alert-modal');
    if (existing) existing.remove();

    const config = {
        success: { icon: 'check_circle', color: 'emerald', bg: 'from-emerald-400 to-teal-500' },
        error: { icon: 'error', color: 'rose', bg: 'from-rose-400 to-rose-600' },
        warning: { icon: 'warning', color: 'amber', bg: 'from-amber-400 to-orange-500' },
        info: { icon: 'info', color: 'blue', bg: 'from-blue-400 to-indigo-500' }
    }[type] || { icon: 'notifications', color: 'primary', bg: 'from-primary to-orange-500' };

    const modal = document.createElement('div');
    modal.id = 'lu-alert-modal';
    modal.className = 'fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300';
    modal.innerHTML = `
        <div class="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
            <div class="h-2 bg-gradient-to-r ${config.bg}"></div>
            <div class="p-10 text-center space-y-6">
                <div class="size-20 bg-${config.color}-50 rounded-[2rem] flex items-center justify-center mx-auto ring-8 ring-${config.color}-50/50">
                    <span class="material-symbols-outlined text-4xl text-${config.color}-500">${config.icon}</span>
                </div>
                <div class="space-y-2">
                    <h3 class="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">${title}</h3>
                    <p class="text-sm font-medium text-slate-500 leading-relaxed">${message}</p>
                </div>
                <button id="lu-alert-ok" class="w-full py-4 bg-${config.color === 'primary' ? 'primary' : config.color + '-500'} text-white font-black rounded-2xl hover:opacity-90 shadow-lg shadow-${config.color}-200 transition-all uppercase tracking-widest text-sm">
                    Đồng ý
                </button>
            </div>
        </div>
    `;

    modal.querySelector('#lu-alert-ok').onclick = () => {
        modal.classList.add('fade-out');
        setTimeout(() => {
            modal.remove();
            if (onConfirm) onConfirm();
        }, 300);
    };

    modal.addEventListener('click', (e) => { if (e.target === modal) modal.querySelector('#lu-alert-ok').click(); });
    document.body.appendChild(modal);
};

class AppHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (window.AppState) {
            window.AppState.subscribe(data => this.render(data));
            this.render(window.AppState.data);
        }
    }

    render(data) {
        const title = this.getAttribute('title') || 'LevelUp Kids';
        const type = this.getAttribute('type') || 'child';

        this.innerHTML = `
            <header class="sticky top-0 z-50 bg-white/90 dark:bg-[#1a140c]/90 backdrop-blur-md border-b border-[#e6e1db] dark:border-[#3a2e22] px-6 py-4 shadow-sm">
                <div class="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-3 cursor-pointer" onclick="navigateWithTransition('../index.html')">
                        <div class="bg-primary/20 p-2 rounded-xl text-primary">
                            <span class="material-symbols-outlined text-3xl">castle</span>
                        </div>
                        <h1 class="text-2xl font-bold tracking-tight text-text-main dark:text-white">${title}</h1>
                    </div>
                    ${type === 'child' ? this.getChildStats(data) : this.getParentStats(data)}
                </div>
            </header>
        `;
    }

    getChildStats(data) {
        const user = data.user;
        const xpPercent = Math.floor((user.xp / user.maxXp) * 100);
        return `
            <div class="flex flex-1 w-full md:w-auto items-center justify-center md:justify-end gap-4 md:gap-8">
                <div class="flex flex-col w-full max-w-[200px] gap-1">
                    <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <span>CẤP ${user.level}</span>
                        <span>${user.xp}/${user.maxXp} XP</span>
                    </div>
                    <div class="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                        <div class="h-full bg-gradient-to-r from-yellow-300 to-primary transition-all duration-500" style="width: ${xpPercent}%"></div>
                    </div>
                </div>
                <div class="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-4 py-1.5 rounded-full border border-orange-200 dark:border-orange-800/30 transition-all hover:scale-110" title="Vàng (để đổi phần thưởng lớn)">
                    <span class="material-symbols-outlined text-[18px] text-orange-500" style="font-variation-settings:'FILL' 1">monetization_on</span>
                    <span class="font-bold text-orange-700 dark:text-orange-400 tabular-nums">${user.gold}</span>
                </div>
                <div class="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-1.5 rounded-full border border-purple-200 dark:border-purple-800/30 transition-all hover:scale-110" title="Huy hiệu (để đổi đặc quyền nhanh)">
                    <span class="material-symbols-outlined text-[18px] text-purple-500 transform rotate-12">sell</span>
                    <span class="font-bold text-purple-700 dark:text-purple-400 tabular-nums">${user.stickers || 0}</span>
                </div>
                <div class="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800/30 transition-all hover:scale-110" onclick="window.navigateWithTransition('../tree-growth/index.html')" title="Giọt nước (để tưới cây)">
                    <span class="material-symbols-outlined text-[18px] text-blue-500" style="font-variation-settings:'FILL' 1">water_drop</span>
                    <span class="font-bold text-blue-700 dark:text-blue-400 tabular-nums">${user.water || 0}</span>
                </div>
                <div class="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                    <button onclick="window.toggleDarkMode()" class="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 hover:text-primary transition-all">
                        <span class="material-symbols-outlined dark:hidden">dark_mode</span>
                        <span class="material-symbols-outlined hidden dark:block text-yellow-500">light_mode</span>
                    </button>
                    <div class="text-right flex flex-col justify-center">
                        <p class="text-sm font-bold dark:text-white text-slate-800">${user.name || 'Nhà thám hiểm'}</p>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${data.title.currentTitleName || 'Tân Binh'}</p>
                    </div>
                    <div class="h-10 w-10 shrink-0 rounded-full ring-2 ring-primary/20 bg-cover bg-center shadow-md bg-slate-300" 
                         style="background-image: url('${user.avatar}')">
                    </div>
                    <button onclick="window.location.href='../portal/index.html'" class="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 hover:text-primary transition-all group" 
                            title="Đổi tài khoản">
                        <span class="material-symbols-outlined group-hover:rotate-12 transition-transform">logout</span>
                    </button>
                </div>
            </div>
        `;
    }

    getParentStats(data) {
        return `
            <div class="flex items-center gap-4">
                <button onclick="window.openBehaviorLogModal()" class="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    <span class="material-symbols-outlined text-xl">auto_awesome</span>
                    <span class="hidden sm:inline">GHI NHẬN HÀNH ĐỘNG</span>
                </button>
                <notification-bell></notification-bell>
                <div class="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                    <button onclick="window.toggleDarkMode()" class="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 hover:text-primary transition-all">
                        <span class="material-symbols-outlined dark:hidden">dark_mode</span>
                        <span class="material-symbols-outlined hidden dark:block text-yellow-500">light_mode</span>
                    </button>
                    <div class="text-right hidden sm:block">
                        <p class="text-sm font-bold dark:text-white">Admin Bố</p>
                        <p class="text-xs text-slate-500">Người quản trị</p>
                    </div>
                    <div class="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white">
                        <span class="material-symbols-outlined">person</span>
                    </div>
                    <button onclick="window.location.href='../login/index.html'" class="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 hover:text-primary transition-all group" 
                            title="Đổi tài khoản">
                        <span class="material-symbols-outlined group-hover:rotate-12 transition-transform">logout</span>
                    </button>
                </div>
            </div>
            <behavior-log-modal></behavior-log-modal>
        `;
    }
}

class QuestCard extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        const title = this.getAttribute('title') || 'Nhiệm vụ';
        const reward = this.getAttribute('reward') || '10';
        const xp = this.getAttribute('xp') || '20';
        const icon = this.getAttribute('icon') || 'task';
        const desc = this.getAttribute('desc') || '';
        const color = this.getAttribute('color') || 'blue';
        const sticker = parseInt(this.getAttribute('sticker') || '0');
        const isCompleted = this.getAttribute('status') === 'completed';

        if (isCompleted) {
            this.innerHTML = `
                <div class="bg-[#f0fdf4] dark:bg-[#152e1a] rounded-3xl border-2 border-green-200 dark:border-green-800 p-6 shadow-sm relative overflow-hidden opacity-90 h-full flex flex-col transition-all duration-500">
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <div class="bg-white/90 dark:bg-black/80 backdrop-blur-sm px-6 py-3 rounded-2xl transform rotate-[-5deg] border-4 border-green-500 shadow-xl scale-110">
                            <span class="text-green-600 dark:text-green-400 font-black text-2xl uppercase tracking-widest leading-none">ĐÃ XONG!</span>
                        </div>
                    </div>
                    <div class="relative z-10 flex flex-col h-full blur-[2px]">
                        <div class="bg-green-100 dark:bg-green-900/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-green-600 dark:text-green-400 shadow-sm">
                            <span class="material-symbols-outlined text-3xl">${icon}</span>
                        </div>
                        <div class="flex items-center gap-2 mb-1 mt-1">
                            <h3 class="text-xl font-bold dark:text-white">${title}</h3>
                            ${this.getAttribute('type') === 'optional' ?
                    '<span class="px-2 py-0.5 bg-purple-100 text-purple-700 border border-purple-200 rounded text-[9px] uppercase tracking-wider font-bold">🟣 Tùy chọn</span>' :
                    '<span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[9px] uppercase tracking-wider font-bold">🟢 Bắt buộc</span>'
                }
                        </div>
                        <p class="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-grow">${desc}</p>
                        <div class="flex gap-2 mb-6 flex-wrap">
                            <span class="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-xs font-bold border border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30">
                                <span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' 1">monetization_on</span> +${reward}
                            </span>
                            ${sticker > 0 ? `
                            <span class="inline-flex items-center gap-1 bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-xs font-bold border border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30">
                                <span class="material-symbols-outlined text-[14px] transform rotate-12" style="font-variation-settings:'FILL' 1">sell</span> +${sticker}
                            </span>
                            ` : ''}
                            <span class="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg text-xs font-bold border border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/30">
                                <span class="material-symbols-outlined text-sm">military_tech</span> +${xp}
                            </span>
                            ${this.getAttribute('water') && parseInt(this.getAttribute('water')) > 0 ? `
                            <span class="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30">
                                <span class="material-symbols-outlined text-sm inline" style="font-variation-settings:'FILL' 1">water_drop</span> +${this.getAttribute('water')}
                            </span>
                            ` : ''}
                        </div>
                        <button class="w-full py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-default" disabled>
                            <span>Hoàn thành</span>
                            <span class="material-symbols-outlined justify-center text-lg">check_circle</span>
                        </button>
                    </div>
                </div>
            `;
        } else {
            this.innerHTML = `
                <div class="gamified-card bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-sm overflow-hidden relative dark:bg-[#2c2215] dark:border-slate-800 h-full flex flex-col transition-all duration-300">
                    <div class="relative z-10 flex flex-col h-full">
                        <div class="bg-${color}-100 dark:bg-${color}-900/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-${color}-600 dark:text-${color}-400">
                            <span class="material-symbols-outlined text-3xl">${icon}</span>
                        </div>
                        <div class="flex items-center gap-2 mb-1 mt-1">
                            <h3 class="text-xl font-bold dark:text-white">${title}</h3>
                            ${this.getAttribute('type') === 'optional' ?
                    '<span class="px-2 py-0.5 bg-purple-100 text-purple-700 border border-purple-200 rounded text-[9px] uppercase tracking-wider font-bold">🟣 Tùy chọn</span>' :
                    '<span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[9px] uppercase tracking-wider font-bold">🟢 Bắt buộc</span>'
                }
                        </div>
                        <p class="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-grow">${desc}</p>
                        <div class="flex gap-2 mb-6 flex-wrap">
                            <span class="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-xs font-bold border border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30">
                                <span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' 1">monetization_on</span> +${reward}
                            </span>
                            ${sticker > 0 ? `
                            <span class="inline-flex items-center gap-1 bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-xs font-bold border border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30">
                                <span class="material-symbols-outlined text-[14px] transform rotate-12" style="font-variation-settings:'FILL' 1">sell</span> +${sticker}
                            </span>
                            ` : ''}
                            <span class="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg text-xs font-bold border border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/30">
                                <span class="material-symbols-outlined text-sm">military_tech</span> +${xp}
                            </span>
                            ${this.getAttribute('water') && parseInt(this.getAttribute('water')) > 0 ? `
                            <span class="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30">
                                <span class="material-symbols-outlined text-sm inline" style="font-variation-settings:'FILL' 1">water_drop</span> +${this.getAttribute('water')}
                            </span>
                            ` : ''}
                        </div>
                        <button class="btn-complete btn-pressable w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 mt-auto">
                            <span>Con đã xong!</span>
                            <span class="material-symbols-outlined">check_circle</span>
                        </button>
                    </div>
                </div>
            `;

            this.querySelector('.btn-complete').addEventListener('click', () => {
                const taskId = this.getAttribute('task-id');

                // Re-render internally as completed for animation
                this.setAttribute('status', 'completed');
                this.render();

                // Fire Confetti immediately
                if (window.confetti) {
                    const rect = this.getBoundingClientRect();
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
                        colors: ['#ee9d2b', '#10b981', '#3b82f6', '#fcd34d'],
                        zIndex: 9999
                    });
                } else {
                    const script = document.createElement('script');
                    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
                    script.onload = () => {
                        const rect = this.getBoundingClientRect();
                        confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
                            colors: ['#ee9d2b', '#10b981', '#3b82f6', '#fcd34d'],
                            zIndex: 9999
                        });
                    };
                    document.head.appendChild(script);
                }

                // Update AppState after delay so it gets removed dynamically
                setTimeout(() => {
                    const reward = parseInt(this.getAttribute('reward') || '0');
                    const xp = parseInt(this.getAttribute('xp') || '0');
                    const sticker = parseInt(this.getAttribute('sticker') || '0');
                    const water = parseInt(this.getAttribute('water') || '0');

                    if (window.AppState) {
                        if (taskId) {
                            window.AppState.completeTask(taskId);
                        } else {
                            window.AppState.addRewardsToLocalUser(reward, xp, water, sticker);
                        }
                    }
                }, 500);

            });
        }
    }
}

class ShopItem extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || 'Phần thưởng';
        const price = this.getAttribute('price') || '100';
        const image = this.getAttribute('image') || '';
        const desc = this.getAttribute('desc') || '';
        const color = this.getAttribute('color') || 'blue';

        this.render();
        window.AppState.subscribe(() => this.render());
    }

    render() {
        const title = this.getAttribute('title') || 'Phần thưởng';
        const price = parseInt(this.getAttribute('price') || '100');
        const image = this.getAttribute('image') || '';
        const desc = this.getAttribute('desc') || '';
        const color = this.getAttribute('color') || 'blue';

        const currentGold = window.AppState.data.user.gold;
        const canAfford = currentGold >= price;

        this.innerHTML = `
            <div class="group bg-white dark:bg-[#2c2215] rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm card-hover-effect flex flex-col h-full transition-all hover:shadow-lg">
                <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-${color}-50 flex items-center justify-center">
                    ${(image && image !== 'null' && image !== 'undefined' && image !== '')
                ? `<img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="${image}" alt="${title}" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\'material-symbols-outlined text-4xl text-slate-300\'>redeem</span>'">`
                : `<span class="material-symbols-outlined text-4xl text-slate-300">redeem</span>`
            }
                </div>
                <div class="flex flex-col flex-grow">
                    <h3 class="text-xl font-bold text-slate-800 dark:text-white leading-tight mb-1">${title}</h3>
                    <p class="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">${desc}</p>
                    <div class="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50">
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Giá</span>
                            <div class="flex items-center gap-1 text-primary font-black text-xl">
                                ${price} <span class="material-symbols-outlined text-lg">monetization_on</span>
                            </div>
                        </div>
                        
                        ${canAfford ? `
                            <button class="btn-buy btn-pressable w-full py-3 bg-primary text-white font-bold rounded-xl shadow-btn-3d flex items-center justify-center gap-2">
                                <span>Đổi Quà</span>
                                <span class="material-symbols-outlined">redeem</span>
                            </button>
                        ` : `
                            <button class="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border-2 border-dashed border-slate-200 dark:border-slate-700" disabled>
                                <span>Thêm ${price - currentGold}</span>
                                <span class="material-symbols-outlined text-sm">lock</span>
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;

        const btn = this.querySelector('.btn-buy');
        if (btn) {
            btn.addEventListener('click', () => {
                this.showConfirmDialog(title, price, image, () => {
                    if (window.AppState.spendGold(price, title, image)) {
                        this.showSuccess();
                    }
                });
            });
        }
    }

    showConfirmDialog(title, price, image, onConfirm) {
        const existing = document.getElementById('shop-confirm-modal');
        if (existing) existing.remove();

        const modalHtml = `
            <div id="shop-confirm-modal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 opacity-0 pointer-events-none">
                <div id="shop-confirm-content" class="bg-white dark:bg-[#2c2215] w-full max-w-sm rounded-[2rem] p-6 text-center shadow-2xl transform scale-90 transition-transform duration-300 relative overflow-hidden tracking-tight">
                    <div class="size-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 relative drop-shadow-sm">
                        <span class="material-symbols-outlined text-[40px] text-orange-500">help</span>
                        <div class="absolute -right-1 -bottom-1 bg-white dark:bg-[#2c2215] rounded-full p-1 leading-none shadow-sm">
                            <span class="material-symbols-outlined text-[16px] text-primary">monetization_on</span>
                        </div>
                    </div>
                    <h3 class="text-xl font-black text-slate-800 dark:text-white mb-2">Đổi rương kho báu?</h3>
                    <p class="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">Bạn sẽ dùng <b class="text-primary">${price} Vàng</b> để lấy <b>${title}</b>. Bạn có chắc chắn muốn đổi không?</p>
                    <div class="flex gap-3">
                        <button id="shop-confirm-cancel" class="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none">Để sau</button>
                        <button id="shop-confirm-yes" class="flex-1 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-btn-3d active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-1.5 focus:outline-none">
                            Đồng ý
                            <span class="material-symbols-outlined text-sm">check</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('shop-confirm-modal');
        const content = document.getElementById('shop-confirm-content');

        // Show animation
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            content.classList.remove('scale-90');
        });

        const closeMod = () => {
            modal.classList.add('opacity-0', 'pointer-events-none');
            content.classList.add('scale-90');
            setTimeout(() => modal.remove(), 300);
        };

        document.getElementById('shop-confirm-cancel').addEventListener('click', closeMod);

        document.getElementById('shop-confirm-yes').addEventListener('click', () => {
            closeMod();
            setTimeout(onConfirm, 200); // Wait for modal to shrink
        });
    }

    showSuccess() {
        // Tận dụng modal đã có hoặc tạo mới
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.children[0].classList.remove('scale-90');
        } else {
            alert('Đổi quà thành công! Hãy báo bố mẹ nhé!');
        }
    }
}

class TreeView extends HTMLElement {
    connectedCallback() {
        if (window.AppState) {
            window.AppState.subscribe(data => this.render(data));
            this.render(window.AppState.data);
        }
    }

    render(data) {
        const tree = data.tree;
        const milestones = window.TREE_MILESTONES || [];
        const currentStage = milestones[tree.stage] || milestones[0] || { points: 0 };
        const nextStage = milestones[tree.stage + 1];
        const isMaxStage = !nextStage;

        // Tiến độ trong giai đoạn hiện tại (không phải tổng)
        const stageStart = currentStage.points;
        const stageEnd = nextStage ? nextStage.points : currentStage.points;
        const stageRange = stageEnd - stageStart;
        const stageProgress = stageRange > 0 ? Math.min(100, Math.floor(((tree.streak - stageStart) / stageRange) * 100)) : 100;
        const pointsLeft = isMaxStage ? 0 : (stageEnd - tree.streak);
        const waterLeft = pointsLeft * 10;

        // Màu sắc theo stage
        const colorMap = {
            slate: { bg: 'bg-slate-400', text: 'text-slate-500', light: 'bg-slate-50 dark:bg-slate-900/20', border: 'border-slate-200', ring: 'ring-slate-300' },
            emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200', ring: 'ring-emerald-400' },
            green: { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200', ring: 'ring-green-400' },
            teal: { bg: 'bg-teal-500', text: 'text-teal-600', light: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-200', ring: 'ring-teal-400' },
            cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', light: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-200', ring: 'ring-cyan-400' },
            blue: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200', ring: 'ring-blue-400' },
            indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200', ring: 'ring-indigo-400' },
            purple: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200', ring: 'ring-purple-400' },
            violet: { bg: 'bg-violet-500', text: 'text-violet-600', light: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200', ring: 'ring-violet-400' },
        };
        const c = colorMap[currentStage.color] || colorMap['emerald'];

        // --- Horizontal Stepper Timeline ---
        const timelineNodes = milestones.map((m, i) => {
            const mc = colorMap[m.color] || colorMap['slate'];
            const isPast = i < tree.stage;
            const isActive = i === tree.stage;
            const isLocked = i > tree.stage;
            const isLast = i === milestones.length - 1;
            const isFirst = i === 0;

            // Circle style
            const circleBg = (isPast || isActive) ? mc.bg : 'bg-slate-200 dark:bg-slate-700';
            const ringClass = isActive ? `ring-4 ${mc.ring} ring-offset-2` : '';
            const scaleClass = isActive ? 'scale-125 shadow-xl' : 'shadow-md';

            // Icon inside circle
            const iconHtml = isActive
                ? `<span class="material-symbols-outlined text-white text-base" style="font-variation-settings:'FILL' 1">${m.icon}</span>`
                : isPast
                    ? `<span class="material-symbols-outlined text-white text-sm" style="font-variation-settings:'FILL' 1">check</span>`
                    : `<span class="material-symbols-outlined text-slate-400 text-sm">lock</span>`;

            // Connector line AFTER this node (except last)
            const lineAfter = !isLast
                ? `<div class="absolute top-[20px] left-[calc(50%+20px)] right-[calc(-50%+20px)] h-1.5 ${isPast ? mc.bg : 'bg-slate-200 dark:bg-slate-700'} transition-all duration-700 z-0"></div>`
                : '';

            // Labels
            const nameClass = isActive ? `font-black ${mc.text}` : isPast ? 'font-bold text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500';
            const reqText = m.points === 0 ? 'Xuất phát' : `${m.points} điểm`;
            const reqSubText = m.points > 0 ? `${m.points * 10} 💧` : '';
            const reqColor = isPast || isActive ? mc.text : 'text-slate-400';

            return `
            <li class="flex-1 flex flex-col items-center relative min-w-[72px]">
                ${lineAfter}
                <div class="w-10 h-10 rounded-full ${circleBg} ${ringClass} border-[3px] border-white dark:border-slate-950 flex items-center justify-center z-10 relative ${scaleClass} transition-all duration-300">
                    ${iconHtml}
                </div>
                <div class="mt-3 text-center px-1">
                    <p class="text-[10px] leading-tight ${nameClass}">${m.name}</p>
                    <p class="text-[9px] font-bold mt-0.5 ${reqColor}">${reqText}</p>
        ${reqSubText ? `<p class="text-[8px] text-slate-400">${reqSubText}</p>` : ''}
                </div>
            </li>`;
        }).join('');

        // --- RENDER PREMIUM LIVING TREE ---
        const renderVisualTree = () => {
            const stage = tree.stage;
            const progressScale = 1 + (stageProgress / 400);
            const imgPath = `../shared/assets/tree/stage_${stage}-removebg-preview.png`;

            return `
                <div id="living-tree-container" class="relative w-full h-full flex items-center justify-center transition-all duration-1000 overflow-visible" 
                     style="perspective: 1000px; transform: scale(${progressScale})">
                    
                    <!-- The Living Organic Tree -->
                    <div class="tree-wrapper relative w-full h-full flex items-end justify-center pb-8 overflow-visible cursor-pointer active:scale-95 transition-transform"
                         style="transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d;">
                        
                        <img id="main-tree-img" 
                             src="${imgPath}" 
                             alt="${tree.stageName}" class="max-h-full max-w-full select-none pointer-events-none"
                             style="filter: drop-shadow(0 30px 60px rgba(0,0,0,0.4)); transform-origin: bottom center; transition: filter 0.5s ease;"
                             onerror="this.style.opacity='0'; this.nextElementSibling.style.display='flex';"
                             onload="this.style.opacity='1'; this.nextElementSibling.style.display='none';" />
                        
                        <!-- Pulse Ring (Click Feedback) -->
                        <div class="absolute inset-x-0 bottom-24 mx-auto w-1 h-1 bg-white rounded-full opacity-0 pointer-events-none" id="click-pulse"></div>

                        <!-- Premium Glow Aura -->
                        <div class="absolute inset-x-0 bottom-24 mx-auto w-64 h-80 bg-emerald-400/10 blur-[90px] rounded-full pointer-events-none animate-pulse-slow"></div>

                        <!-- Fallback Loader -->
                        <div class="absolute inset-0 flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-emerald-500/20" style="display: none;">
                            <div class="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                        </div>
                    </div>

                    <!-- Ambient Magic Env -->
                    <div class="magic-layer absolute inset-0 pointer-events-none overflow-visible">
                        <div class="firefly" style="top: 25%; left: 15%; --dx: 50px; --dy: -80px; --dur: 15s"></div>
                        <div class="firefly" style="top: 15%; left: 80%; --dx: -60px; --dy: -100px; --dur: 12s"></div>
                        <div class="firefly" style="top: 50%; left: 90%; --dx: -40px; --dy: -120px; --dur: 18s"></div>
                        <div class="firefly" style="top: 70%; left: 10%; --dx: 30px; --dy: -60px; --dur: 14s"></div>
                        <div class="firefly" style="top: 35%; left: 45%; --dx: 20px; --dy: -140px; --dur: 16s"></div>
                    </div>
                </div>`;
        };

        this.innerHTML = `
            <style>
                @keyframes organic-breathe {
                    0%, 100% { transform: scale(1) translateY(0); }
                    50% { transform: scale(1.03) translateY(-10px); }
                }
                .tree-wrapper { 
                    animation: organic-breathe 8s ease-in-out infinite;
                }
                
                @keyframes firefly-float {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0; }
                    25% { opacity: 1; transform: translate(var(--dx), var(--dy)) scale(1.5); }
                    50% { opacity: 0.7; transform: translate(calc(var(--dx) * -0.5), calc(var(--dy) * 1.5)) scale(1); }
                    75% { opacity: 1; transform: translate(var(--dx), calc(var(--dy) * 0.5)) scale(1.3); }
                }
                .firefly {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: #FFFDE7;
                    border-radius: 50%;
                    box-shadow: 0 0 20px #FFF176, 0 0 40px #FFEE58, 0 0 60px rgba(255, 238, 88, 0.4);
                    animation: firefly-float var(--dur) ease-in-out infinite;
                    z-index: 40;
                }
                
                @keyframes leaf-explosion {
                    0% { transform: translate(0, 0) rotate(0) scale(0); opacity: 0; }
                    20% { opacity: 1; scale(1.5); }
                    100% { transform: translate(var(--tx), var(--ty)) rotate(var(--tr)) scale(0.2); opacity: 0; }
                }
                .leaf-burst {
                    position: absolute;
                    width: 20px;
                    height: 24px;
                    background: linear-gradient(135deg, #4ADE80 0%, #16A34A 100%);
                    border-radius: 100% 0 100% 0;
                    animation: leaf-explosion 2s cubic-bezier(0.1, 0, 0.3, 1) forwards;
                    z-index: 100;
                    filter: drop-shadow(0 5px 10px rgba(0,0,0,0.2));
                }

                .garden-backdrop {
                    background: radial-gradient(circle at center, #f0fdf4 0%, #ffffff 100%);
                    box-shadow: inset 0 0 150px rgba(16, 185, 129, 0.05);
                }
                .dark .garden-backdrop {
                    background: radial-gradient(circle at center, #064e3b 0%, #022c22 100%);
                }
                
                @keyframes squash-stretch {
                    0% { transform: scale(1, 1); }
                    20% { transform: scale(1.15, 0.8); }
                    50% { transform: scale(0.85, 1.15); }
                    80% { transform: scale(1.05, 0.95); }
                    100% { transform: scale(1, 1); }
                }
                .tree-impact { animation: squash-stretch 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.1); }
                }
                .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
            </style>
            
            <section id="tree-garden-container" class="garden-backdrop relative overflow-hidden rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center gap-12 transition-all duration-700">
                <div class="absolute top-10 left-10 opacity-10 dark:opacity-5 scale-150 rotate-12 select-none">🍃</div>
                <div class="absolute bottom-20 right-10 opacity-10 dark:opacity-5 scale-[2] -rotate-12 select-none">🌸</div>
                
                <div id="tree-visual-area" class="relative h-96 w-full max-w-lg flex items-end justify-center z-10 overflow-visible">
                    <div class="watering-can text-7xl opacity-0 pointer-events-none absolute z-50">🚿</div>
                    <div class="visual-content w-full h-full flex items-center justify-center overflow-visible">
                        ${renderVisualTree()}
                    </div>
                </div>
                
                <!-- Info & Interaction -->
                <div class="w-full flex flex-col md:flex-row items-center gap-8 z-10 px-6">
                    <div class="flex-1 text-center md:text-left">
                        <div class="inline-flex items-center gap-3 bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest mb-4 border border-emerald-200/50 backdrop-blur-sm">
                            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            ${tree.stageName} • GĐ ${tree.stage + 1}
                        </div>
                        <h2 class="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Cây Xanh Thần Kỳ ✨</h2>
                        
                        <div class="flex items-center gap-4 mb-6">
                            <div class="flex -space-x-2">
                                ${Array.from({ length: 3 }).map(() => `<div class="w-8 h-8 rounded-full border-2 border-white bg-slate-200 animate-pulse"></div>`).join('')}
                            </div>
                            <p class="text-slate-500 dark:text-slate-400 font-medium text-sm italic">
                                ${isMaxStage ? 'Cây đã đạt cấp độ huyền thoại!' : `Cần thêm <b>${pointsLeft} lượt</b> để lên cấp!`}
                            </p>
                        </div>
                        
                        <!-- Premium Progress Bar -->
                        <div class="relative w-full max-w-md h-12 bg-slate-200 dark:bg-black/40 rounded-full p-1.5 shadow-inner overflow-hidden border-b-2 border-white/50">
                            <div class="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-blue-600 rounded-full transition-all duration-1000 relative shadow-lg" style="width: ${stageProgress}%">
                                <div class="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-move_2s_linear_infinite]"></div>
                            </div>
                            <div class="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest gap-2">
                                <span class="material-symbols-outlined text-xs">auto_awesome</span>
                                TIẾN TRÌNH: ${tree.streak - stageStart} / ${stageRange}
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex-shrink-0 flex flex-col gap-5 items-center">
                        <button id="btn-water-tree" class="btn-grow btn-pressable group ${data.user.water >= 10 ? `bg-gradient-to-br from-blue-500 via-indigo-600 to-indigo-800` : 'bg-slate-300 cursor-not-allowed opacity-50'} text-white font-black py-6 px-14 rounded-[3rem] flex items-center gap-4 shadow-[0_20px_40px_-10px_rgba(59,130,246,0.3)] transition-all active:scale-95" ${data.user.water < 10 ? 'disabled' : ''}>
                             <div class="relative w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl group-hover:rotate-[20deg] transition-all">
                                <span class="material-symbols-outlined text-3xl">water_drop</span>
                             </div>
                             <div class="text-left">
                                <span class="block text-[10px] uppercase tracking-tighter opacity-80 font-bold">Chăm sóc cây</span>
                                <span class="text-2xl leading-none">10 GIỌT</span>
                             </div>
                        </button>
                        
                        <div class="flex items-center gap-3 bg-white/60 dark:bg-black/40 px-6 py-3 rounded-[2rem] border border-white dark:border-slate-700 shadow-sm relative group">
                            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kho nước:</span>
                            <div class="flex items-center gap-1.5">
                                <span class="text-xl font-black text-blue-600 dark:text-blue-400">${data.user.water}</span>
                                <span class="material-symbols-outlined text-blue-500 text-sm animate-bounce">water_drop</span>
                            </div>
                        </div>

                        <button id="btn-water-all" class="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest decoration-dotted underline underline-offset-4 opacity-70 hover:opacity-100 transition-all ${data.user.water >= 20 ? 'animate-pulse' : 'hidden'}">
                            ✨ Tưới tất cả (${Math.floor(data.user.water / 10)} lần)
                        </button>
                    </div>
                </div>
            </section>
            
            <style>
                @keyframes progress-move {
                    0% { background-position: 0 0; }
                    100% { background-position: 40px 0; }
                }
            </style>



            <!-- Journey Timeline -->
            <section class="mt-10">
                <div class="flex items-center gap-3 mb-6">
                    <div class="${c.bg} p-2 rounded-xl text-white shadow-lg">
                        <span class="material-symbols-outlined text-xl">timeline</span>
                    </div>
                    <h2 class="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">Hành Trình Trưởng Thành</h2>
                </div>
                <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto">
                    <ol class="flex items-start min-w-[560px]">
                        ${timelineNodes}
                    </ol>
                </div>
            </section>
        `;

        const handleWatering = async (isAll = false) => {
            const treeVisualArea = this.querySelector('#tree-visual-area');
            const waterCan = this.querySelector('.watering-can');
            const visualContent = this.querySelector('.visual-content');

            waterCan.style.opacity = '1';
            waterCan.animate([
                { transform: 'rotate(0deg) translate(0, 0)', opacity: 0 },
                { transform: 'rotate(-20deg) translate(-20px, -20px)', opacity: 1, offset: 0.2 },
                { transform: 'rotate(-45deg) translate(-40px, 0)', opacity: 1, offset: 0.8 },
                { transform: 'rotate(-45deg) translate(-40px, 0)', opacity: 0 }
            ], { duration: 1500, easing: 'ease-out' });

            setTimeout(() => {
                // Leaf Explosion Effect
                const burstCount = isAll ? 30 : 15;
                for (let i = 0; i < burstCount; i++) {
                    const leaf = document.createElement('div');
                    leaf.className = 'leaf-burst';
                    leaf.style.left = '50%';
                    leaf.style.bottom = '150px';
                    leaf.style.setProperty('--tx', `${(Math.random() - 0.5) * 350}px`);
                    leaf.style.setProperty('--ty', `${-Math.random() * 250 - 50}px`);
                    leaf.style.setProperty('--tr', `${Math.random() * 720}deg`);
                    treeVisualArea.appendChild(leaf);
                    setTimeout(() => leaf.remove(), 1500);
                }

                // Water Drops
                const dropCount = isAll ? 25 : 12;
                for (let i = 0; i < dropCount; i++) {
                    setTimeout(() => {
                        const drop = document.createElement('span');
                        drop.className = 'material-symbols-outlined absolute text-blue-400 pointer-events-none z-50';
                        drop.textContent = 'water_drop';
                        drop.style.left = (Math.random() * 60 + 20) + '%';
                        drop.style.top = '40px';
                        treeVisualArea.appendChild(drop);
                        drop.animate([
                            { transform: 'translateY(0) scale(1)', opacity: 1 },
                            { transform: 'translateY(300px) scale(0.5)', opacity: 0 }
                        ], { duration: 800, easing: 'ease-in' }).onfinish = () => drop.remove();
                    }, i * 50);
                }

                visualContent.classList.add('tree-impact');
                setTimeout(async () => {
                    visualContent.classList.remove('tree-impact');
                    if (isAll) await window.AppState.waterAll();
                    else await window.AppState.growTree(10);
                }, 800);
            }, 1400);
        };

        // PARALLAX INTERACTION
        const garden = this.querySelector('#tree-garden-container');
        const treeWrapper = this.querySelector('.tree-wrapper');
        const treeImg = this.querySelector('#main-tree-img');

        if (garden && treeWrapper) {
            garden.addEventListener('mousemove', (e) => {
                const rect = garden.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                // Tilt the tree towards mouse (Dramatic Parallax)
                const rotateX = -y * 50;
                const rotateY = x * 70;

                treeWrapper.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.05)`;
                if (treeImg) {
                    treeImg.style.filter = `drop-shadow(${x * -60}px ${30 + y * 30}px 100px rgba(0,0,0,0.5))`;
                }
            });

            // MAGIC TOUCH: Clicking the tree triggers a burst even without water
            treeWrapper.addEventListener('click', () => {
                const treeVisualArea = this.querySelector('#tree-visual-area');
                // Visual only burst
                const burstCount = 15;
                for (let i = 0; i < burstCount; i++) {
                    const leaf = document.createElement('div');
                    leaf.className = 'leaf-burst';
                    leaf.style.left = '50%';
                    leaf.style.bottom = '150px';
                    leaf.style.setProperty('--tx', `${(Math.random() - 0.5) * 450}px`);
                    leaf.style.setProperty('--ty', `${-Math.random() * 350 - 50}px`);
                    leaf.style.setProperty('--tr', `${Math.random() * 720}deg`);
                    treeVisualArea.appendChild(leaf);
                    setTimeout(() => leaf.remove(), 2000);
                }

                // Impact animation
                visualContent.classList.add('tree-impact');
                setTimeout(() => visualContent.classList.remove('tree-impact'), 800);
            });

            garden.addEventListener('mouseleave', () => {
                treeWrapper.style.transform = `rotateY(0deg) rotateX(0deg) scale(1)`;
                if (treeImg) treeImg.style.filter = `drop-shadow(0 30px 60px rgba(0,0,0,0.4))`;
            });
        }

        const btnGrow = this.querySelector('#btn-water-tree');
        if (btnGrow) {
            btnGrow.addEventListener('click', () => {
                if (window.AppState.data.user.water >= 10) handleWatering(false);
            });
        }

        const btnWaterAll = this.querySelector('#btn-water-all');
        if (btnWaterAll) {
            btnWaterAll.addEventListener('click', () => {
                if (window.AppState.data.user.water >= 10) handleWatering(true);
            });
        }
    }
}

class LeaderboardPodium extends HTMLElement {
    static get observedAttributes() { return ['mode']; }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'mode' && window.AppState) {
            this.render(window.AppState.data);
        }
    }

    connectedCallback() {
        if (window.AppState) {
            window.AppState.subscribe(data => this.render(data));
            this.render(window.AppState.data);
        }
    }

    render(data) {
        if (!data || !data.leaderboard || data.leaderboard.length < 3) return;

        const mode = this.getAttribute('mode') || 'xp';

        let sorted = data.leaderboard.filter(u => u.role !== 'parent' && !u.name.toLowerCase().includes('bố') && !u.name.toLowerCase().includes('mẹ'));
        if (mode === 'xp') {
            sorted.sort((a, b) => {
                if (b.level !== a.level) return b.level - a.level;
                return b.xp - a.xp;
            });
        } else if (mode === 'weekly_xp') {
            sorted.sort((a, b) => {
                const aXp = a.weeklyXp || 0;
                const bXp = b.weeklyXp || 0;
                if (aXp !== bXp) return bXp - aXp;
                return b.level - a.level;
            });
        } else if (mode === 'arena_wins') {
            // Sort by ALL-TIME stats (no week filter) so ranking is always meaningful
            const getAllStats = (uid) => {
                const matches = (data.challenges || []).filter(c =>
                    c.status === 'completed' &&
                    (c.challengerId === uid || c.opponentId === uid)
                );
                const wins = matches.filter(c => c.winnerId === uid).length;
                const draws = matches.filter(c => c.winnerId === null).length;
                const losses = matches.length - wins - draws;
                return { wins, draws, losses };
            };

            sorted.sort((a, b) => {
                const sA = getAllStats(a.id);
                const sB = getAllStats(b.id);
                if (sB.wins !== sA.wins) return sB.wins - sA.wins;
                if (sB.draws !== sA.draws) return sB.draws - sA.draws;
                return sA.losses - sB.losses;
            });
        } else if (mode === 'stickers') {
            sorted.sort((a, b) => (b.totalStickers || 0) - (a.totalStickers || 0));
        } else {
            sorted.sort((a, b) => {
                if (b.actionStreak !== a.actionStreak) return (b.actionStreak || 0) - (a.actionStreak || 0);
                return (b.completionStreak || 0) - (a.completionStreak || 0);
            });
        }

        const top3 = sorted.slice(0, 3);
        const first = top3[0];
        const second = top3[1];
        const third = top3[2];

        const getValue = (user) => {
            if (mode === 'xp') return `Lv.${user.level}`;
            if (mode === 'weekly_xp') return `${user.weeklyXp || 0}`;
            if (mode === 'arena_wins') {
                // ALL-TIME stats to match sorting order
                const matches = (data.challenges || []).filter(c => c.status === 'completed' && (c.challengerId === user.id || c.opponentId === user.id));
                const wins = matches.filter(c => c.winnerId === user.id).length;
                const draws = matches.filter(c => c.winnerId === null).length;
                const losses = matches.length - wins - draws;
                return `${wins}T - ${draws}H - ${losses}B`;
            }
            if (mode === 'stickers') return user.totalStickers || 0;
            return user.actionStreak || 0;
        };
        const getLabel = () => {
            if (mode === 'xp') return 'Cấp độ';
            if (mode === 'weekly_xp') return 'Kinh nghiệm';
            if (mode === 'arena_wins') return 'Chiến Thắng';
            if (mode === 'stickers') return 'Huy hiệu';
            return 'Ngày';
        };
        const getIcon = () => {
            if (mode === 'xp') return 'military_tech';
            if (mode === 'weekly_xp') return 'local_fire_department';
            if (mode === 'arena_wins') return 'swords';
            if (mode === 'stickers') return 'sell';
            return 'electric_bolt';
        };
        const getIconColor = () => {
            if (mode === 'xp') return 'text-purple-500';
            if (mode === 'weekly_xp') return 'text-orange-500';
            if (mode === 'arena_wins') return 'text-rose-500';
            if (mode === 'stickers') return 'text-emerald-500';
            return 'text-blue-500';
        };
        const getSubLabel = (user) => {
            if (mode === 'xp') return `${user.xp} XP`;
            if (mode === 'weekly_xp') return `Lv.${user.level}`;
            if (mode === 'arena_wins') return `Toàn thời gian`;
            if (mode === 'stickers') return `Bộ sưu tập`;
            return `Chuỗi Hành động`;
        };

        const getUserTitle = (stickers) => {
            if (stickers === undefined) stickers = 0;
            if (window.TITLE_MILESTONES) {
                for (let i = window.TITLE_MILESTONES.length - 1; i >= 0; i--) {
                    if (stickers >= window.TITLE_MILESTONES[i].stickers) {
                        return `Cấp ${i + 1}: ${window.TITLE_MILESTONES[i].name}`;
                    }
                }
            }
            return 'Chưa có danh hiệu';
        };

        this.innerHTML = `
            <div class="flex items-end justify-center py-6 gap-2 sm:gap-6 lg:gap-8 min-h-[300px] sm:min-h-[360px]">
                
                <!-- Hạng 2 -->
                <div class="flex flex-col items-center w-[28%] max-w-[140px] group">
                    <div class="relative mb-2 sm:mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                        <img src="${second.avatar}" alt="Top 2" class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-slate-200 dark:border-slate-700 shadow-md ${second.isCurrentUser ? 'ring-2 ring-primary ring-offset-2' : ''}">
                        <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white text-xs sm:text-sm font-black w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-[#221a10]">2</div>
                    </div>
                    <p class="font-bold text-slate-800 dark:text-white text-xs sm:text-base text-center line-clamp-1 w-full px-1">${second.name}</p>
                    <div class="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 items-center gap-0.5 shadow-sm mt-2 w-full flex flex-col justify-center">
                        <div class="flex items-center gap-1">
                            <span class="${getIconColor()} material-symbols-outlined text-[10px] sm:text-xs xl:text-sm">${getIcon()}</span>
                            <span class="font-black ${getIconColor()} text-[9px] sm:text-[11px] xl:text-[12px] whitespace-nowrap">${getValue(second)}</span>
                        </div>
                        <span class="text-[7px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-tighter">${getLabel()}</span>
                    </div>
                    <div class="w-full h-24 sm:h-32 bg-slate-200 dark:bg-slate-800 rounded-t-lg mt-2 sm:mt-4 shadow-inner relative overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                    </div>
                </div>

                <!-- Hạng 1 -->
                <div class="flex flex-col items-center w-[35%] max-w-[160px] group relative z-10">
                    <div class="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="bg-primary text-white text-[10px] sm:text-xs font-bold py-1 px-3 rounded-full flex items-center gap-1 shadow-lg animate-bounce">
                           <span class="material-symbols-outlined text-sm">auto_awesome</span> Đỉnh cao!
                        </div>
                    </div>
                    <div class="relative mb-2 sm:mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                         <div class="absolute -top-8 left-1/2 -translate-x-1/2 w-full flex justify-center golden-aura rounded-full"></div>
                         <img src="${first.avatar}" alt="Top 1" class="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-[#ee9d2b] shadow-[0_0_20px_rgba(238,157,43,0.5)] z-10 relative ${first.isCurrentUser ? 'ring-4 ring-primary ring-offset-4' : ''}">
                         <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900 text-sm sm:text-base font-black w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-[#221a10] z-20">1</div>
                         <span class="material-symbols-outlined absolute -top-5 -right-2 text-3xl sm:text-4xl text-yellow-400 drop-shadow-md z-20 rotate-12">crown</span>
                    </div>
                    <p class="font-black text-primary text-sm sm:text-lg lg:text-xl text-center line-clamp-1 w-full px-1">${first.name}</p>
                    <div class="bg-amber-50/90 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-800/50 rounded-xl px-2 sm:px-3 py-1.5 flex flex-col items-center gap-0.5 shadow-sm mt-2 w-full sm:w-auto justify-center">
                        <div class="flex items-center gap-1">
                            <span class="${getIconColor()} material-symbols-outlined text-xs sm:text-sm xl:text-base">${getIcon()}</span>
                            <span class="font-black text-primary text-[10px] sm:text-[12px] xl:text-[14px] whitespace-nowrap">${getValue(first)}</span>
                        </div>
                        <span class="text-[7px] sm:text-[9px] text-yellow-600 dark:text-yellow-500 font-bold uppercase tracking-tighter">${getLabel()}</span>
                    </div>
                    <div class="w-full h-32 sm:h-44 bg-gradient-to-t from-primary to-yellow-300 rounded-t-lg mt-2 sm:mt-4 shadow-[0_-5px_15px_rgba(238,157,43,0.3)] relative overflow-hidden">
                        <div class="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
                    </div>
                </div>

                <!-- Hạng 3 -->
                <div class="flex flex-col items-center w-[28%] max-w-[140px] group">
                    <div class="relative mb-2 sm:mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                        <img src="${third.avatar}" alt="Top 3" class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-orange-200 dark:border-orange-900 shadow-md ${third.isCurrentUser ? 'ring-2 ring-primary ring-offset-2' : ''}">
                        <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100 text-xs sm:text-sm font-black w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-[#221a10]">3</div>
                    </div>
                    <p class="font-bold text-slate-800 dark:text-white text-xs sm:text-base text-center line-clamp-1 w-full px-1">${third.name}</p>
                    <div class="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 flex flex-col items-center justify-center gap-0.5 shadow-sm mt-2 w-full">
                        <div class="flex items-center gap-1">
                            <span class="${getIconColor()} material-symbols-outlined text-[10px] sm:text-xs xl:text-sm">${getIcon()}</span>
                            <span class="font-black ${getIconColor()} text-[9px] sm:text-[11px] xl:text-[12px] whitespace-nowrap">${getValue(third)}</span>
                        </div>
                        <span class="text-[7px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-tighter">${getLabel()}</span>
                    </div>
                    <div class="w-full h-20 sm:h-28 bg-orange-100 dark:bg-orange-950/50 rounded-t-lg mt-2 sm:mt-4 shadow-inner relative overflow-hidden">
                         <div class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                    </div>
                </div>

            </div>
        `;
    }
}

class LeaderboardTable extends HTMLElement {
    static get observedAttributes() { return ['mode']; }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'mode' && window.AppState) {
            this.render(window.AppState.data);
        }
    }

    connectedCallback() {
        if (window.AppState) {
            window.AppState.subscribe(data => this.render(data));
            this.render(window.AppState.data);
        }
    }

    render(data) {
        if (!data || !data.leaderboard) return;

        const mode = this.getAttribute('mode') || 'xp';

        let sorted = data.leaderboard.filter(u => u.role !== 'parent' && !u.name.toLowerCase().includes('bố') && !u.name.toLowerCase().includes('mẹ'));
        if (mode === 'xp') {
            sorted.sort((a, b) => {
                if (b.level !== a.level) return b.level - a.level;
                return b.xp - a.xp;
            });
        } else if (mode === 'weekly_xp') {
            sorted.sort((a, b) => {
                const aXp = a.weeklyXp || 0;
                const bXp = b.weeklyXp || 0;
                if (aXp !== bXp) return bXp - aXp;
                return b.level - a.level;
            });
        } else if (mode === 'arena_wins') {
            // Sort by ALL-TIME stats (no week filter) so ranking is always meaningful
            const getAllStats = (uid) => {
                const matches = (data.challenges || []).filter(c =>
                    c.status === 'completed' &&
                    (c.challengerId === uid || c.opponentId === uid)
                );
                const wins = matches.filter(c => c.winnerId === uid).length;
                const draws = matches.filter(c => c.winnerId === null).length;
                const losses = matches.length - wins - draws;
                return { wins, draws, losses };
            };

            sorted.sort((a, b) => {
                const sA = getAllStats(a.id);
                const sB = getAllStats(b.id);
                if (sB.wins !== sA.wins) return sB.wins - sA.wins;
                if (sB.draws !== sA.draws) return sB.draws - sA.draws;
                return sA.losses - sB.losses;
            });
        } else if (mode === 'stickers') {
            sorted.sort((a, b) => (b.totalStickers || 0) - (a.totalStickers || 0));
        } else {
            sorted.sort((a, b) => {
                if (b.actionStreak !== a.actionStreak) return (b.actionStreak || 0) - (a.actionStreak || 0);
                return (b.completionStreak || 0) - (a.completionStreak || 0);
            });
        }

        if (sorted.length === 0) {
            this.innerHTML = '';
            return;
        }

        const getValue = (user) => {
            if (mode === 'xp') return `Lv.${user.level}`;
            if (mode === 'weekly_xp') return `${user.weeklyXp || 0}`;
            if (mode === 'arena_wins') {
                // Display ALL-TIME record to match ranking order
                const matches = (data.challenges || []).filter(c => c.status === 'completed' && (c.challengerId === user.id || c.opponentId === user.id));
                const wins = matches.filter(c => c.winnerId === user.id).length;
                const draws = matches.filter(c => c.winnerId === null).length;
                const losses = matches.length - wins - draws;
                return `${wins}T - ${draws}H - ${losses}B`;
            }
            if (mode === 'stickers') return user.totalStickers || 0;
            return user.actionStreak || 0;
        };
        const getLabel = () => {
            if (mode === 'xp') return 'Cấp độ';
            if (mode === 'weekly_xp') return 'Kinh nghiệm';
            if (mode === 'arena_wins') return 'Chiến Thắng';
            if (mode === 'stickers') return 'Huy hiệu';
            return 'Ngày';
        };
        const getIcon = () => {
            if (mode === 'xp') return 'military_tech';
            if (mode === 'weekly_xp') return 'local_fire_department';
            if (mode === 'arena_wins') return 'swords';
            if (mode === 'stickers') return 'sell';
            return 'electric_bolt';
        };
        const getIconColor = () => {
            if (mode === 'xp') return 'text-purple-500';
            if (mode === 'weekly_xp') return 'text-orange-500';
            if (mode === 'arena_wins') return 'text-rose-500';
            if (mode === 'stickers') return 'text-emerald-500';
            return 'text-blue-500';
        };
        const getSubLabel = (user) => {
            if (mode === 'xp') return `Lv.${user.level}`;
            if (mode === 'weekly_xp') return `Lv.${user.level}`;
            if (mode === 'arena_wins') return `Tuần này`;
            if (mode === 'stickers') return `Bộ sưu tập`;
            return `Chuỗi Hành động`;
        };

        this.innerHTML = `
            <div class="bg-white dark:bg-[#2c2215] rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div class="divide-y divide-slate-50 dark:divide-slate-800/50">
                    ${sorted.map((user, index) => {
            const rank = index + 1;
            const stickers = user.totalStickers || 0;
            let titleHtml = '';
            let hasTitle = false;
            if (window.TITLE_MILESTONES) {
                for (let i = window.TITLE_MILESTONES.length - 1; i >= 0; i--) {
                    if (stickers >= window.TITLE_MILESTONES[i].stickers) {
                        const m = window.TITLE_MILESTONES[i];
                        titleHtml = `
                                        <div class="bg-${m.color}-100 dark:bg-${m.color}-900/30 px-3 py-1.5 rounded-xl border border-${m.color}-200 dark:border-${m.color}-800/30 flex flex-col items-center">
                                            <span class="text-[10px] font-black text-${m.color}-600 dark:text-${m.color}-400 uppercase tracking-tighter">Danh hiệu</span>
                                            <span class="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-white line-clamp-1">${m.name}</span>
                                        </div>
                                    `;
                        hasTitle = true;
                        break;
                    }
                }
            }

            if (!hasTitle) {
                titleHtml = `
                                 <div class="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700/50 flex flex-col items-center opacity-60">
                                     <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Đã tích lũy</span>
                                     <div class="flex items-center gap-1">
                                         <span class="material-symbols-outlined text-[10px] text-purple-400">sell</span>
                                         <span class="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">${stickers} Huy hiệu</span>
                                     </div>
                                 </div>
                             `;
            }

            return `
                            <div class="flex items-center justify-between p-4 sm:p-5 bg-white dark:bg-[#1a140c] rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:scale-[1.01] hover:shadow-md relative overflow-hidden group">
                                ${user.isCurrentUser ? '<div class="absolute inset-y-0 left-0 w-1.5 bg-primary shadow-[2px_0_10px_rgba(238,157,43,0.3)]"></div>' : ''}
                                
                                <div class="flex items-center gap-4 sm:gap-6">
                                    <div class="flex flex-col items-center justify-center w-8">
                                        <span class="text-sm sm:text-lg font-black ${rank <= 3 ? (rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-slate-400' : 'text-orange-400') : 'text-slate-300'}">#${rank}</span>
                                        ${rank <= 3 ? `<span class="material-symbols-outlined text-xs ${rank === 1 ? 'text-yellow-500' : 'text-slate-300'} transform -mt-1">${rank === 1 ? 'crown' : 'military_tech'}</span>` : ''}
                                    </div>
                                    
                                    <div class="relative">
                                        <img src="${user.avatar}" class="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 ${user.isCurrentUser ? 'border-primary' : 'border-slate-100 dark:border-slate-800'} shadow-sm">
                                        ${user.isCurrentUser ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-primary border-2 border-white dark:border-[#1a140c] rounded-full"></div>' : ''}
                                    </div>
                                    
                                    <div>
                                        <div class="flex items-center gap-2">
                                            <h4 class="font-black text-slate-800 dark:text-white text-sm sm:text-base">${user.name}</h4>
                                            ${user.isCurrentUser ? '<span class="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Bạn</span>' : ''}
                                        </div>
                                        <div class="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-400 mt-0.5">
                                            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">military_tech</span> Lv.${user.level}</span>
                                            <span>•</span>
                                            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">monetization_on</span> ${user.gold}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-center gap-6 sm:gap-12 lg:gap-20">
                                    <!-- Dynamic Title/Collection Section -->
                                    <div class="hidden sm:flex min-w-[120px] justify-center">
                                        ${titleHtml}
                                    </div>

                                    <div class="flex flex-col items-end min-w-[70px] sm:min-w-[90px]">
                                        <div class="flex items-center gap-1.5 ${getIconColor()}">
                                            <span class="material-symbols-outlined text-base sm:text-xl font-bold">${getIcon()}</span>
                                            <span class="text-base sm:text-xl font-black tabular-nums">${getValue(user)}</span>
                                        </div>
                                        <span class="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">${getLabel()}</span>
                                    </div>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    }
}
class ParentSidebar extends HTMLElement {
    connectedCallback() {
        const active = this.getAttribute('active') || 'dashboard';
        this.render(active); // Render immediately with whatever data is available

        const waitForState = () => {
            if (window.AppState) {
                window.AppState.subscribe(() => {
                    this.render(this.getAttribute('active') || 'dashboard');
                });
            } else {
                setTimeout(waitForState, 100); // Retry until AppState is ready
            }
        };
        waitForState();
    }


    render(active) {
        this.innerHTML = `
            <aside class="w-72 bg-white dark:bg-[#1a140d] border-r border-slate-100 dark:border-slate-800 flex flex-col hidden lg:flex h-screen sticky top-0 shadow-xl z-[60]">
                <div class="p-8 border-b border-slate-50 dark:border-slate-800/50">
                    <div class="flex items-center gap-4">
                        <img alt="Family Logo" class="size-11 rounded-xl shadow-lg shadow-primary/20 rotate-3 object-cover" src="https://ui-avatars.com/api/?name=L+K&background=ee9d2b&color=fff" />
                        <div>
                            <h1 class="text-xl font-black tracking-tight text-slate-800 dark:text-white leading-none">LevelUp Kids</h1>
                            <span class="text-[9px] uppercase tracking-widest font-black text-primary block mt-1">QUẢN TRỊ VIÊN</span>
                        </div>
                    </div>
                </div>

                <nav class="flex-1 p-6 pt-4 space-y-2 overflow-y-auto">
                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-3">Bảng điều khiển</div>
                    
                    ${this.navLink('dashboard', 'Bảng điều khiển', '../admin/index.html', active === 'dashboard' || active === 'insights')}
                    ${this.navLink('leaderboard', 'Xếp hạng', '../leaderboard/index.html', active === 'leaderboard')}
                    ${this.navLink('verified', 'Duyệt nhiệm vụ', '../approve-tasks/index.html', active === 'approval', (window.AppState && window.AppState.data.requests ? window.AppState.data.requests.filter(r => r.status === 'pending' && r.type === 'task').length : 0) || '')}
                    ${this.navLink('assignment', 'Quản lý nhiệm vụ', '../manage-tasks/index.html', active === 'tasks')}
                    ${this.navLink('redeem', 'Cửa hàng quà', '../manage-shop/index.html', active === 'shop', (window.AppState && window.AppState.data.requests ? window.AppState.data.requests.filter(r => r.status === 'pending' && (r.type === 'shop' || r.type === 'perk')).length : 0) || '')}
                    
                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-3 mt-6">Cài đặt</div>
                    ${this.navLink('group', 'Thành viên cá nhân', '../portal/index.html', active === 'members')}
                    ${this.navLink('settings', 'Cấu hình hệ thống', '../settings/index.html', active === 'settings')}
                </nav>



                <div class="p-6 border-t border-slate-50 dark:border-slate-800/50">
                    <button onclick="navigateWithTransition('../portal/index.html')" class="w-full bg-slate-800 dark:bg-slate-700 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-slate-900 transition-all">
                        <span class="material-symbols-outlined text-xl text-primary">logout</span>
                        <span>Trở về app Của Bé</span>
                    </button>
                    <div class="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/20 text-[9px] text-slate-400 font-mono break-all opacity-50">
                        FID: ${window.AppState ? window.AppState.familyId : '...'}
                    </div>
                </div>
            </aside>
            <behavior-log-modal></behavior-log-modal>
        `;
    }

    navLink(icon, label, href, isActive, badge = '') {
        return `
            <a href="${href}" onclick="if(this.getAttribute('href')==='#'){ alert('Tính năng này đang được phát triển tiếp.'); event.preventDefault(); }" class="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}">
                <span class="material-symbols-outlined text-2xl">${icon}</span>
                <span class="font-bold text-sm text-current">${label}</span>
                ${badge ? `<span class="ml-auto ${isActive ? 'bg-white text-primary' : 'bg-primary text-white'} text-[10px] px-2 py-0.5 rounded-full font-black min-w-[20px] text-center shadow-sm animate-pulse">${badge}</span>` : ''}
            </a>
        `;
    }
}

class StatCard extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title');
        const value = this.getAttribute('value');
        const trend = this.getAttribute('trend');
        const icon = this.getAttribute('icon');
        const color = this.getAttribute('color') || 'primary';

        this.innerHTML = `
            <div class="bg-white dark:bg-[#2c2215] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:shadow-xl transition-all">
                <div class="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-125 transition-transform duration-700 rotate-12">
                    <span class="material-symbols-outlined text-[120px] text-${color}">${icon}</span>
                </div>
                <div class="flex flex-col gap-1 relative z-10">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${title}</p>
                    <div class="flex items-end gap-3 mt-2">
                        <h3 class="text-4xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter">${value}</h3>
                        <div class="flex items-center gap-1 mb-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                            <span class="material-symbols-outlined text-xs">trending_up</span>
                            ${trend}
                        </div>
                    </div>
                </div>
            </div>
            `;
    }
}

class ActivityFeed extends HTMLElement {
    connectedCallback() {
        this.render();
        if (window.AppState) {
            window.AppState.subscribe(() => this.render());
        }
    }

    attachEventListeners() {
        this.querySelectorAll('.btn-approve').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reqId = e.target.dataset.reqId;
                if (window.AppState && reqId) {
                    window.AppState.markRequestDelivered(reqId);

                    // Fire Confetti
                    if (window.confetti) {
                        const rect = e.target.getBoundingClientRect();
                        const x = (rect.left + rect.width / 2) / window.innerWidth;
                        const y = (rect.top + rect.height / 2) / window.innerHeight;

                        confetti({
                            particleCount: 150,
                            spread: 80,
                            origin: { x: x, y: y },
                            colors: ['#ee9d2b', '#10b981', '#3b82f6', '#fcd34d'],
                            zIndex: 9999
                        });
                    }
                }
            });
        });
    }

    render() {
        if (!window.AppState) return;

        const requests = window.AppState.data.requests || [];
        const leaderboard = window.AppState.data.leaderboard || [];

        this.innerHTML = `
            <div class="bg-white dark:bg-[#2c2215] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 h-fit">
                <h4 class="text-xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary">history</span>
                    Hoạt động gần nhất
                </h4>
                <div class="space-y-8" id="activity-items-container">
                    ${requests.length > 0 ? requests.slice(0, 5).map(req => {
            const user = leaderboard.find(u => u.name === req.user) || { avatar: '../shared/assets/generated_avatars/avatar_1.png' };
            return this.renderItem(req, user);
        }).join('') : `
                        <div class="text-center py-8">
                            <span class="material-symbols-outlined text-slate-300 dark:text-slate-700 text-4xl mb-2">inbox</span>
                            <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">Chưa có hoạt động nào</p>
                        </div>
                    `}
                </div>
                <button onclick="window.location.href='../approve-tasks/index.html'" class="w-full mt-10 py-4 text-slate-400 text-xs font-black border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all uppercase tracking-widest">
                    Xem tất cả lịch sử
                </button>
            </div>
            `;

        this.attachEventListeners();
    }

    renderItem(req, user) {
        const isPending = req.status === 'pending';
        return `
            <div class="flex gap-4 relative activity-item">
                <div class="relative shrink-0">
                    <img class="size-11 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm" src="${user.avatar || '../shared/assets/generated_avatars/avatar_1.png'}" alt="${req.user}">
                    <div class="status-circle absolute -bottom-1 -right-1 size-5 ${!isPending ? 'bg-emerald-500' : 'bg-primary shadow-lg shadow-primary/30'} rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center transition-colors">
                        <span class="material-symbols-outlined text-[10px] text-white font-black">${!isPending ? 'check' : 'pending'}</span>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm dark:text-slate-200">
                        <span class="font-black text-slate-800 dark:text-white">${req.user}</span> 
                        <span class="status-text text-slate-500 text-xs transition-colors">${!isPending ? 'đã xong' : 'đang chờ duyệt'}</span>
                    </p>
                    <p class="font-bold text-xs text-slate-700 dark:text-slate-400 truncate mt-1">${req.itemTitle}</p>
                    <div class="flex items-center justify-between mt-2">
                        <span class="text-[10px] font-bold text-slate-400">${req.time}</span>
                        <span class="text-[10px] font-black text-primary">${req.isSticker ? '🎟️ ' : '💰 '}${req.price}</span>
                    </div>
                    
                    ${isPending ? `
                        <div class="mt-4 flex gap-2">
                            <button data-req-id="${req.id}" class="btn-approve flex-1 py-1.5 bg-primary text-white text-[9px] font-black rounded-lg shadow-sm hover:bg-primary-dark transition-all uppercase">Duyệt ngay</button>
                        </div>
                    ` : ''}
                </div>
            </div>
            `;
    }
}

// Register components
customElements.define('app-header', AppHeader);
customElements.define('quest-card', QuestCard);
customElements.define('shop-item', ShopItem);

class InstantPerksGrid extends HTMLElement {
    connectedCallback() {
        if (window.AppState) {
            window.AppState.subscribe(data => this.render(data));
            this.render(window.AppState.data);
        }
    }

    render(data) {
        if (!data || !data.instantPerks) return;

        const colorMap = {
            blue: { bg: 'from-blue-400 to-blue-600', light: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600', border: 'border-blue-200 dark:border-blue-800' },
            indigo: { bg: 'from-indigo-400 to-indigo-600', light: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600', border: 'border-indigo-200 dark:border-indigo-800' },
            purple: { bg: 'from-purple-400 to-purple-600', light: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600', border: 'border-purple-200 dark:border-purple-800' },
            orange: { bg: 'from-orange-400 to-orange-600', light: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600', border: 'border-orange-200 dark:border-orange-800' },
            pink: { bg: 'from-pink-400 to-pink-600', light: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600', border: 'border-pink-200 dark:border-pink-800' },
            teal: { bg: 'from-teal-400 to-teal-600', light: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600', border: 'border-teal-200 dark:border-teal-800' },
            green: { bg: 'from-green-400 to-green-600', light: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600', border: 'border-green-200 dark:border-green-800' },
            cyan: { bg: 'from-cyan-400 to-cyan-600', light: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600', border: 'border-cyan-200 dark:border-cyan-800' },
        };

        const userStickers = data.user.stickers || 0;

        this.innerHTML = `
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                ${data.instantPerks.map(perk => {
            const c = colorMap[perk.color] || colorMap['blue'];
            const canAfford = userStickers >= perk.stickerPrice;
            return `
                    <div class="group relative bg-white dark:bg-slate-900 rounded-3xl border ${c.border} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
                        <!-- Top color strip with icon -->
                        <div class="bg-gradient-to-br ${c.bg} p-6 flex items-center justify-between">
                            <span class="material-symbols-outlined text-4xl drop-shadow-sm text-white" style="font-variation-settings:'FILL' 1">${perk.emoji || perk.icon || 'star'}</span>
                            <div class="flex items-center gap-1 bg-white/20 text-white text-xs font-black px-2.5 py-1.5 rounded-full">
                                <span class="material-symbols-outlined text-[14px] transform rotate-12" style="font-variation-settings:'FILL' 1">sell</span>
                                ${perk.stickerPrice}
                            </div>
                        </div>
                        <!-- Content -->
                        <div class="p-4 flex flex-col flex-1">
                            <h3 class="font-black text-slate-800 dark:text-white text-sm leading-tight mb-1">${perk.title}</h3>
                            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">${perk.desc}</p>
                            <button
                                onclick="window.redeemInstantPerk && window.redeemInstantPerk('${perk.id}')" class="mt-3 w-full ${canAfford
                    ? `bg-gradient-to-r ${c.bg} text-white hover:opacity-90 shadow-sm`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                } font-bold text-xs py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
                                ${!canAfford ? 'disabled' : ''}>
                                <span class="material-symbols-outlined text-sm">bolt</span>
                                ${canAfford ? 'Đổi Ngay!' : `Thiếu ${perk.stickerPrice - userStickers} Huy hiệu`}
                            </button>
                        </div>
                    </div>`;
        }).join('')
            }
            </div>
            `;
    }
}
customElements.define('instant-perks-grid', InstantPerksGrid);

class ShopGrid extends HTMLElement {
    connectedCallback() {
        if (window.AppState) {
            window.AppState.subscribe(data => this.render(data));
            this.render(window.AppState.data);
        }
    }

    render(data) {
        if (!data || !data.shopItems) return;

        const userGold = data.user.gold;

        this.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                ${data.shopItems.map(item => {
            const canAfford = userGold >= item.price;
            const isPending = (data.requests || []).some(r => r.itemTitle === item.title && r.status === 'pending' && r.profileId === data.user.id);

            const colorAccent = {
                orange: 'from-orange-400 to-amber-500',
                red: 'from-red-400 to-rose-500',
                yellow: 'from-yellow-400 to-amber-500',
                blue: 'from-blue-400 to-indigo-500',
            }[item.color] || 'from-amber-400 to-orange-500';

            return `
                    <div class="group bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                        <!-- Item Image -->
                        <div class="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            ${(item.image && item.image !== 'null' && item.image !== 'undefined' && item.image !== '')
                    ? `<img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\'material-symbols-outlined text-5xl text-slate-300\'>redeem</span>'">`
                    : `<span class="material-symbols-outlined text-5xl text-slate-300">redeem</span>`
                }
                            <!-- Price badge -->
                            <div class="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-amber-600 font-black text-sm px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                                <span class="material-symbols-outlined text-[16px] text-amber-500" style="font-variation-settings:'FILL' 1">monetization_on</span>
                                ${item.price}
                            </div>
                            ${(!canAfford || isPending) ? `<div class="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] flex items-center justify-center">
                                <div class="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                    ${isPending ? 'Đang chờ duyệt...' : `Cần thêm ${item.price - userGold} <span class="material-symbols-outlined text-[14px] text-amber-500" style="font-variation-settings:\'FILL\' 1">monetization_on</span>`}
                                </div>
                            </div>` : ''}
                        </div>
                        <!-- Content -->
                        <div class="p-5 flex flex-col flex-1">
                            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">${item.category}</span>
                            <h3 class="font-black text-slate-800 dark:text-white text-base mb-2 leading-tight">${item.title}</h3>
                            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-4">${item.desc}</p>
                            <button
                                onclick="window.redeemPremiumItem && window.redeemPremiumItem('${item.id}')" class="${(canAfford && !isPending)
                    ? `bg-gradient-to-r ${colorAccent} text-white hover:opacity-90 shadow-md active:scale-95`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                } w-full font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
                                ${(!canAfford || isPending) ? 'disabled' : ''}>
                                <span class="material-symbols-outlined text-lg">${isPending ? 'schedule' : (canAfford ? 'redeem' : 'lock')}</span>
                                ${isPending ? 'Đang Chờ Duyệt' : (canAfford ? 'Gửi Yêu Cầu' : 'Chưa Đủ Vàng')}
                            </button>
                        </div>
                    </div>`;
        }).join('')
            }
            </div>
            `;
    }
}
customElements.define('shop-grid', ShopGrid);

// Mới Update: Thêm trường sticker cho quest-card
class QuestGrid extends HTMLElement {
    connectedCallback() {
        if (window.AppState) {
            window.AppState.subscribe(data => this.render(data));
            this.render(window.AppState.data);
        }
    }

    render(data) {
        if (!data || !data.quests) return;

        const pendingQuests = data.quests.filter(q => !(q.completedBy && q.completedBy.includes(data.user.id)));
        const mandatory = pendingQuests.filter(q => q.type !== 'optional');
        const optional = pendingQuests.filter(q => q.type === 'optional');

        const renderQuest = (quest) => `
            <quest-card
        task-id="${quest.id}"
        title="${quest.title}"
        desc="${quest.desc}"
        reward="${quest.reward || 0}"
        sticker="${quest.sticker || 0}"
        xp="${quest.xp || 0}"
        water="${quest.water || 0}"
        icon="${quest.icon || 'star'}"
        color="${quest.color || 'blue'}"
        type="${quest.type || 'mandatory'}">
            </quest-card>
            `;

        let html = '';

        if (mandatory.length > 0) {
            html += `
            <div class="mb-12">
                    <div class="flex items-center gap-3 mb-6 bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-3xl border border-emerald-100 dark:border-emerald-800/30">
                        <div class="bg-emerald-500 text-white p-2 rounded-xl shadow-lg">
                            <span class="material-symbols-outlined">assignment_late</span>
                        </div>
                        <h3 class="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">Nhiệm vụ Bắt buộc</h3>
                        <span class="ml-auto bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full">${mandatory.length} CẦN LÀM</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        ${mandatory.map(renderQuest).join('')}
                    </div>
                </div>
            `;
        }

        if (optional.length > 0) {
            html += `
            <div>
                    <div class="flex items-center gap-3 mb-6 bg-purple-50 dark:bg-purple-900/10 p-4 rounded-3xl border border-purple-100 dark:border-purple-800/30">
                        <div class="bg-purple-500 text-white p-2 rounded-xl shadow-lg">
                            <span class="material-symbols-outlined">assignment_add</span>
                        </div>
                        <h3 class="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">Nhiệm vụ Tùy chọn</h3>
                        <span class="ml-auto bg-purple-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full">${optional.length} THÊM VUI</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
                        ${optional.map(renderQuest).join('')}
                    </div>
                </div>
            `;
        }

        if (pendingQuests.length === 0) {
            html = `
            <div class="text-center py-20 bg-white dark:bg-[#2c2215] rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-inner">
                    <div class="text-6xl mb-6">🏆</div>
                    <h3 class="text-2xl font-black text-slate-800 dark:text-white mb-2">TẤT CẢ ĐÃ XONG!</h3>
                    <p class="text-slate-500 font-medium">Bé thật tuyệt vời, hãy nghỉ ngơi hoặc đi đổi quà nhé!</p>
                </div>
            `;
        }

        this.innerHTML = html;
    }
}
customElements.define('quest-grid', QuestGrid);

class CompletedTasks extends HTMLElement {
    connectedCallback() {
        if (window.AppState) {
            window.AppState.subscribe(data => this.render(data));
            this.render(window.AppState.data);
        }
    }

    render(data) {
        if (!data || !data.quests) return;

        const completedQuests = data.quests.filter(q => q.completedBy && q.completedBy.includes(data.user.id));

        if (completedQuests.length === 0) {
            this.innerHTML = '';
            return;
        }

        this.innerHTML = `
            <div class="mt-12">
                <h3 class="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <span class="material-symbols-outlined text-green-500">task_alt</span>
                    Nhiệm vụ đã hoàn thành hôm nay
                </h3>
                <div class="bg-white dark:bg-[#2c2215] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div class="divide-y divide-slate-50 dark:divide-slate-800/50">
                        ${completedQuests.map(quest => `
                            <div class="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-2xl flex items-center justify-center shrink-0">
                                        <span class="material-symbols-outlined text-2xl">${quest.icon || 'star'}</span>
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-slate-800 dark:text-white line-through opacity-70 group-hover:opacity-100 transition-opacity">${quest.title}</h4>
                                        <p class="text-xs text-slate-400 mt-1 flex flex-wrap gap-3">
                                            <span class="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-lg"><span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1">monetization_on</span> +${quest.reward}</span>
                                            ${quest.sticker ? `<span class="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-lg"><span class="material-symbols-outlined text-[12px] transform rotate-12" style="font-variation-settings:'FILL' 1">sell</span> +${quest.sticker}</span>` : ''}
                                            <span class="flex items-center gap-1 text-yellow-700 dark:text-yellow-400 font-bold bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-lg"><span class="material-symbols-outlined text-[14px]">military_tech</span> +${quest.xp}</span>
                                            ${quest.water ? `<span class="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-lg"><span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1">water_drop</span> +${quest.water}</span>` : ''}
                                        </p>
                                    </div>
                                </div>
                                <div class="hidden sm:flex items-center text-green-500 font-bold text-sm bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-xl">
                                    <span class="material-symbols-outlined text-[18px] mr-1">done_all</span>
                                    Tuyệt vời!
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            `;
    }
}
customElements.define('completed-tasks', CompletedTasks);

customElements.define('tree-view', TreeView);
customElements.define('leaderboard-podium', LeaderboardPodium);
customElements.define('leaderboard-table', LeaderboardTable);
customElements.define('parent-sidebar', ParentSidebar);
customElements.define('stat-card', StatCard);
customElements.define('activity-feed', ActivityFeed);

class ChildNav extends HTMLElement {
    connectedCallback() {
        const active = this.getAttribute('active') || 'dashboard';
        this.render(active);
    }

    render(active) {
        this.innerHTML = `
            <div class="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#1a140c]/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] overflow-x-auto overflow-y-hidden" style="scrollbar-width: none; -ms-overflow-style: none;">
                <nav class="max-w-xl mx-auto px-2 sm:px-6 py-3 flex justify-between items-center relative gap-1">
                    ${this.navItem('dashboard', 'Nhiệm vụ', 'dashboard/index.html', active === 'dashboard' || active === '')}
                    ${this.navItem('book_5', 'Nhật ký', 'diary/index.html', active === 'diary')}
                    ${this.navItem('sports_kabaddi', 'Đấu trường', 'arena/index.html', active === 'arena')}
                    ${this.navItem('leaderboard', 'Xếp hạng', 'leaderboard/index.html', active === 'leaderboard')}
                    ${this.navItem('workspace_premium', 'Danh hiệu', 'titles/index.html', active === 'titles')}
                    ${this.navStickerItem(active === 'stickers')}
                    ${this.navItem('park', 'Kho báu', 'tree-growth/index.html', active === 'tree')}
                    ${this.navItem('storefront', 'Cửa hàng', 'shop/index.html', active === 'shop')}
                    ${this.navItem('person', 'Hồ sơ', 'profile/index.html', active === 'profile')}
                </nav>
            </div>
            <!--Spacer to prevent content from being hidden by fixed nav-->
            <div class="h-24"></div>
            <titles-modal></titles-modal>
            <parent-pin-modal></parent-pin-modal>
        `;
    }

    navStickerItem(isActive) {
        const activeClass = isActive
            ? 'text-primary transform -translate-y-2'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300';
        const dot = isActive
            ? '<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_5px_#ee9d2b]"></div>'
            : '';
        const balance = window.AppState?.data?.user?.stickers || 0;
        const badge = balance > 0
            ? `<span class="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center"> ${balance > 9 ? '9+' : balance}</span> `
            : '';
        return `
            <a href="../sticker-book/index.html" class="relative flex flex-col items-center gap-1 transition-all duration-300 ${activeClass} flex-1 min-w-[56px] text-center">
                <div class="${isActive ? 'bg-primary/10 p-2 rounded-2xl' : 'p-2'} transition-all duration-300 relative">
                    <span class="material-symbols-outlined text-2xl ${isActive ? 'font-black' : ''}">sell</span>
                    ${badge}
                </div>
                <span class="text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-0 absolute -bottom-4 pointer-events-none'} transition-all duration-300 whitespace-nowrap">Sổ Sticker</span>
                ${dot}
            </a>
            `;
    }

    navItem(icon, label, href, isActive, onClickStr = null) {
        const activeClass = isActive
            ? 'text-primary transform -translate-y-2'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300';

        const dot = isActive
            ? '<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_5px_#ee9d2b]"></div>'
            : '';

        const iconClass = isActive ? 'font-black' : 'font-normal';
        const attrs = onClickStr ? `href="${href}" onclick="${onClickStr}"` : `href="../${href}"`;

        return `
            <a ${attrs} class="relative flex flex-col items-center gap-1 transition-all duration-300 ${activeClass} flex-1 min-w-[56px] text-center">
                <div class="${isActive ? 'bg-primary/10 p-2 rounded-2xl' : 'p-2'} transition-all duration-300">
                    <span class="material-symbols-outlined text-2xl ${iconClass}">${icon}</span>
                </div>
                <span class="text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-0 absolute -bottom-4 pointer-events-none'} transition-all duration-300 whitespace-nowrap">${label}</span>
                ${dot}
            </a>
            `;
    }
}
customElements.define('child-nav', ChildNav);

// ==========================================
// THÊM MODAL DANH HIỆU TOÀN CỤC TRONG MENU
// ==========================================
class TitlesModal extends HTMLElement {
    connectedCallback() {
        this.render();
        window.openGlobalTitlesModal = () => this.open();
        window.closeGlobalTitlesModal = () => this.close();
    }

    open() {
        const modal = this.querySelector('#global-titles-modal');
        if (modal) {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.children[0].classList.remove('scale-90');
            this.renderContent();
        }
    }

    close() {
        const modal = this.querySelector('#global-titles-modal');
        if (modal) {
            modal.classList.add('opacity-0', 'pointer-events-none');
            modal.children[0].classList.add('scale-90');
        }
    }

    renderContent() {
        const content = this.querySelector('#global-titles-modal-content');
        if (!window.TITLE_MILESTONES || !window.AppState || !content) return;

        const totalStickers = window.AppState.data.user.totalStickers || 0;
        const currentTitleIndex = window.AppState.data.title.currentTitleIndex; // could be -1 

        let html = '';
        TITLE_MILESTONES.forEach((m, index) => {
            const isUnlocked = index <= currentTitleIndex;
            const isNext = index === currentTitleIndex + 1;

            const bgClass = isUnlocked ? `bg - ${m.color} -50 dark: bg - ${m.color} -900 / 10 border border - ${m.color} -200 dark: border - ${m.color} -800 / 30` : 'bg-slate-50 dark:bg-[#1a140c] border border-slate-100 dark:border-slate-800 opacity-60';
            const iconColor = isUnlocked ? `text - ${m.color} -500` : 'text-slate-400';
            const nameColor = isUnlocked ? `text - ${m.color} -700 dark: text - ${m.color} -400` : 'text-slate-500';

            let statusBadge = '';
            if (index === currentTitleIndex) {
                statusBadge = `<div class="absolute -top-3 -right-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md animate-bounce"> ĐANG ĐẠT ĐƯỢC</div> `;
            } else if (isNext) {
                statusBadge = `<div class="absolute -top-3 -right-3 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-black px-3 py-1 rounded-full shadow-sm"> MỤC TIÊU</div> `;
            } else if (isUnlocked) {
                statusBadge = `<div class="absolute top-4 right-4 text-${m.color}-500 opacity-30"> <span class="material-symbols-outlined">check_circle</span></div> `;
            }

            let progressHtml = '';
            if (isNext) {
                const prevStickers = index === 0 ? 0 : TITLE_MILESTONES[index - 1].stickers;
                const range = m.stickers - prevStickers;
                const progress = totalStickers - prevStickers;
                const pct = Math.min(100, Math.max(0, (progress / range) * 100));
                progressHtml = `
            <div class="mt-4 w-full">
                    <div class="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                        <span>Tiến độ</span>
                        <span class="text-purple-600">${totalStickers} / ${m.stickers} Huy hiệu</span>
                    </div>
                    <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-gradient-to-r from-purple-400 to-primary h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                </div> `;
            }

            html += `
            <div class="bg-slate-50 dark:bg-[#1a140c] border border-slate-100 dark:border-slate-800 opacity-60 rounded-2xl p-5 relative transition-all ${isUnlocked ? 'shadow-sm' : ''} ${isNext ? 'ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-[#2c2215]' : ''}">
                ${statusBadge}
        <div class="flex items-center gap-4">
            <div class="flex-shrink-0 w-14 h-14 rounded-full ${isUnlocked ? `bg-${m.color}-100 dark:bg-${m.color}-900/30` : 'bg-slate-200 dark:bg-slate-700'} flex items-center justify-center text-3xl shadow-inner border border-white dark:border-slate-800">
                <span class="material-symbols-outlined ${iconColor}" ${isUnlocked ? `style="font-variation-settings:'FILL' 1"` : ''}>${m.icon}</span>
            </div>
            <div class="flex-grow">
                <h3 class="text-lg font-black ${nameColor} leading-tight">${m.name}</h3>
                <div class="flex items-center gap-1 mt-1 text-xs font-bold ${isUnlocked ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'}">
                    <span>Cần đạt mức:</span>
                    <span class="material-symbols-outlined text-[12px] text-purple-400 rotate-12" style="font-variation-settings:'FILL' 1">sell</span>
                    <span class="${isUnlocked ? 'text-purple-600 dark:text-purple-400' : ''}">${m.stickers}</span>
                </div>
            </div>
            ${!isUnlocked && !isNext ? `<div class="flex-shrink-0 text-slate-300 dark:text-slate-600"><span class="material-symbols-outlined text-3xl">lock</span></div>` : ''}
        </div>
                ${progressHtml}
            </div>
            `;
        });

        content.innerHTML = html;
    }

    render() {
        this.innerHTML = `
            <div id="global-titles-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300">
            <div
                class="bg-white dark:bg-[#2c2215] w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl transform scale-90 transition-transform duration-300 flex flex-col overflow-hidden relative" onclick="event.stopPropagation()">

                <div class="absolute top-0 right-0 bg-primary/10 w-40 h-40 rounded-bl-full -z-0 pointer-events-none"></div>

                <div class="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center relative z-10">
                    <div class="flex items-center gap-3">
                        <div
                            class="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-xl text-purple-600 dark:text-purple-400 font-bold shadow-sm">
                            <span class="material-symbols-outlined text-2xl transform rotate-12">sell</span>
                        </div>
                        <div>
                            <h2 class="text-2xl font-black text-slate-800 dark:text-white leading-tight">Sưu Tập Danh Hiệu
                            </h2>
                            <p class="text-sm text-slate-500 font-medium">Tích lũy Sticker để mở khóa nhé!</p>
                        </div>
                    </div>
                    <button onclick="window.closeGlobalTitlesModal()" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-50 dark:bg-slate-800 rounded-full transition-colors flex items-center justify-center">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div class="flex-grow overflow-y-auto p-6 md:p-8 space-y-4" id="global-titles-modal-content">
                    <!-- Titles will be injected here -->
                </div>

            </div>
        </div> `;

        // Click on backdrop to close
        const backdrop = this.querySelector('#global-titles-modal');
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) window.closeGlobalTitlesModal();
        });
    }
}
customElements.define('titles-modal', TitlesModal);

// ==========================================
// REWARD HISTORY MODAL
// ==========================================
class RewardHistoryModal extends HTMLElement {
    connectedCallback() {
        this.render();
        window.openGlobalRewardHistoryModal = () => this.open();
        window.closeGlobalRewardHistoryModal = () => this.close();
    }

    open() {
        const modal = this.querySelector('#global-history-modal');
        if (modal) {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.children[0].classList.remove('scale-90');
            this.renderContent();
        }
    }

    close() {
        const modal = this.querySelector('#global-history-modal');
        if (modal) {
            modal.classList.add('opacity-0', 'pointer-events-none');
            modal.children[0].classList.add('scale-90');
        }
    }

    renderContent() {
        const content = this.querySelector('#global-history-modal-content');
        if (!window.AppState || !content) return;

        const currentUserId = window.AppState.data.user.id;
        const allRequests = window.AppState.data.requests || [];
        // LỌC CHỈ LẤY CÁC YÊU CẦU ĐỔI QUÀ (SHOP HOẶC PERK), BỎ QUA CÁC LOG HỆ THỐNG NHƯ TƯỚI CÂY
        const userRequests = allRequests.filter(r => r.profileId === currentUserId && (r.type === 'shop' || r.type === 'perk'));

        if (userRequests.length === 0) {
            content.innerHTML = `
            <div class="p-8 text-center text-slate-400">
                    <span class="material-symbols-outlined text-6xl mb-2 opacity-30">inbox</span>
                    <p class="font-medium">Con chưa đổi phần quà nào cả.</p>
                </div>
            `;
            return;
        }

        let html = '<div class="space-y-4">';
        userRequests.forEach(req => {
            const isDelivered = req.status === 'delivered';
            const statusClass = isDelivered ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30';
            const statusText = isDelivered ? 'Đã nhận' : 'Chờ duyệt';
            const icon = isDelivered ? 'check_circle' : 'hourglass_bottom';

            const priceIcon = req.isSticker ?
                '<span class="material-symbols-outlined text-[12px] text-purple-400 transform rotate-12" style="font-variation-settings:\'FILL\' 1">sell</span>'
                : '<span class="material-symbols-outlined text-[12px] text-amber-500" style="font-variation-settings:\'FILL\' 1">monetization_on</span>';
            const priceColor = req.isSticker ? 'text-purple-600' : 'text-amber-600';

            html += `
            <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 shadow-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
                            ${(req.image && req.image !== 'null' && req.image !== 'undefined') ? `<img src="${req.image}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'material-symbols-outlined text-2xl text-slate-400\\'>redeem</span>'">` : `<span class="material-symbols-outlined text-2xl text-slate-400">redeem</span>`}
                        </div>
                        <div>
                            <h4 class="font-bold text-slate-800 dark:text-white">${req.itemTitle}</h4>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="text-xs text-slate-500">${req.time}</span>
                                <span class="text-xs text-slate-300 dark:text-slate-600">•</span>
                                <div class="flex items-center gap-1 font-bold ${priceColor}">
                                    ${priceIcon}
                                    <span class="text-xs">${req.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="${statusClass} flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap">
                        <span class="material-symbols-outlined text-[14px]">${icon}</span>
                        ${statusText}
                    </div>
                </div>
            `;
        });
        html += '</div>';

        content.innerHTML = html;
    }

    render() {
        this.innerHTML = `
            <div id="global-history-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300">
            <div class="bg-white dark:bg-[#2c2215] w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl transform scale-90 transition-transform duration-300 flex flex-col overflow-hidden relative" onclick="event.stopPropagation()">
                <div class="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center relative z-10">
                    <div class="flex items-center gap-3">
                        <div class="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 font-bold shadow-sm">
                            <span class="material-symbols-outlined text-2xl" style="font-variation-settings:'FILL' 1">history</span>
                        </div>
                        <div>
                            <h2 class="text-2xl font-black text-slate-800 dark:text-white leading-tight">Lịch Sử Đổi Quà</h2>
                            <p class="text-sm text-slate-500 font-medium">Theo dõi các phần quà con đã đổi.</p>
                        </div>
                    </div>
                    <button onclick="window.closeGlobalRewardHistoryModal()" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-50 dark:bg-slate-800 rounded-full transition-colors flex items-center justify-center">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="flex-grow overflow-y-auto p-6 md:p-8 space-y-4" id="global-history-modal-content">
                    <!-- History will be injected here -->
                </div>
            </div>
        </div> `;

        const backdrop = this.querySelector('#global-history-modal');
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) window.closeGlobalRewardHistoryModal();
        });
    }
}
customElements.define('reward-history-modal', RewardHistoryModal);

// ==========================================
// BEHAVIOR LOG MODAL (PARENT)
// ==========================================
class BehaviorLogModal extends HTMLElement {
    constructor() {
        super();
        this.selectedChildId = null;
        this.activeType = 'GOOD';
        this.isOpen = false;
        this.data = null;
        this.selectedBehavior = null; // Currently being edited behavior
        this.form = {
            title: '',
            description: '',
            gold: 0,
            xp: 0,
            water: 0,
            sticker: 0
        };
    }

    connectedCallback() {
        if (window.AppState) {
            window.AppState.subscribe(data => {
                this.data = data;
                this.render();
            });
            this.data = window.AppState.data;
        }

        window.openBehaviorLogModal = (childId) => {
            if (this.data && this.data.leaderboard) {
                this.selectedChildId = childId || (this.data.leaderboard.find(p => p.role === 'child')?.id);
            }
            this.resetForm();
            this.isOpen = true;
            this.render();
        };

        window.closeBehaviorLogModal = () => {
            this.isOpen = false;
            this.render();
        };

        window.setBehaviorType = (type) => {
            this.activeType = type;
            this.resetForm();
            this.render();
        };

        window.selectBehaviorChild = (id) => {
            this.selectedChildId = id;
            this.render();
        };

        window.onSelectBehavior = (bid) => {
            const behaviors = window.GROWTH_BEHAVIORS[this.activeType] || [];
            const found = behaviors.find(b => b.id === bid);
            if (found) {
                this.selectedBehavior = found;
                this.form = {
                    title: found.text,
                    description: '',
                    gold: found.gold,
                    xp: found.xp,
                    water: found.water,
                    sticker: found.sticker
                };
            } else if (bid === 'custom') {
                this.selectedBehavior = { id: 'custom' };
                this.form = {
                    title: '',
                    description: '',
                    gold: this.activeType === 'GOOD' ? 10 : -10,
                    xp: this.activeType === 'GOOD' ? 5 : -5,
                    water: 0,
                    sticker: 0
                };
            }
            this.render();
        };

        window.updateBehaviorForm = (field, value) => {
            this.form[field] = value;
            // No full render for every keystroke to keep focus, but update state
        };

        window.submitBehaviorLog = () => {
            this.submitLog();
        };

        this.render();
    }

    resetForm() {
        this.selectedBehavior = null;
        this.form = { title: '', description: '', gold: 0, xp: 0, water: 0, sticker: 0 };
    }

    async submitLog() {
        if (!this.selectedChildId || !this.selectedBehavior) return;

        // Get actual values from inputs since we don't render on every keystroke
        const titleInput = this.querySelector('#bh-title');
        const descInput = this.querySelector('#bh-desc');
        const goldInput = this.querySelector('#bh-gold');
        const xpInput = this.querySelector('#bh-xp');
        const waterInput = this.querySelector('#bh-water');
        const stickerInput = this.querySelector('#bh-sticker');

        const finalData = {
            title: titleInput ? titleInput.value : this.form.title,
            description: descInput ? descInput.value : this.form.description,
            gold: goldInput ? parseInt(goldInput.value) : this.form.gold,
            xp: xpInput ? parseInt(xpInput.value) : this.form.xp,
            water: waterInput ? parseInt(waterInput.value) : this.form.water,
            sticker: stickerInput ? parseInt(stickerInput.value) : this.form.sticker
        };

        if (this.selectedBehavior.id === 'custom' && !finalData.title) {
            if (window.showToast) window.showToast('Vui lòng nhập tên hành động!', 'warning');
            return;
        }

        const btn = this.querySelector('#submit-bh-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="animate-spin material-symbols-outlined text-sm">progress_activity</span> ĐANG LƯU...';
        }

        try {
            await window.AppState.logBehavior(this.selectedChildId, this.selectedBehavior.id, this.activeType, finalData);
            if (window.showToast) window.showToast('Đã ghi nhận hành động!', 'success');
            this.isOpen = false;
            this.resetForm();
            this.render();
        } catch (err) {
            console.error('Log behavior failed:', err);
            if (window.showToast) window.showToast('Lỗi khi ghi nhận!', 'error');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = 'GHI VÀO NHẬT KÝ';
            }
        }
    }

    render() {
        if (!this.data) return;
        const children = this.data.leaderboard ? this.data.leaderboard.filter(p => p.role === 'child') : [];
        const behaviors = window.GROWTH_BEHAVIORS ? (window.GROWTH_BEHAVIORS[this.activeType] || []) : [];

        const modalClasses = this.isOpen
            ? "fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md opacity-100 transition-all duration-300"
            : "fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md opacity-0 pointer-events-none transition-all duration-300";

        const contentClasses = this.isOpen
            ? "bg-white dark:bg-[#1a140c] w-full max-w-2xl max-h-[90vh] rounded-[3rem] shadow-2xl transform scale-100 transition-all duration-300 flex flex-col overflow-hidden border border-white/20"
            : "bg-white dark:bg-[#1a140c] w-full max-w-2xl max-h-[90vh] rounded-[3rem] shadow-2xl transform scale-95 transition-all duration-300 flex flex-col overflow-hidden border border-white/20";

        this.innerHTML = `
            <div id="behavior-log-modal" class="${modalClasses}">
                <div class="${contentClasses}">

                    <!-- Header -->
                    <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#1a140c]">
                        <div class="flex items-center gap-4">
                            <div class="${this.activeType === 'GOOD' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-500 shadow-rose-200'} p-3 rounded-2xl shadow-lg text-white">
                                <span class="material-symbols-outlined text-2xl" style="font-variation-settings:'FILL' 1">
                                    ${this.activeType === 'GOOD' ? 'auto_awesome' : 'warning'}
                                </span>
                            </div>
                            <div>
                                <h2 class="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">Ghi Nhật Ký</h2>
                                <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">${this.activeType === 'GOOD' ? 'Khen ngợi con yêu' : 'Nhắc nhở con rèn luyện'}</p>
                            </div>
                        </div>
                        <button onclick="window.closeBehaviorLogModal()" class="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-50 dark:bg-slate-800 rounded-full transition-all">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <!-- Main Content Scroll Area -->
                    <div class="flex-grow overflow-y-auto p-8 space-y-8">
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            <!-- Left Column: Selection -->
                            <div class="space-y-6">
                                <!-- Child Selection -->
                                <div class="space-y-3">
                                    <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">1. Chọn con</label>
                                    <div class="flex flex-wrap gap-2">
                                        ${children.map(c => `
                                            <button onclick="window.selectBehaviorChild('${c.id}')" class="flex-shrink-0 flex items-center gap-2 p-1.5 pr-4 rounded-full border-2 transition-all ${this.selectedChildId === c.id ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 opacity-60'}">
                                                <img src="${c.avatar}" class="w-8 h-8 rounded-full border border-white shadow-sm">
                                                <span class="font-bold text-xs dark:text-white">${c.name}</span>
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>

                                <!-- Behavior Tabs -->
                                <div class="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl gap-1">
                                    <button onclick="window.setBehaviorType('GOOD')" class="flex-1 py-2 px-4 rounded-xl font-black text-[10px] transition-all flex items-center justify-center gap-2 ${this.activeType === 'GOOD' ? 'bg-white dark:bg-emerald-600 text-emerald-600 dark:text-white shadow-sm' : 'text-slate-400'}">
                                        VIỆC TỐT
                                    </button>
                                    <button onclick="window.setBehaviorType('BAD')" class="flex-1 py-2 px-4 rounded-xl font-black text-[10px] transition-all flex items-center justify-center gap-2 ${this.activeType === 'BAD' ? 'bg-white dark:bg-rose-600 text-rose-600 dark:text-white shadow-sm' : 'text-slate-400'}">
                                        NHẮC NHỞ
                                    </button>
                                </div>

                                <!-- Behavior List -->
                                <div class="space-y-3">
                                    <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">2. Chọn hành động</label>
                                    <div class="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto scrollbar-hide pr-1">
                                        ${behaviors.map(b => `
                                            <button onclick="window.onSelectBehavior('${b.id}')" class="flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${this.selectedBehavior?.id === b.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-50 dark:border-slate-800/50 bg-slate-50 dark:bg-white/5 hover:border-slate-200'}">
                                                <span class="text-2xl">${b.emoji}</span>
                                                <span class="font-bold text-sm text-slate-700 dark:text-slate-200">${b.text}</span>
                                            </button>
                                        `).join('')}
                                        <button onclick="window.onSelectBehavior('custom')" class="flex items-center gap-3 p-3 rounded-2xl border-2 border-dashed text-left transition-all ${this.selectedBehavior?.id === 'custom' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-primary/50'}">
                                            <span class="material-symbols-outlined text-2xl">edit_note</span>
                                            <span class="font-bold text-sm">Hành động tự điền...</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column: Detail Form -->
                            <div class="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-6 space-y-5 border border-slate-100 dark:border-slate-800">
                                ${!this.selectedBehavior ? `
                                    <div class="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                                        <div class="size-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700">
                                            <span class="material-symbols-outlined text-3xl">stylus_note</span>
                                        </div>
                                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Vui lòng chọn một hành động để ghi chi tiết</p>
                                    </div>
                                ` : `
                                    <div class="space-y-4">
                                        <!-- Title (Only for custom) -->
                                        <div class="space-y-2">
                                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tiêu đề</label>
                                            <input id="bh-title" type="text" placeholder="Ví dụ: Lễ phép, Tự lập..." 
                                                class="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm font-bold focus:border-primary outline-none transition-all dark:text-white" 
                                                value="${this.form.title}" ${this.selectedBehavior.id !== 'custom' ? 'readonly' : ''}>
                                        </div>

                                        <!-- Description -->
                                        <div class="space-y-2">
                                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mô tả chi tiết</label>
                                            <textarea id="bh-desc" rows="3" placeholder="Ghi cụ thể việc con làm... ví dụ: Chào ông bà khi khách tới chơi" 
                                                class="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm font-medium focus:border-primary outline-none transition-all dark:text-white resize-none">${this.form.description}</textarea>
                                        </div>

                                        <!-- Rewards -->
                                        <div class="space-y-3 pt-2">
                                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Thông số quà tặng</label>
                                            <div class="grid grid-cols-2 gap-3">
                                                <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                                    <span class="material-symbols-outlined text-orange-400 text-xl" style="font-variation-settings:'FILL' 1">monetization_on</span>
                                                    <input id="bh-gold" type="number" class="w-full bg-transparent font-black text-sm outline-none dark:text-white" value="${this.form.gold}">
                                                </div>
                                                <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                                    <span class="material-symbols-outlined text-amber-500 text-xl">military_tech</span>
                                                    <input id="bh-xp" type="number" class="w-full bg-transparent font-black text-sm outline-none dark:text-white" value="${this.form.xp}">
                                                </div>
                                                <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                                    <span class="material-symbols-outlined text-blue-400 text-xl" style="font-variation-settings:'FILL' 1">water_drop</span>
                                                    <input id="bh-water" type="number" class="w-full bg-transparent font-black text-sm outline-none dark:text-white" value="${this.form.water}">
                                                </div>
                                                <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                                    <span class="material-symbols-outlined text-purple-400 text-xl" style="font-variation-settings:'FILL' 1">sell</span>
                                                    <input id="bh-sticker" type="number" class="w-full bg-transparent font-black text-sm outline-none dark:text-white" value="${this.form.sticker}">
                                                </div>
                                            </div>
                                        </div>

                                        <button onclick="window.submitBehaviorLog()" id="submit-bh-btn" class="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all mt-4 flex items-center justify-center gap-3">
                                            GHI VÀO NHẬT KÝ
                                            <span class="material-symbols-outlined text-sm">auto_stories</span>
                                        </button>
                                    </div>
                                `}
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        `;

        const modal = this.querySelector('#behavior-log-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) window.closeBehaviorLogModal();
            });
        }
    }
}
customElements.define('behavior-log-modal', BehaviorLogModal);
// ==========================================
// GROWTH DIARY VIEW (CHILD)
// ==========================================
class GrowthDiaryView extends HTMLElement {
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
        let auraColor = "emerald";
        if (personalityScore > 100) { auraTitle = "Hào Quang Rực Rỡ"; auraColor = "amber"; }
        else if (personalityScore > 50) { auraTitle = "Trái Tim Ấm Áp"; auraColor = "emerald"; }
        else if (personalityScore > 20) { auraTitle = "Bé Ngoan Đáng Yêu"; auraColor = "blue"; }

        const groupedLogs = {};
        logs.forEach(log => {
            if (!log.createdAt) return;
            const d = new Date(log.createdAt);
            // Use local date string as the display key, but standard ISO date for grouping logic if needed
            const dateDisplay = d.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            if (!groupedLogs[dateDisplay]) groupedLogs[dateDisplay] = { GOOD: [], BAD: [], REFLECTION: [] };

            const title = (log.itemTitle || "").toLowerCase();
            const desc = (log.itemDesc || "").toLowerCase();

            // Comprehensive reflection detection
            const isReflection = title.includes('tự đánh giá') ||
                title.includes('nhật ký') ||
                log.type === 'reflection' ||
                (log.type === 'behavior_good' && title.includes('/10'));

            if (isReflection) {
                groupedLogs[dateDisplay].REFLECTION.push(log);
            } else if (log.type === 'behavior_good') {
                groupedLogs[dateDisplay].GOOD.push(log);
            } else {
                groupedLogs[dateDisplay].BAD.push(log);
            }
        });

        const dateKeys = Object.keys(groupedLogs);

        window.showGrowthDetail = (logId) => {
            const log = logs.find(l => l.id === logId);
            if (!log) return;
            const [title, description] = log.itemTitle.includes(' | ') ? log.itemTitle.split(' | ') : [log.itemTitle, ''];
            const isBad = log.type === 'behavior_bad';
            const isResolved = log.itemTitle.includes('Đã chuộc lỗi ✨');

            const modal = document.createElement('div');
            modal.id = 'diary-detail-modal';
            modal.className = 'fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300';
            modal.innerHTML = `
                <div class="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                    <!-- Decor Top -->
                    <div class="h-24 bg-gradient-to-r ${isBad ? 'from-rose-400 to-rose-500' : 'from-emerald-400 to-emerald-500'} flex items-center justify-center">
                        <div class="size-20 bg-white rounded-[2rem] shadow-lg flex items-center justify-center text-4xl transform translate-y-8">
                            ${isBad ? (isResolved ? '✅' : '🌱') : '✨'}
                        </div>
                    </div>

                    <div class="p-10 pt-12 text-center space-y-6">
                        <div>
                            <h3 class="text-2xl font-black text-slate-800">${title}</h3>
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">${log.time}</p>
                        </div>

                        <div class="space-y-2">
                             <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left px-2">Lời nhắn từ Ba Mẹ</p>
                             <div class="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-slate-600 font-medium leading-relaxed italic text-sm text-left relative overflow-hidden">
                                <span class="material-symbols-outlined absolute -right-2 -bottom-2 text-slate-100 text-6xl opacity-50">format_quote</span>
                                "${description || (isBad ? 'Con hãy cố gắng sửa đổi để tốt hơn nhé!' : 'Ba mẹ rất tự hào về con!')}"
                            </div>
                        </div>

                        <div class="flex justify-center gap-6 py-2">
                            ${log.reward !== 0 ? `<div class="flex flex-col items-center gap-1"><span class="material-symbols-outlined text-orange-400 text-2xl" style="font-variation-settings:'FILL' 1">monetization_on</span><span class="text-xs font-black ${log.reward > 0 ? 'text-orange-600' : 'text-rose-500'}">${log.reward > 0 ? '+' : ''}${log.reward}</span></div>` : ''}
                            ${log.xp !== 0 ? `<div class="flex flex-col items-center gap-1"><span class="material-symbols-outlined text-amber-500 text-2xl">military_tech</span><span class="text-xs font-black ${log.xp > 0 ? 'text-amber-600' : 'text-rose-500'}">${log.xp > 0 ? '+' : ''}${log.xp}</span></div>` : ''}
                        </div>

                        <div class="grid grid-cols-1 gap-3">
                            ${isBad && !isResolved ? `
                                <button onclick="window.handleAtonement('${log.id}')" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                                    <span class="material-symbols-outlined">auto_awesome</span>
                                    CON HỨA SẼ SỬA SAI
                                </button>
                            ` : ''}
                            <button onclick="document.getElementById('diary-detail-modal').remove()" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black py-4 rounded-2xl transition-all">
                                ĐÓNG
                            </button>
                        </div>
                    </div>
                </div>
            `;
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
            document.body.appendChild(modal);
        };

        window.handleAtonement = (logId) => {
            const log = logs.find(l => l.id === logId);
            if (!log) return;
            window.showAtonementModal(logId);
        };

        window.showAtonementModal = (logId) => {
            const log = logs.find(l => l.id === logId);
            const [title] = log.itemTitle.split(' | ');

            const modal = document.createElement('div');
            modal.id = 'atonement-modal';
            modal.className = 'fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300';
            modal.innerHTML = `
                <div class="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-10 text-center space-y-8 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                    
                    <div class="size-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                        <span class="material-symbols-outlined text-5xl text-emerald-500">auto_awesome</span>
                    </div>

                    <div class="space-y-2">
                        <h3 class="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">Con hứa sửa sai</h3>
                        <p class="text-xs font-bold text-slate-400">Cho lỗi: <span class="text-rose-500">${title}</span></p>
                    </div>

                    <div class="space-y-3">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left px-2">Kế hoạch của con là gì?</p>
                        <textarea id="atonement-input" placeholder="Ví dụ: Con sẽ xin lỗi em và dọn đồ ngay..." 
                            class="w-full h-32 bg-slate-50 border-2 border-slate-100 focus:border-emerald-400 focus:ring-0 rounded-[2rem] p-6 text-sm font-medium text-slate-600 transition-all resize-none placeholder:text-slate-300"></textarea>
                    </div>

                    <div class="flex gap-4">
                        <button onclick="document.getElementById('atonement-modal').remove()" class="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all">HỦY</button>
                        <button id="submit-atonement" class="flex-1 py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all">GỬI LỜI HỨA</button>
                    </div>
                </div>
             `;

            modal.querySelector('#submit-atonement').onclick = async () => {
                const action = modal.querySelector('#atonement-input').value.trim();
                if (!action) {
                    window.showFamilyQuestAlert("Lưu ý", "Con hãy ghi lại hành động mình sẽ làm nhé!", "warning");
                    return;
                }

                modal.querySelector('#submit-atonement').disabled = true;
                modal.querySelector('#submit-atonement').innerText = "ĐANG GỬI...";

                try {
                    const success = await window.AppState.resolveBehavior(logId, {
                        title: "Sửa sai: " + title,
                        description: action
                    });

                    if (success) {
                        document.getElementById('atonement-modal').remove();
                        document.getElementById('diary-detail-modal')?.remove();

                        // Nice celebration
                        if (window.confetti) {
                            window.confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                        }

                        setTimeout(() => {
                            window.showFamilyQuestAlert("Thành công", "Tuyệt vời! Ba mẹ đã nhận được lời hứa của con. Hãy thực hiện nó thật tốt nhé ✨", "success");
                        }, 300);
                    } else {
                        throw new Error("Failed to save atonement");
                    }
                } catch (err) {
                    console.error("Atonement error:", err);
                    modal.querySelector('#submit-atonement').disabled = false;
                    modal.querySelector('#submit-atonement').innerText = "GỬI LỜI HỨA";
                    window.showFamilyQuestAlert("Lỗi hệ thống", "Không thể gửi lời hứa lúc này. Con hãy thử lại sau nhé! 🛠️", "error");
                }
            };

            document.body.appendChild(modal);
        };

        this.innerHTML = `
            <div class="relative space-y-12 pb-20 px-4 sm:px-8">
                <!-- Dynamic Background that supports dark mode -->
                <div class="absolute inset-0 bg-[#fdfcfb] dark:bg-[#1a140c] -mx-4 sm:-mx-8 rounded-[4rem] -z-10 shadow-2xl border border-slate-100 dark:border-[#3a2e22]"></div>

                <!-- Summary Header -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white dark:bg-[#2c2215]/50 p-10 rounded-[3.5rem] shadow-xl relative overflow-hidden mt-8 border border-orange-100/50 dark:border-[#3a2e22]">
                    <div class="absolute top-0 right-0 w-80 h-80 bg-${auraColor}-500/10 rounded-full -mr-40 -mt-40 blur-3xl"></div>
                    
                    <div class="flex flex-col justify-center text-center md:text-left">
                        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Trạng thái hiện tại</p>
                        <h3 class="text-4xl font-black text-${auraColor}-600 mb-1 leading-tight">${auraTitle}</h3>
                        <p class="text-sm font-bold text-slate-500">Bé đã tích lũy <span class="text-emerald-500 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">${goodCount} điều hay</span></p>
                    </div>

                    <div class="flex flex-col items-center justify-center p-8 bg-slate-50/50 dark:bg-[#1a140c]/30 rounded-[3rem] border border-slate-100 dark:border-[#3a2e22] shadow-inner">
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Điểm Nhân Cách</span>
                        <div class="flex items-center gap-4">
                            <div class="size-14 rounded-2xl bg-primary/20 flex items-center justify-center shadow-sm">
                                <span class="material-symbols-outlined text-4xl text-primary" style="font-variation-settings:'FILL' 1">favorite</span>
                            </div>
                            <span class="text-6xl font-black text-slate-800 dark:text-white tabular-nums">${personalityScore}</span>
                        </div>
                    </div>

                    <div class="flex flex-col justify-center p-8 space-y-4">
                        <div class="flex justify-between items-end">
                            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Chỉ số rèn luyện</span>
                            <span class="text-[10px] font-black text-emerald-500">${Math.round(goodCount + badCount > 0 ? (goodCount / (goodCount + badCount) * 100) : 100)}% Bé ngoan</span>
                        </div>
                        <div class="w-full h-5 bg-slate-200 dark:bg-[#1a140c]/50 rounded-full overflow-hidden p-1 shadow-inner">
                            <div class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 shadow-sm" style="width: ${goodCount + badCount > 0 ? (goodCount / (goodCount + badCount) * 100) : 100}%"></div>
                        </div>
                        <div class="flex justify-between items-center text-[10px] font-bold text-slate-500">
                            <span class="flex items-center gap-1"><span class="size-2 rounded-full bg-emerald-500"></span> ${goodCount} Khen ngợi</span>
                            <span class="flex items-center gap-1"><span class="size-2 rounded-full bg-rose-500"></span> ${badCount} Nhắc nhở</span>
                        </div>
                    </div>
                </div>

                <!-- Daily History Section -->
                <div class="space-y-10">
                    <div class="flex items-center justify-between px-4">
                        <h4 class="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-4">
                            <span class="material-symbols-outlined text-primary text-4xl">Auto_Stories</span>
                            Hành Trình Trưởng Thành
                        </h4>
                    </div>

                    ${dateKeys.length === 0 ? `
                        <div class="py-24 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-200 shadow-sm mx-4">
                            <div class="size-28 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span class="material-symbols-outlined text-6xl text-slate-200">import_contacts</span>
                            </div>
                            <h3 class="text-2xl font-black text-slate-800">Bắt đầu những trang nhật ký</h3>
                            <p class="text-slate-400 max-w-sm mx-auto text-base font-medium leading-relaxed">Ba mẹ hãy ghi lại những hành động đầu tiên của con ngay hôm nay nhé!</p>
                        </div>
                    ` : dateKeys.map((date, idx) => `
                        <div class="bg-white dark:bg-[#2c2215] rounded-[4rem] border border-slate-100 dark:border-[#3a2e22] overflow-hidden shadow-lg border-b-4 border-b-slate-200/50 dark:border-b-[#1a140c]">
                            <details ${idx === 0 ? 'open' : ''} class="group">
                                <summary class="flex items-center justify-between p-8 sm:p-10 cursor-pointer list-none select-none hover:bg-slate-50 dark:hover:bg-[#362a1a] transition-colors">
                                    <div class="flex items-center gap-5">
                                        <div class="size-16 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                                            <span class="material-symbols-outlined text-2xl">calendar_today</span>
                                        </div>
                                        <div>
                                            <h5 class="text-2xl font-black text-slate-800 dark:text-white">${date === new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) ? 'Hôm nay' : date}</h5>
                                            <p class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                                                ${groupedLogs[date].GOOD.length} VIỆC TỐT • 
                                                ${groupedLogs[date].BAD.length} CẦN RÈN LUYỆN 
                                                ${groupedLogs[date].REFLECTION.length > 0 ? `• ${groupedLogs[date].REFLECTION.length} NHẬT KÝ` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="size-12 rounded-full bg-slate-100 dark:bg-[#1a140c] flex items-center justify-center group-open:rotate-180 transition-transform duration-500 shadow-sm">
                                        <span class="material-symbols-outlined text-slate-400 dark:text-slate-300 text-3xl">expand_more</span>
                                    </div>
                                </summary>
                                                                <div class="px-4 sm:px-8 pb-10 pt-2 space-y-8">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <!-- GOOD COLUMN -->
                                        <div class="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-[3rem] p-6 sm:p-8 space-y-5 border border-emerald-100 dark:border-emerald-800/30 shadow-inner">
                                            <div class="flex items-center gap-4 mb-3 px-2">
                                                <div class="size-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-100 dark:shadow-none">
                                                    <span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' 1">sunny</span>
                                                </div>
                                                <span class="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">Những mầm tốt</span>
                                            </div>
                                            ${groupedLogs[date].GOOD.length === 0 ? `<div class="p-10 rounded-3xl border-2 border-dashed border-emerald-100 text-center italic text-xs text-emerald-400 font-bold bg-white/50">Ngày hôm nay con chưa có ghi nhận tốt</div>` : groupedLogs[date].GOOD.map(log => this.renderLogItem(log, true)).join('')}
                                        </div>

                                        <!-- BAD COLUMN -->
                                        <div class="bg-rose-50/50 dark:bg-rose-900/10 rounded-[3rem] p-6 sm:p-8 space-y-5 border border-rose-100 dark:border-rose-800/35 shadow-inner">
                                            <div class="flex items-center gap-4 mb-3 px-2">
                                                <div class="size-10 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-100 dark:shadow-none">
                                                    <span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' 1">history_edu</span>
                                                </div>
                                                <span class="text-[11px] font-black uppercase tracking-[0.3em] text-rose-600 dark:text-rose-400">Bài học rèn luyện</span>
                                            </div>
                                            ${groupedLogs[date].BAD.length === 0 ? `<div class="p-10 rounded-3xl border-2 border-dashed border-rose-100 text-center italic text-xs text-rose-400 font-bold bg-white/50">Con đã rèn luyện rất tốt hôm nay!</div>` : groupedLogs[date].BAD.map(log => this.renderLogItem(log, false)).join('')}
                                        </div>
                                    </div>

                                    <!-- REFLECTION SECTION AT BOTTOM -->
                                    ${groupedLogs[date].REFLECTION.length > 0 ? `
                                        <div class="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-[#1a140c] dark:to-[#2c2215]/50 rounded-[3.5rem] p-8 sm:p-10 border border-indigo-100 dark:border-[#3a2e22] shadow-inner">
                                            <div class="flex items-center gap-4 mb-6 px-2">
                                                <div class="size-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 dark:shadow-none">
                                                    <span class="material-symbols-outlined text-2xl">auto_awesome</span>
                                                </div>
                                                <span class="text-lg font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Lời Tự Sự Của Con</span>
                                            </div>
                                            
                                            <div class="space-y-6">
                                                ${groupedLogs[date].REFLECTION.map(log => {
            const ratingMatch = log.itemTitle.match(/(\d+)\/10/);
            const rating = ratingMatch ? ratingMatch[1] : '?';
            const desc = (log.itemTitle.includes(' | ') ? log.itemTitle.split(' | ')[1] : log.itemDesc) || "Con hôm nay thật tuyệt vời!";
            return `
                                                        <div class="bg-white dark:bg-[#1a140c]/80 rounded-[2.5rem] p-8 shadow-sm border border-indigo-50 dark:border-[#3a2e22] relative overflow-hidden group hover:shadow-md transition-all">
                                                            <div class="absolute top-0 right-0 p-6">
                                                                <div class="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-rose-900/20 rounded-full border border-red-100 dark:border-rose-900/30">
                                                                    <span class="material-symbols-outlined text-red-500 text-sm fill-1">favorite</span>
                                                                    <span class="text-sm font-black text-red-600 dark:text-rose-400">${rating}/10</span>
                                                                </div>
                                                            </div>
                                                            <div class="flex gap-6 items-start">
                                                                <span class="text-5xl opacity-20 text-indigo-300 dark:text-[#3a2e22] font-serif italic">"</span>
                                                                <div class="flex-1">
                                                                    <p class="text-xl sm:text-2xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic mb-4 pt-4 pr-20">${desc}</p>
                                                                    <div class="flex items-center gap-2 text-[10px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest">
                                                                        <span class="material-symbols-outlined text-xs">schedule</span>
                                                                        Ghi nhận lúc ${log.time ? log.time.split(' ')[1] : ''}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    `;
        }).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </details>
                        </div>
                    `).join('')}
                </div>

                <!-- Daily Reflection Corner -->
                <div class="bg-gradient-to-br from-white via-emerald-50 to-green-100 dark:from-[#2c2215] dark:via-[#2c2215] dark:to-[#1a140c] rounded-[3rem] p-8 sm:p-16 text-slate-800 dark:text-white relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] border border-emerald-100 dark:border-[#3a2e22] mt-12 mx-auto max-w-5xl">
                     <!-- Soft Natural Glows -->
                     <div class="absolute -top-32 -right-32 size-64 bg-emerald-500/10 rounded-full blur-[100px]"></div>
                     <div class="absolute -bottom-32 -left-32 size-64 bg-green-500/10 rounded-full blur-[100px]"></div>
                     
                     <div class="relative z-10 flex flex-col items-center gap-10">
                        <div class="text-center space-y-3">
                            <h3 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">Góc Nhìn Lại Hôm Nay</h3>
                            <p class="text-slate-500 dark:text-slate-400 font-medium text-base sm:text-lg">Con hãy tự chấm điểm cho ngày hôm nay của mình thật trung thực nhé!</p>
                        </div>

                        <!-- 10 Red Hearts -->
                        <div class="flex flex-wrap justify-center gap-4 sm:gap-6 py-4">
                            ${Array.from({ length: 10 }).map((_, i) => {
            const rating = i + 1;
            const currentRating = parseInt(localStorage.getItem('daily_rating_' + data.user.id)) || 0;
            const isActive = rating <= currentRating;
            return `
                                    <button onclick="window.setDailyRating(${rating})" 
                                        class="heart-btn group relative transition-all active:scale-75 ${isActive ? 'scale-115' : 'opacity-40 hover:opacity-100'}">
                                        <div class="absolute inset-0 bg-red-500/10 blur-xl opacity-0 ${isActive ? 'opacity-100' : ''} group-hover:opacity-40 transition-opacity"></div>
                                        <span class="material-symbols-outlined text-4xl sm:text-5xl ${isActive ? 'text-red-500 fill-1' : 'text-slate-300'} transition-all drop-shadow-sm" 
                                              style="font-variation-settings: 'FILL' ${isActive ? '1' : '0'}">
                                            favorite
                                        </span>
                                        <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black ${isActive ? 'text-red-500' : 'text-slate-400'} uppercase transition-colors">${rating}</span>
                                    </button>
                                `;
        }).join('')}
                        </div>

                        <!-- Reflection Input Area -->
                        <div class="w-full space-y-6">
                            <div class="relative group">
                                <textarea id="reflection-text" 
                                    class="w-full bg-white dark:bg-[#1a140c] border-2 border-emerald-100 dark:border-[#3a2e22] rounded-[2.5rem] p-8 sm:p-10 text-lg sm:text-2xl font-medium text-slate-700 dark:text-slate-200 focus:ring-8 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/5 focus:border-emerald-300 transition-all outline-none min-h-[220px] placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner resize-none lg:pr-24"
                                    placeholder="Hôm nay có điều gì làm con vui hay buồn không? Hãy tâm sự với ba mẹ nhé...">${localStorage.getItem('daily_reflection_' + data.user.id) || ''}</textarea>
                                
                                <button id="voice-record-btn" onclick="window.toggleVoiceRecording()" class="mt-4 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:right-8 size-16 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-2xl flex items-center justify-center shadow-md transition-all group/mic active:scale-95">
                                    <span id="voice-mic-icon" class="material-symbols-outlined text-emerald-600 text-3xl group-hover/mic:scale-110">mic</span>
                                </button>
                            </div>

                            <button onclick="window.saveDailyReflection()" 
                                class="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-2xl hover:shadow-emerald-500/30 text-white font-black text-xl py-6 rounded-[2rem] shadow-xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] uppercase tracking-widest">
                                <span class="material-symbols-outlined text-2xl">menu_book</span>
                                Ghi Vào Nhật Ký Trưởng Thành
                            </button>
                        </div>
                     </div>
                </div>
            </div>
        `;

        // Voice Recording Logic
        let recognition = null;
        let isRecording = false;

        window.toggleVoiceRecording = () => {
            const btn = document.getElementById('voice-record-btn');
            const icon = document.getElementById('voice-mic-icon');
            const textarea = document.getElementById('reflection-text');

            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                window.showFamilyQuestAlert("Thông báo", "Rất tiếc, trình duyệt của con không hỗ trợ ghi âm. Hãy gõ chữ nhé!", "info");
                return;
            }

            if (!recognition) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognition = new SpeechRecognition();
                recognition.lang = 'vi-VN';
                recognition.continuous = true;
                recognition.interimResults = true;

                recognition.onstart = () => {
                    isRecording = true;
                    btn.classList.add('bg-red-50', 'border-red-200', 'animate-pulse');
                    icon.classList.add('text-red-500');
                    icon.innerText = 'graphic_eq';
                };

                recognition.onresult = (event) => {
                    let final_transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            final_transcript += event.results[i][0].transcript;
                        }
                    }
                    if (final_transcript) {
                        textarea.value += (textarea.value ? ' ' : '') + final_transcript;
                        textarea.scrollTop = textarea.scrollHeight;
                    }
                };

                recognition.onerror = (event) => {
                    console.error("Speech recognition error", event.error);
                    stopRecording();
                };

                recognition.onjoin = () => { };
                recognition.onend = () => {
                    stopRecording();
                };
            }

            const stopRecording = () => {
                isRecording = false;
                btn.classList.remove('bg-red-50', 'border-red-200', 'animate-pulse');
                icon.classList.remove('text-red-500');
                icon.innerText = 'mic';
                if (recognition) recognition.stop();
            };

            if (isRecording) {
                stopRecording();
            } else {
                try {
                    recognition.start();
                } catch (e) {
                    console.log("Recognition error:", e);
                    stopRecording();
                }
            }
        };

        window.setDailyRating = (rating) => {
            if (rating > 0) {
                localStorage.setItem('daily_rating_' + data.user.id, rating);
            } else {
                localStorage.removeItem('daily_rating_' + data.user.id);
            }
            document.querySelectorAll('.heart-btn').forEach((btn, i) => {
                const r = i + 1;
                const icon = btn.querySelector('.material-symbols-outlined');
                const label = btn.querySelector('span:last-child');
                const glow = btn.querySelector('.blur-xl');
                if (r <= rating && rating > 0) {
                    btn.classList.remove('opacity-40');
                    btn.classList.add('scale-115');
                    icon.classList.add('text-red-500');
                    icon.classList.remove('text-slate-300');
                    icon.style.fontVariationSettings = "'FILL' 1";
                    label.classList.add('text-red-500');
                    label.classList.remove('text-slate-400');
                    if (glow) glow.classList.add('opacity-100');
                } else {
                    btn.classList.add('opacity-40');
                    btn.classList.remove('scale-115');
                    icon.classList.add('text-slate-200');
                    icon.classList.remove('text-red-500');
                    icon.style.fontVariationSettings = "'FILL' 0";
                    label.classList.remove('text-red-500');
                    label.classList.add('text-slate-400');
                    if (glow) glow.classList.remove('opacity-100');
                }
            });
            if (window.confetti && rating > 0) {
                window.confetti({ particleCount: 20 * rating, spread: 85, origin: { y: 0.85 }, colors: ['#ef4444', '#ffffff'] });
            }
        };

        window.saveDailyReflection = async () => {
            const textarea = document.getElementById('reflection-text');
            const text = textarea ? textarea.value.trim() : '';
            const rating = localStorage.getItem('daily_rating_' + data.user.id);

            if (!rating) {
                window.showFamilyQuestAlert("Nhắc nhở", "Con hãy chọn số trái tim để đánh giá ngày hôm nay nhé!", "warning");
                return;
            }

            // Pre-save UI state for potential rollback
            const backupText = text;
            const backupRating = rating;

            // CRITICAL: Clear storage and UI BEFORE the async call to prevent race conditions
            // with subscription-based re-renders during the await period.
            localStorage.removeItem('daily_rating_' + data.user.id);
            localStorage.removeItem('daily_reflection_' + data.user.id);
            if (textarea) textarea.value = '';
            window.setDailyRating(0);

            if (window.AppState) {
                try {
                    const result = await window.AppState.resolveBehavior(null, {
                        title: `Tự đánh giá: ${rating}/10 điểm`,
                        description: text || "Con cảm thấy hài lòng với hôm nay!"
                    });

                    if (result) {
                        if (window.confetti) {
                            window.confetti({ particleCount: 200, spread: 150, origin: { y: 0.7 }, colors: ['#10b981', '#ffffff'] });
                        }
                        window.showFamilyQuestAlert("Tuyệt vời", "Nhật ký của con đã được lưu vào 'Hành Trình Trưởng Thành' ở phía trên rồi nhé! ✨", "success");

                        // Scroll to top and force final render
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        this.render(window.AppState.data);
                    } else {
                        throw new Error("Save returned null/false");
                    }
                } catch (err) {
                    console.error("Diary save error:", err);
                    // Rollback on failure
                    localStorage.setItem('daily_rating_' + data.user.id, backupRating);
                    localStorage.setItem('daily_reflection_' + data.user.id, backupText);
                    if (textarea) textarea.value = backupText;
                    window.setDailyRating(backupRating);
                    window.showFamilyQuestAlert("Lỗi hệ thống", "Rất tiếc, đã có lỗi khi lưu nhật ký. Con hãy thử lại sau nhé! 🛠️", "error");
                }
            }
        };
    }

    renderLogItem(log, isGood) {
        const behaviorList = window.GROWTH_BEHAVIORS[isGood ? 'GOOD' : 'BAD'] || [];
        const [title, splitDesc] = log.itemTitle.includes(' | ') ? log.itemTitle.split(' | ') : [log.itemTitle, ''];
        const description = splitDesc || log.itemDesc || '';
        const behavior = behaviorList.find(b => b.text === title);

        const isRepairing = log.status === 'repairing';
        const isResolved = log.status === 'resolved' || log.itemTitle.includes('Đã sửa lỗi hoàn hảo ✨');

        let emoji = '🌟';
        if (!isGood) emoji = '⚠️';
        if (isRepairing) emoji = '⏳';
        if (isResolved) emoji = '✨';
        if (log.itemTitle.includes('Tự đánh giá:')) emoji = '📖';
        if (behavior && !isRepairing && !isResolved) emoji = behavior.emoji;

        return `
            <div onclick="window.showGrowthDetail('${log.id}')" class="group p-5 rounded-2xl bg-white dark:bg-[#1a140c]/50 border ${isResolved ? 'border-emerald-200 dark:border-emerald-900/30 opacity-90' : (isRepairing ? 'border-orange-200 dark:border-orange-900/30' : 'border-slate-100 dark:border-[#3a2e22]')} hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer relative overflow-hidden">
                ${isResolved ? '<div class="absolute top-0 right-0 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-bl-xl shadow-sm">ĐÃ SỬA SAI HOÀN HẢO ✨</div>' : ''}
                ${isRepairing ? '<div class="absolute top-0 right-0 px-3 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-[8px] font-black uppercase tracking-widest rounded-bl-xl shadow-sm">BA MẸ ĐANG KIỂM TRA ⏳</div>' : ''}
                <div class="flex items-start gap-4">
                    <span class="text-3xl group-hover:scale-110 transition-transform duration-300 select-none">${emoji}</span>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start mb-0.5">
                            <h6 class="font-black ${isResolved ? 'text-emerald-700 dark:text-emerald-400' : (isRepairing ? 'text-orange-700 dark:text-orange-400' : 'text-slate-800 dark:text-white')} text-sm sm:text-base leading-tight truncate">${title}</h6>
                            <span class="text-[9px] font-bold text-slate-300 dark:text-slate-500 uppercase shrink-0 ml-2">${log.time ? log.time.split(' ')[0] : ''}</span>
                        </div>
                        
                        ${description ? `<p class="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">${description}</p>` : ''}
                        
                        <div class="flex flex-wrap gap-1.5">
                            ${log.reward !== 0 ? `<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-black ${log.reward > 0 ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'}"><span class="material-symbols-outlined text-[12px]" style="font-variation-settings:'FILL' 1">monetization_on</span>${log.reward > 0 ? '+' : ''}${log.reward}</div>` : ''}
                            ${log.xp !== 0 ? `<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-black ${log.xp > 0 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}"><span class="material-symbols-outlined text-[12px]">military_tech</span>${log.xp > 0 ? '+' : ''}${log.xp}</div>` : ''}
                            ${log.water > 0 ? `<div class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-black"><span class="material-symbols-outlined text-[12px]" style="font-variation-settings:'FILL' 1">water_drop</span>+${log.water}</div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('growth-diary-view', GrowthDiaryView);

class ParentPinModal extends HTMLElement {
    constructor() {
        super();
        this.pin = '';
    }

    connectedCallback() {
        window.openParentPinModal = () => this.open();
        window.closeParentPinModal = () => this.close();
        this.render();
    }

    open() {
        const modal = this.querySelector('#parent-pin-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            this.pin = '';
            this.updatePinDisplay();
            this.clearError();
        }
    }

    close() {
        const modal = this.querySelector('#parent-pin-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    updatePinDisplay() {
        const dots = this.querySelectorAll('.pin-dot');
        dots.forEach((dot, idx) => {
            if (idx < this.pin.length) {
                dot.classList.add('bg-primary', 'scale-110');
                dot.classList.remove('bg-slate-200', 'dark:bg-slate-800');
            } else {
                dot.classList.remove('bg-primary', 'scale-110');
                dot.classList.add('bg-slate-200', 'dark:bg-slate-800');
            }
        });
    }

    handleKey(key) {
        if (this.pin.length < 4) {
            this.pin += key;
            this.updatePinDisplay();
            if (this.pin.length === 4) {
                setTimeout(() => this.verifyPin(), 200);
            }
        }
    }

    handleDelete() {
        if (this.pin.length > 0) {
            this.pin = this.pin.slice(0, -1);
            this.updatePinDisplay();
        }
    }

    async verifyPin() {
        const leaderboard = window.AppState?.data?.leaderboard || [];
        const parent = leaderboard.find(p => p.role === 'parent');

        if (!parent) {
            this.showError('Không thấy tài khoản Phụ huynh. Hãy đăng nhập lại.');
            setTimeout(() => window.location.href = '../login/index.html', 1500);
            return;
        }

        const correctPin = parent.pinCode || '1234';

        if (this.pin === correctPin) {
            localStorage.setItem('family_quest_active_profile', parent.id);
            window.navigateWithTransition('../admin/index.html');
        } else {
            this.showError('Mã PIN không chính xác!');
            this.pin = '';
            const modalBox = this.querySelector('.bg-white, .dark\\:bg-slate-900');
            if (modalBox) {
                modalBox.classList.add('animate-shake');
                setTimeout(() => modalBox.classList.remove('animate-shake'), 400);
            }

            setTimeout(() => {
                this.updatePinDisplay();
            }, 500);
        }
    }

    showError(msg) {
        const errEl = this.querySelector('#pin-error');
        if (errEl) {
            errEl.textContent = msg;
            errEl.classList.remove('hidden');
        }
    }

    clearError() {
        const errEl = this.querySelector('#pin-error');
        if (errEl) {
            errEl.classList.add('hidden');
        }
    }

    render() {
        this.innerHTML = `
            <style>
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
                .animate-shake { animation: shake 0.4s ease-in-out; }
            </style>
            <div id="parent-pin-modal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div class="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl relative animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
                    <div class="p-8 flex flex-col items-center">
                        <button onclick="window.closeParentPinModal()" class="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all">
                            <span class="material-symbols-outlined">close</span>
                        </button>

                        <div class="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 ring-8 ring-primary/5">
                            <span class="material-symbols-outlined text-4xl font-bold">lock_open</span>
                        </div>

                        <h3 class="text-2xl font-black text-slate-800 dark:text-white mb-2 text-center uppercase tracking-tight">Xác thực Phụ huynh</h3>
                        <p class="text-sm font-medium text-slate-500 mb-8 text-center px-4">Vui lòng nhập mã PIN để xác nhận bạn là ba mẹ</p>

                        <div class="flex gap-4 mb-8">
                            <div class="pin-dot w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 transition-all duration-300"></div>
                            <div class="pin-dot w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 transition-all duration-300"></div>
                            <div class="pin-dot w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 transition-all duration-300"></div>
                            <div class="pin-dot w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 transition-all duration-300"></div>
                        </div>

                        <div id="pin-error" class="hidden text-rose-500 text-xs font-bold mb-6">Mã PIN không chính xác!</div>

                        <div class="grid grid-cols-3 gap-4 w-full px-2">
                            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => `
                                <button onclick="this.closest('parent-pin-modal').handleKey('${num}')" class="h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xl font-black text-slate-800 dark:text-white hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm">
                                    ${num}
                                </button>
                            `).join('')}
                            <button onclick="window.location.href='../login/index.html'" class="h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm"
                                    title="Dùng Email">
                                <span class="material-symbols-outlined">mail</span>
                            </button>
                            <button onclick="this.closest('parent-pin-modal').handleKey('0')" class="h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xl font-black text-slate-800 dark:text-white hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm">
                                0
                            </button>
                            <button onclick="this.closest('parent-pin-modal').handleDelete()" class="h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:text-rose-500 transition-all active:scale-95 flex items-center justify-center shadow-sm">
                                <span class="material-symbols-outlined">backspace</span>
                            </button>
                        </div>

                        <div class="mt-8 text-center">
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Cần hỗ trợ?</p>
                            <a href="../login/index.html" class="text-xs font-bold text-primary hover:underline">Quên mã PIN? Đăng nhập qua Email</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('parent-pin-modal', ParentPinModal);

class NotificationBell extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
    }

    connectedCallback() {
        this.render();
        if (window.AppState) {
            window.AppState.subscribe(() => this.render());
        }
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.contains(e.target)) {
                this.isOpen = false;
                this.render();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.render();
    }

    render() {
        if (!window.AppState) return;

        const requests = window.AppState.data.requests || [];
        const pendingRequests = requests.filter(r => r.status === 'pending');
        const count = pendingRequests.length;

        this.innerHTML = `
            <div class="relative">
                <button onclick="event.stopPropagation(); this.closest('notification-bell').toggle()" 
                        class="size-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative text-slate-500 hover:text-primary">
                    <span class="material-symbols-outlined">notifications</span>
                    ${count > 0 ? `<span class="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>` : ''}
                </button>

                ${this.isOpen ? `
                <div class="absolute right-0 mt-3 w-80 bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-stone-800 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div class="p-5 border-b border-slate-50 dark:border-stone-800 flex items-center justify-between">
                        <h4 class="font-black text-slate-800 dark:text-white">Thông báo</h4>
                        <span class="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-black">${count} Mới</span>
                    </div>
                    <div class="max-h-[400px] overflow-y-auto">
                        ${count === 0 ? `
                            <div class="p-10 text-center text-slate-400">
                                <span class="material-symbols-outlined text-4xl mb-2 opacity-30">notifications_off</span>
                                <p class="text-xs font-bold">Không có thông báo mới</p>
                            </div>
                        ` : pendingRequests.slice(0, 10).map(req => {
            const isTask = req.type === 'task';
            const icon = isTask ? 'task_alt' : (req.type === 'perk' ? 'bolt' : 'redeem');
            const iconColor = isTask ? 'text-blue-500' : 'text-orange-500';
            const bgColor = isTask ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20';
            const link = isTask ? '../approve-tasks/index.html' : '../manage-shop/index.html';

            return `
                                <a href="${link}" class="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-50 dark:border-stone-800/50 group">
                                    <div class="size-10 rounded-xl ${bgColor} flex-shrink-0 flex items-center justify-center">
                                        <span class="material-symbols-outlined ${iconColor}">${icon}</span>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-primary transition-colors">${req.user} ${isTask ? 'đã xong n.vụ' : 'muốn đổi quà'}</p>
                                        <p class="text-[10px] text-slate-500 truncate mt-0.5">${req.itemTitle}</p>
                                        <p class="text-[9px] text-slate-400 mt-1">${req.time}</p>
                                    </div>
                                </a>
                            `;
        }).join('')}
                    </div>
                    ${count > 0 ? `
                        <div class="p-4 bg-slate-50 dark:bg-stone-900/50 text-center">
                            <button onclick="window.location.href='../admin/index.html'" class="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Xem tất cả hoạt động</button>
                        </div>
                    ` : ''}
                </div>
                ` : ''}
            </div>
        `;
    }
}
customElements.define('notification-bell', NotificationBell);

// ==========================================
// THÊM HIỆU ỨNG CHUYỂN TRANG MƯỢT MÀ
// ==========================================
(function initPageTransitions() {
    // Chèn CSS animation vào body
    const style = document.createElement('style');
    style.innerHTML = `
        body {
            opacity: 0;
            transition: opacity 0.25s ease-out;
            background-color: #f8f7f6; /* tránh màn hình trắng giật */
        }
        body.dark {
            background-color: #221a10;
        }
        body.page-loaded {
            opacity: 1;
        }
        body.page-transitioning {
            opacity: 0;
            transform: translateY(10px);
        }
    `;
    document.head.appendChild(style);

    // Fade-in khi tải trang xong
    window.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(() => {
            document.body.classList.add('page-loaded');
        });
    });

    // Tránh kẹt màn hình xám nếu JS lỗi
    setTimeout(() => {
        if (document.body) document.body.classList.add('page-loaded');
    }, 800);

    // Chặn click các thẻ href để tạo hiệu ứng fade-out trước khi chuyển
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href &&
            !link.href.includes('#') &&
            !link.href.startsWith('javascript') &&
            link.target !== '_blank' &&
            link.hostname === window.location.hostname) {

            e.preventDefault();
            document.body.classList.add('page-transitioning');
            // Đợi tắt hẳn rồi mới điều hướng
            setTimeout(() => { window.location.href = link.href; }, 250);
        }
    });

    // Hàm chuyển trang cho các nút button dùng onclick
    window.navigateWithTransition = function (url) {
        document.body.classList.add('page-transitioning');
        setTimeout(() => { window.location.href = url; }, 250);
    };
})();
