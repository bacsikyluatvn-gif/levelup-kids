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
        <div class="bg-white dark:bg-[#2c2215] w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
            <div class="h-2 bg-gradient-to-r ${config.bg}"></div>
            <div class="p-10 text-center space-y-6">
                <div class="size-20 bg-${config.color}-50 dark:bg-${config.color}-900/20 rounded-[2.2rem] flex items-center justify-center mx-auto ring-8 ring-${config.color}-50/50 dark:ring-${config.color}-900/30">
                    <span class="material-symbols-outlined text-4xl text-${config.color}-500">${config.icon}</span>
                </div>
                <div class="space-y-2">
                    <h3 class="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none">${title}</h3>
                    <p class="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">${message}</p>
                </div>
                <button id="lu-alert-ok" class="w-full py-4 bg-${config.color === 'primary' ? 'primary' : config.color + '-500'} text-white font-black rounded-2xl hover:opacity-90 shadow-lg shadow-${config.color}-200 dark:shadow-none transition-all uppercase tracking-widest text-sm">
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

/**
 * BIG CELEBRATION SYSTEM
 * Triggers full screen fireworks and celebratory UI
 */
let activeCelebrationAudio = null;
let lastCelebrationSoundTime = 0;
const SOUND_COOLDOWN = 5000; // 5 seconds cooldown between sounds

window.celebrate = (config = {}) => {
    const {
        type = 'task', // task, level, title, challenge, sticker, shop
        title = "Chúc mừng con!",
        subtitle = "Con đã đạt được một cột mốc mới",
        icon = null,
        image = null,
        color = null, // fallback
        sound = true
    } = config;

    // Define Theme Configs
    const themes = {
        task: {
            announcement: "NHIỆM VỤ HOÀN THÀNH",
            gradient: "from-emerald-600/30 to-teal-500/30",
            glow: "bg-emerald-400/20",
            accent: "emerald",
            btn: "bg-emerald-500 shadow-emerald-200",
            defaultIcon: "check_circle",
            sound: "../shared/assets/chuc mung.mp3",
            confetti: { colors: ['#10b981', '#34d399', '#ffffff'] }
        },
        level: {
            announcement: "LÊN CẤP MỚI!",
            gradient: "from-purple-600/40 to-pink-600/40",
            glow: "bg-purple-400/30",
            accent: "purple",
            btn: "bg-purple-600 shadow-purple-200",
            defaultIcon: "trending_up",
            sound: "../shared/assets/chuc mung.mp3",
            confetti: { colors: ['#a855f7', '#ec4899', '#ffffff'], shapes: ['star'] }
        },
        title: {
            announcement: "DANH HIỆU CAO QUÝ",
            gradient: "from-amber-600/40 to-yellow-500/40",
            glow: "bg-amber-400/40",
            accent: "amber",
            btn: "bg-amber-500 shadow-amber-200",
            defaultIcon: "workspace_premium",
            sound: "../shared/assets/chuc mung.mp3",
            confetti: { colors: ['#f59e0b', '#fbbf24', '#ffffff'], particleCount: 200 }
        },
        challenge: {
            announcement: "CHIẾN THẮNG ĐẤU TRƯỜNG",
            gradient: "from-rose-600/40 to-blue-600/40",
            glow: "bg-rose-400/20",
            accent: "rose",
            btn: "bg-indigo-600 shadow-indigo-200",
            defaultIcon: "swords",
            sound: "../shared/assets/thang.mp3",
            confetti: { colors: ['#e11d48', '#2563eb', '#ffffff'] }
        },
        sticker: {
            announcement: "PHÁ ĐẢO BỘ SƯU TẬP",
            gradient: "from-yellow-500/30 to-orange-500/30",
            glow: "bg-yellow-400/20",
            accent: "yellow",
            btn: "bg-orange-500 shadow-orange-200",
            defaultIcon: "auto_awesome",
            sound: "../shared/assets/chuc mung.mp3",
            confetti: { colors: ['#fbbf24', '#f97316', '#ffffff'] }
        },
        shop: {
            announcement: "PHẦN THƯỞNG ĐÃ NHẬN",
            gradient: "from-blue-600/30 to-indigo-600/30",
            glow: "bg-blue-400/20",
            accent: "blue",
            btn: "bg-blue-600 shadow-blue-200",
            defaultIcon: "redeem",
            sound: "../shared/assets/chuc mung.mp3",
            confetti: { colors: ['#2563eb', '#4f46e5', '#ffffff'] }
        }
    };

    const theme = themes[type] || themes.task;
    const activeIcon = icon || theme.defaultIcon;

    // 1. Play Sound
    if (sound) {
        const now = Date.now();
        const skipSound = now - lastCelebrationSoundTime < SOUND_COOLDOWN;

        if (!skipSound) {
            // Stop any previous celebration sound
            if (activeCelebrationAudio) {
                activeCelebrationAudio.pause();
                activeCelebrationAudio.currentTime = 0;
            }

            activeCelebrationAudio = new Audio(theme.sound);
            activeCelebrationAudio.volume = 0.5;
            activeCelebrationAudio.play().catch(e => console.log("Audio play blocked"));
            lastCelebrationSoundTime = now;
        } else {
            console.log("[Celebrate] Sound skipped due to cooldown to avoid 'messy' sequence");
        }
    }

    // 2. Clear existing
    const existing = document.getElementById('global-celebration');
    if (existing) {
        existing.remove();
        // If sound was playing for previous one, we might want to keep it or stop it.
        // The user says "sequence of sounds" is bad, so we stop previous.
    }

    // 3. Create Container
    const container = document.createElement('div');
    container.id = 'global-celebration';
    container.className = 'fixed inset-0 z-[20000] flex items-center justify-center bg-[#0f172a]/95 backdrop-blur-3xl animate-in fade-in duration-700';

    container.innerHTML = `
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br ${theme.gradient} rounded-full blur-[150px] opacity-60 animate-pulse"></div>
            <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0); background-size: 24px 24px;"></div>
        </div>

        <div class="relative w-full max-w-xl p-8 text-center animate-in zoom-in-90 slide-in-from-bottom-24 duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)">
            <div class="mb-12 relative inline-block">
                <div class="absolute inset-0 ${theme.glow} rounded-full blur-[60px] animate-pulse"></div>
                ${image ?
            `<div class="relative z-10 p-2 bg-white/10 backdrop-blur-xl rounded-[3.5rem] border border-white/20 shadow-2xl">
                        <img src="${image}" class="size-56 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform hover:rotate-6 transition-transform">
                    </div>` :
            `<div class="size-44 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-[3rem] flex items-center justify-center mx-auto border border-white/30 relative z-10 shadow-2xl ring-1 ring-white/20">
                        <span class="material-symbols-outlined text-[100px] text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" style="font-variation-settings:'FILL' 1">${activeIcon}</span>
                    </div>`
        }
                <!-- Floating Elements - Type Specific -->
                <div class="absolute -top-10 -left-10 size-16 bg-${theme.accent}-400/40 rounded-full blur-2xl animate-bounce"></div>
                <div class="absolute -bottom-10 -right-10 size-20 bg-${theme.accent}-300/30 rounded-full blur-3xl animate-bounce" style="animation-delay: 1.5s"></div>
            </div>

            <div class="space-y-6 relative">
                <div class="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-2">
                    <span class="size-2 bg-${theme.accent}-400 rounded-full animate-ping"></span>
                    <h4 class="text-white font-black uppercase tracking-[0.4em] text-xs md:text-sm pt-0.5">${theme.announcement}</h4>
                </div>
                <h2 class="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 leading-tight drop-shadow-2xl animate-in slide-in-from-bottom-8 duration-700 delay-300">${title}</h2>
                <div class="h-1 w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto"></div>
                <p class="text-blue-100/80 text-xl md:text-2xl font-bold max-w-lg mx-auto leading-relaxed animate-in fade-in duration-1000 delay-700">${subtitle}</p>
            </div>

            <div class="mt-16 animate-in fade-in zoom-in-50 duration-700 delay-[1.2s]">
                <button id="close-celebration" class="group relative px-14 py-6 ${theme.btn} text-white font-black rounded-3xl text-lg uppercase tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all ring-1 ring-white/30">
                    <span class="relative z-10 flex items-center gap-3">
                        TIẾP TỤC HÀNH TRÌNH
                        <span class="material-symbols-outlined font-black">arrow_forward</span>
                    </span>
                    <div class="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    // 4. Trigger Fireworks
    const fireConfetti = () => {
        if (!window.confetti) {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
            script.onload = () => runFireworks();
            document.head.appendChild(script);
        } else {
            runFireworks();
        }
    };

    const runFireworks = () => {
        const duration = 6 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 20001, ...theme.confetti };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 60 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 300);

        // Core burst
        confetti({
            ...defaults,
            particleCount: 200,
            spread: 90,
            origin: { y: 0.65 },
            gravity: 1.2,
            scalar: 1.2
        });
    };

    fireConfetti();

    // 5. Cleanup
    const closeBtn = container.querySelector('#close-celebration');
    closeBtn.onclick = () => {
        // Tắt âm thanh ngay lập tức khi tắt popup
        if (activeCelebrationAudio) {
            activeCelebrationAudio.pause();
            activeCelebrationAudio.currentTime = 0;
            activeCelebrationAudio = null;
        }

        container.style.opacity = '0';
        container.style.transform = 'scale(1.1)';
        container.style.transition = 'all 0.6s cubic-bezier(0.19, 1, 0.22, 1)';
        setTimeout(() => container.remove(), 600);
    };
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
        if (!data) return;
        const title = this.getAttribute('title') || 'LevelUp Kids';
        const type = this.getAttribute('type') || 'child';

        this.innerHTML = `
            <header class="sticky top-0 z-50 bg-white/80 dark:bg-[#1a140c]/80 backdrop-blur-xl border-b border-[#e6e1db] dark:border-[#3a2e22] shadow-sm transition-all duration-300">
                <div class="max-w-[1200px] mx-auto px-6 md:px-8 py-3 flex items-center justify-between gap-4">
                    <!-- Brand Section -->
                    <div class="flex items-center gap-3 cursor-pointer group shrink-0" onclick="navigateWithTransition(this.closest('app-header').getAttribute('type') === 'child' ? '../home/index.html' : '../admin/index.html')">
                        <div class="bg-primary/20 p-2.5 rounded-2xl text-primary group-hover:scale-110 group-active:scale-95 transition-all shadow-sm">
                            <span class="material-symbols-outlined text-3xl" style="font-variation-settings:'FILL' 1">castle</span>
                        </div>
                        <div class="hidden sm:block">
                            <h1 class="text-xl font-black tracking-tight text-text-main dark:text-white leading-none">${title}</h1>
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Adventure Awaits</p>
                        </div>
                    </div>

                    <!-- Statistics & Actions Sections -->
                    ${type === 'child' ? this.getChildStats(data) : this.getParentStats(data)}
                </div>
            </header>
        `;

        if (type === 'child') this.attachChildEffects();
    }

    getChildStats(data) {
        const user = data.user;
        const xpPercent = Math.floor((user.xp / user.maxXp) * 100);
        return `
            <!-- Stats Hub (Center) -->
            <div class="hidden lg:flex items-center gap-6 bg-slate-100/50 dark:bg-white/5 px-6 py-2 rounded-[2rem] border border-slate-200/50 dark:border-white/10 shadow-inner">
                <!-- Progress -->
                <div class="flex items-center gap-4 border-r border-slate-200 dark:border-white/10 pr-6">
                    <div class="flex flex-col w-32 gap-1">
                        <div class="flex justify-between text-[9px] font-black uppercase tracking-tighter text-slate-500 dark:text-slate-400">
                            <span>LEVEL ${user.level}</span>
                            <span>${user.xp}/${user.maxXp} XP</span>
                        </div>
                        <div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-sm">
                            <div class="h-full bg-gradient-to-r from-yellow-300 via-primary to-orange-500 transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)" style="width: ${xpPercent}%"></div>
                        </div>
                    </div>
                </div>

                <!-- Resources -->
                <div class="flex items-center gap-1.5 font-bold">
                    <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:scale-105 transition-transform cursor-help" title="Nhân Cách (Personality Points)">
                        <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1">favorite</span>
                        <span class="text-sm tabular-nums">${user.personalityPoints || 0}</span>
                    </div>
                    <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:scale-105 transition-transform cursor-help" title="Vàng (Gold)">
                        <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1">monetization_on</span>
                        <span class="text-sm tabular-nums">${user.gold}</span>
                    </div>
                    <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:scale-105 transition-transform cursor-help" title="Huy hiệu (Stickers)">
                        <span class="material-symbols-outlined text-[18px] transform rotate-12">sell</span>
                        <span class="text-sm tabular-nums">${user.stickers || 0}</span>
                    </div>
                    <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30 hover:scale-105 transition-transform cursor-pointer" onclick="window.navigateWithTransition('../tree-growth/index.html')" title="Giọt nước (Water - Để tưới cây)">
                        <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1">water_drop</span>
                        <span class="text-sm tabular-nums">${user.water || 0}</span>
                    </div>
                </div>
            </div>

            <!-- Profile & System (Right) -->
            <div class="flex items-center gap-2 md:gap-4 ml-auto">
                <!-- Theme Toggle -->
                <button onclick="window.toggleDarkMode()" class="size-9 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-xl text-slate-400 hover:text-primary transition-all active:scale-95 shadow-sm border border-transparent">
                    <span class="material-symbols-outlined dark:hidden text-lg">dark_mode</span>
                    <span class="material-symbols-outlined hidden dark:block text-yellow-500 text-lg">light_mode</span>
                </button>

                <!-- Profile Card -->
                <div class="flex items-center gap-3 pl-3 md:pl-4 border-l border-slate-200 dark:border-white/10 group relative">
                    <div class="text-right hidden sm:block">
                        <p class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">
                            ${(() => {
                if (!user || !user.name) return 'Alex';
                const rawName = user.name;
                // Extract nickname if formatted like "Name (Nickname)"
                if (rawName.includes('(') && rawName.includes(')')) {
                    return rawName.split('(')[1].split(')')[0].trim();
                }
                // Shorten if too long
                if (rawName.length > 15) {
                    const parts = rawName.split(' ');
                    return parts.length > 1 ? parts.slice(-2).join(' ') : rawName;
                }
                return rawName;
            })()}
                        </p>
                        <p class="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-80">${(data.title && data.title.currentTitleName) || 'Tân Binh'}</p>
                    </div>
                    
                    <div class="relative cursor-pointer group/avatar" id="header-avatar-child">
                        <div class="size-10 rounded-xl bg-slate-200 ring-2 ring-primary/20 bg-cover bg-center shadow-md group-hover/avatar:ring-primary group-hover/avatar:scale-105 transition-all overflow-hidden" 
                             style="background-image: url('${user.avatar}')">
                        </div>
                        <div class="absolute -top-1 -right-1 size-3 bg-emerald-500 border-2 border-white dark:border-[#1a140c] rounded-full shadow-sm animate-pulse"></div>
                    </div>

                    <!-- Compact Menu Actions -->
                    <div class="flex items-center gap-1 ml-1">
                        <button onclick="window.location.href='../portal/index.html'" 
                                class="size-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary transition-all active:scale-90" title="Đổi Bé">
                            <span class="material-symbols-outlined text-[22px]">group</span>
                        </button>
                        <button onclick="window.AppState.logout()" 
                                class="size-9 flex items-center justify-center rounded-xl text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 transition-all active:scale-90" title="Đăng xuất">
                            <span class="material-symbols-outlined text-[20px]">logout</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachChildEffects() {
        setTimeout(() => {
            const av = this.querySelector('#header-avatar-child');
            if (av) {
                av.onclick = (e) => {
                    if (window.confetti) {
                        const rect = av.getBoundingClientRect();
                        confetti({
                            particleCount: 25,
                            spread: 70,
                            origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
                            colors: ['#FFD700', '#FFA500', '#FFFFFF', '#FFB6C1'],
                            zIndex: 10001,
                            scalar: 0.8
                        });
                    }
                };
            }
        }, 0);
    }

    getParentStats(data) {
        return `
            <div class="flex items-center gap-3 md:gap-6 ml-auto">
                <button onclick="window.openBehaviorLogModal()" class="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-primary to-orange-500 text-white rounded-[1.5rem] text-xs font-black shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-widest">
                    <span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' 1">auto_awesome</span>
                    <span class="hidden md:inline">Ghi nhận hành động</span>
                </button>
                
                <notification-bell></notification-bell>

                <div class="flex items-center gap-3 pl-3 md:pl-6 border-l border-slate-200 dark:border-white/10">
                    <button onclick="window.toggleDarkMode()" class="p-2.5 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-primary transition-all active:scale-95">
                        <span class="material-symbols-outlined dark:hidden">dark_mode</span>
                        <span class="material-symbols-outlined hidden dark:block text-yellow-500">light_mode</span>
                    </button>
                    
                    <div class="text-right hidden sm:block">
                        <p class="text-sm font-black dark:text-white text-slate-800 uppercase tracking-tight">Admin Phụ Huynh</p>
                        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Family Manager</p>
                    </div>
                    
                    <div class="size-10 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white shadow-lg overflow-hidden">
                        <span class="material-symbols-outlined text-2xl" style="font-variation-settings:'FILL' 1">person</span>
                    </div>

                    <div class="flex items-center gap-1 ml-1">
                        <button onclick="window.location.href='../portal/index.html'" 
                                class="size-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary transition-all active:scale-90" title="Quản lý Family">
                            <span class="material-symbols-outlined text-[20px]">home_info</span>
                        </button>
                        <button onclick="window.AppState.logout()" 
                                class="size-9 flex items-center justify-center rounded-xl text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 transition-all active:scale-90" title="Đăng xuất hoàn toàn">
                            <span class="material-symbols-outlined text-[20px]">logout</span>
                        </button>
                    </div>
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
                        <div class="flex items-start gap-5 mb-4">
                            <div class="shrink-0 bg-green-100 dark:bg-green-900/30 w-14 h-14 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm">
                                <span class="material-symbols-outlined text-3xl">${icon}</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <h3 class="text-xl font-black text-slate-800 dark:text-white leading-tight mb-1 truncate">${title}</h3>
                                <p class="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">${desc}</p>
                            </div>
                        </div>
                        
                        <div class="flex gap-2 mb-6 flex-wrap mt-auto">
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
                        <div class="flex items-start gap-5 mb-4">
                            <div class="shrink-0 bg-${color}-100 dark:bg-${color}-900/30 w-14 h-14 rounded-2xl flex items-center justify-center text-${color}-600 dark:text-${color}-400 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                <span class="material-symbols-outlined text-3xl">${icon}</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <h3 class="text-xl font-black text-slate-800 dark:text-white leading-tight mb-1 truncate">${title}</h3>
                                <p class="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">${desc}</p>
                            </div>
                        </div>
                        
                        <div class="flex gap-2 mb-6 flex-wrap mt-auto">
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

                // Removed celebration popup to avoid inflation
                /*
                if (currentReward >= 50 || currentXp >= 50 || currentSticker >= 1) {
                    window.celebrate({
                        type: 'task',
                        title: title,
                        subtitle: desc || "Con đã hoàn thành một nhiệm vụ lớn!",
                        icon: icon,
                        color: color
                    });
                }
                */

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
        const price = parseInt(this.getAttribute('price') || '0');
        const personalityPrice = parseInt(this.getAttribute('personality-price') || '0');
        const isPersonalityItem = personalityPrice > 0;

        const image = this.getAttribute('image') || '';
        const desc = this.getAttribute('desc') || '';
        const color = this.getAttribute('color') || 'blue';
        const emoji = this.getAttribute('emoji') || '';

        const userBalance = isPersonalityItem ? window.AppState.data.user.personalityPoints : window.AppState.data.user.gold;
        const targetPrice = isPersonalityItem ? personalityPrice : price;
        const canAfford = userBalance >= targetPrice;

        this.innerHTML = `
            <div class="group bg-white dark:bg-[#2c2215] rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm card-hover-effect flex flex-col h-full transition-all hover:shadow-lg">
                <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-${color}-50 flex items-center justify-center">
                    ${(image && image !== 'null' && image !== 'undefined' && image !== '')
                ? `<img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="${image}" alt="${title}" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\'text-5xl\'>${emoji || '🎁'}</span>'">`
                : (emoji ? `<span class="text-5xl">${emoji}</span>` : `<span class="material-symbols-outlined text-4xl text-slate-300">redeem</span>`)
            }
                </div>
                <div class="flex flex-col flex-grow">
                    <h3 class="text-xl font-bold text-slate-800 dark:text-white leading-tight mb-1">${title}</h3>
                    <p class="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">${desc}</p>
                    <div class="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50">
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Giá</span>
                            <div class="flex items-center gap-1.5 ${isPersonalityItem ? 'text-orange-500' : 'text-primary'} font-black text-xl">
                                ${targetPrice} <span class="material-symbols-outlined text-lg" style="${isPersonalityItem ? "font-variation-settings:'FILL' 1" : ''}">${isPersonalityItem ? 'favorite' : 'monetization_on'}</span>
                            </div>
                        </div>
                        
                        ${canAfford ? `
                            <button class="btn-buy btn-pressable w-full py-3 ${isPersonalityItem ? 'bg-orange-500' : 'bg-primary'} text-white font-bold rounded-xl shadow-btn-3d flex items-center justify-center gap-2">
                                <span>${isPersonalityItem ? 'Đổi Đặc Quyền' : 'Đổi Quà'}</span>
                                <span class="material-symbols-outlined">${isPersonalityItem ? 'auto_awesome' : 'redeem'}</span>
                            </button>
                        ` : `
                            <button class="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border-2 border-dashed border-slate-200 dark:border-slate-700" disabled>
                                <span>Thêm ${targetPrice - userBalance}</span>
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
                this.showConfirmDialog(title, targetPrice, isPersonalityItem, () => {
                    if (isPersonalityItem) {
                        if (window.AppState.spendPersonalityPoints(targetPrice, title, image)) {
                            this.showSuccess();
                        }
                    } else {
                        if (window.AppState.spendGold(targetPrice, title, image)) {
                            this.showSuccess();
                        }
                    }
                });
            });
        }
    }

    showConfirmDialog(title, price, isPersonality, onConfirm) {
        const existing = document.getElementById('shop-confirm-modal');
        if (existing) existing.remove();

        const currencyName = isPersonality ? 'Điểm Nhân Cách' : 'Vàng';
        const modalHtml = `
            <div id="shop-confirm-modal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 opacity-0 pointer-events-none">
                <div id="shop-confirm-content" class="bg-white dark:bg-[#2c2215] w-full max-w-sm rounded-[2rem] p-6 text-center shadow-2xl transform scale-90 transition-transform duration-300 relative overflow-hidden tracking-tight">
                    <div class="size-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 relative drop-shadow-sm">
                        <span class="material-symbols-outlined text-[40px] text-orange-500">${isPersonality ? 'auto_awesome' : 'help'}</span>
                        <div class="absolute -right-1 -bottom-1 bg-white dark:bg-[#2c2215] rounded-full p-1 leading-none shadow-sm">
                            <span class="material-symbols-outlined text-[16px] text-orange-500" style="${isPersonality ? "font-variation-settings:'FILL' 1" : ''}">${isPersonality ? 'favorite' : 'monetization_on'}</span>
                        </div>
                    </div>
                    <h3 class="text-xl font-black text-slate-800 dark:text-white mb-2">${isPersonality ? 'Đổi Đặc Quyền Yêu Thương?' : 'Đổi rương kho báu?'}</h3>
                    <p class="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">Bạn sẽ dùng <b class="text-orange-500">${price} ${currencyName}</b> để nhận <b>${title}</b>. Bạn có chắc chắn muốn đổi không?</p>
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

        let sorted = data.leaderboard.filter(u => u.role === 'child' || u.role === 'bot');

        // --- PRE-CALCULATE STATS FOR OPTIMIZATION (O(N+M) instead of O(N*M)) ---
        const userStatsMap = new Map();
        sorted.forEach(u => userStatsMap.set(u.id, { wins: 0, draws: 0, losses: 0 }));

        (data.challenges || []).forEach(c => {
            if (c.status !== 'completed') return;

            // Stats for Challenger
            if (userStatsMap.has(c.challengerId)) {
                const s = userStatsMap.get(c.challengerId);
                if (c.winnerId === c.challengerId) s.wins++;
                else if (c.winnerId === null) s.draws++;
                else s.losses++;
            }

            // Stats for Opponent
            if (userStatsMap.has(c.opponentId)) {
                const s = userStatsMap.get(c.opponentId);
                if (c.winnerId === c.opponentId) s.wins++;
                else if (c.winnerId === null) s.draws++;
                else s.losses++;
            }
        });

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
            sorted.sort((a, b) => {
                const sA = userStatsMap.get(a.id);
                const sB = userStatsMap.get(b.id);
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
                const stats = userStatsMap.get(user.id);
                return `${stats.wins}T - ${stats.draws}H - ${stats.losses}B`;
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
    constructor() {
        super();
        this.currentPage = 0;
        this.pageSize = 10;
    }
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
        if (this.lastMode !== mode) {
            this.currentPage = 0;
            this.lastMode = mode;
        }

        let sorted = data.leaderboard.filter(u => u.role === 'child' || u.role === 'bot');

        // --- PRE-CALCULATE STATS FOR OPTIMIZATION (O(N+M) instead of O(N*M)) ---
        const userStatsMap = new Map();
        sorted.forEach(u => userStatsMap.set(u.id, { wins: 0, draws: 0, losses: 0 }));

        (data.challenges || []).forEach(c => {
            if (c.status !== 'completed') return;

            // Stats for Challenger
            if (userStatsMap.has(c.challengerId)) {
                const s = userStatsMap.get(c.challengerId);
                if (c.winnerId === c.challengerId) s.wins++;
                else if (c.winnerId === null) s.draws++;
                else s.losses++;
            }

            // Stats for Opponent
            if (userStatsMap.has(c.opponentId)) {
                const s = userStatsMap.get(c.opponentId);
                if (c.winnerId === c.opponentId) s.wins++;
                else if (c.winnerId === null) s.draws++;
                else s.losses++;
            }
        });

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
            sorted.sort((a, b) => {
                const sA = userStatsMap.get(a.id);
                const sB = userStatsMap.get(b.id);
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
                const stats = userStatsMap.get(user.id);
                return `${stats.wins}T - ${stats.draws}H - ${stats.losses}B`;
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

        const totalPages = Math.ceil(sorted.length / this.pageSize);
        const displayList = sorted.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);

        window.nextLeaderboardPage = () => {
            if (this.currentPage < totalPages - 1) {
                this.currentPage++;
                this.render(window.AppState.data);
            }
        };

        window.prevLeaderboardPage = () => {
            if (this.currentPage > 0) {
                this.currentPage--;
                this.render(window.AppState.data);
            }
        };

        this.innerHTML = `
            <div class="space-y-4">
                ${displayList.map((user, index) => {
            // ... (rest of the map logic remains the same, I will use a larger block to ensure correctness)
            const rank = (this.currentPage * this.pageSize) + index + 1;
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
                
                ${totalPages > 1 ? `
                    <div class="p-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-black/10">
                        <button onclick="window.prevLeaderboardPage()" 
                            ${this.currentPage === 0 ? 'disabled' : ''}
                            class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${this.currentPage === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-slate-800 shadow-sm hover:shadow-md active:scale-95 border border-slate-100 dark:border-slate-800'}">
                            <span class="material-symbols-outlined text-lg">chevron_left</span>
                            Trước
                        </button>
                        
                        <div class="flex flex-col items-center">
                            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trang</span>
                            <span class="text-sm font-black text-slate-800 dark:text-white">${this.currentPage + 1} / ${totalPages}</span>
                        </div>

                        <button onclick="window.nextLeaderboardPage()" 
                            ${this.currentPage >= totalPages - 1 ? 'disabled' : ''}
                            class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${this.currentPage >= totalPages - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-slate-800 shadow-sm hover:shadow-md active:scale-95 border border-slate-100 dark:border-slate-800'}">
                            Sau
                            <span class="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
                    </div>
                ` : ''}

                ${(() => {
                const myId = window.AppState.data.user?.id;
                const myUser = sorted.find(u => u.id === myId);
                const isInCurrentPage = displayList.some(u => u.id === myId);

                if (myUser && !isInCurrentPage) {
                    const myRank = sorted.indexOf(myUser) + 1;
                    const indicators = {
                        rank: myRank,
                        user: myUser,
                        value: getValue(myUser),
                        label: getLabel(),
                        icon: getIcon(),
                        color: getIconColor(),
                        sub: getSubLabel(myUser)
                    };

                    return `
                            <div class="mt-8 pt-6 border-t-2 border-dashed border-slate-100 dark:border-slate-800">
                                <p class="text-[10px] font-black text-primary uppercase tracking-widest text-center mb-4">Vị trí của bạn</p>
                                <div class="bg-primary/10 dark:bg-primary/5 p-4 rounded-3xl border-2 border-primary/20 flex items-center justify-between group transition-all duration-300 ring-4 ring-primary/5 hover:scale-[1.02] cursor-pointer" onclick="this.scrollIntoView({behavior:'smooth'})">
                                    <div class="flex items-center gap-4 sm:gap-6 flex-1">
                                        <div class="size-12 sm:size-14 relative flex-shrink-0">
                                            <div class="absolute -top-3 -left-3 size-8 sm:size-10 bg-gradient-to-br from-primary to-[#ff6b00] text-white rounded-2xl flex items-center justify-center font-black text-sm sm:text-base shadow-lg shadow-primary/30 z-10 border-2 border-white dark:border-[#221a10]">
                                                ${myRank}
                                            </div>
                                            <div class="size-full rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-inner relative overflow-hidden ring-2 ring-primary">
                                                <img src="${myUser.avatar}" class="size-full object-cover rounded-xl" />
                                            </div>
                                        </div>
                                        <div class="min-w-0 pr-4">
                                            <div class="flex items-center gap-1.5 mb-0.5">
                                                <h3 class="font-black text-slate-800 dark:text-white truncate text-base sm:text-lg tracking-tight">
                                                    ${(() => {
                            if (!myUser || !myUser.name) return '';
                            const rawName = myUser.name;
                            if (rawName.includes('(') && rawName.includes(')')) {
                                return rawName.split('(')[1].split(')')[0].trim();
                            }
                            if (rawName.length > 12) {
                                const parts = rawName.split(' ');
                                return parts.length > 1 ? parts.slice(-2).join(' ') : rawName;
                            }
                            return rawName;
                        })()} 
                                                    <span class="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] ml-1">BẠN</span>
                                                </h3>
                                            </div>
                                            <p class="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                <span class="material-symbols-outlined text-[14px] ${indicators.color}">${indicators.icon}</span>
                                                ${indicators.sub}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="text-right flex-shrink-0 min-w-[80px]">
                                        <div class="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-none mb-1">${indicators.value}</div>
                                        <div class="text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">${indicators.label}</div>
                                    </div>
                                </div>
                            </div>
                        `;
                }
                return '';
            })()}

                ${this.currentPage === totalPages - 1 && totalPages > 1 ? `
                    <div class="py-10 text-center opacity-40">
                        <div class="size-12 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-white dark:border-[#221a10]">
                            <span class="material-symbols-outlined text-slate-300 text-xl">flag</span>
                        </div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hết danh sách</p>
                    </div>
                ` : ''}
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
                    ${this.navLink('redeem', 'Cửa hàng', '../manage-shop/index.html', active === 'shop', (window.AppState && window.AppState.data.requests ? window.AppState.data.requests.filter(r => r.status === 'pending' && (r.type === 'shop' || r.type === 'perk')).length : 0) || '')}
                    
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
                        <span class="text-[10px] font-black text-primary">
                            ${req.pricePersonality ? '❤️ ' + req.pricePersonality : (req.isSticker ? '🎟️ ' + (req.price || 0) : '💰 ' + (req.price || 0))}
                        </span>
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
console.log("%c [Components] VERSION 1.0.7 - HEADER UPDATED ", "background: #2bcee3; color: white; font-weight: bold; padding: 4px; border-radius: 4px;");
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
                            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1 hidden">${perk.desc}</p>
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

        const targetCategory = this.getAttribute('category');
        let items = data.shopItems;
        if (targetCategory === 'personality') {
            items = items.filter(i => i.personalityPrice > 0);
        } else if (targetCategory) {
            items = items.filter(i => i.category === targetCategory);
        } else {
            // If no category specified, show only gold-priced items (those without a personality price)
            items = items.filter(i => !i.personalityPrice || i.personalityPrice <= 0);
        }

        const userGold = data.user.gold;
        const userPersonality = data.user.personalityPoints || 0;

        this.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                ${items.map(item => {
            const isPersonalityItem = item.personalityPrice > 0;
            const userBalance = isPersonalityItem ? userPersonality : userGold;
            const targetPrice = isPersonalityItem ? item.personalityPrice : item.price;
            const canAfford = userBalance >= targetPrice;
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
                        <div class="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer" onclick="window.showItemDetailModal && window.showItemDetailModal('${encodeURIComponent(item.title)}', '${encodeURIComponent(item.desc)}', '${item.image || ''}')">
                            ${(item.image && item.image !== 'null' && item.image !== 'undefined' && item.image !== '')
                    ? `<img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\'material-symbols-outlined text-5xl text-slate-300\'>redeem</span>'">`
                    : `<span class="material-symbols-outlined text-5xl text-slate-300">redeem</span>`
                }
                            <!-- Price badge -->
                            <div class="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm ${isPersonalityItem ? 'text-orange-600' : 'text-amber-600'} font-black text-sm px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                                <span class="material-symbols-outlined text-[16px] ${isPersonalityItem ? 'text-orange-500' : 'text-amber-500'}" style="font-variation-settings:'FILL' 1">${isPersonalityItem ? 'favorite' : 'monetization_on'}</span>
                                ${targetPrice}
                            </div>
                            ${(!canAfford || isPending) ? `<div class="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] flex items-center justify-center">
                                <div class="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                    ${isPending ? 'Đang chờ duyệt...' : `Cần thêm ${targetPrice - userBalance} <span class="material-symbols-outlined text-[14px] ${isPersonalityItem ? 'text-orange-500' : 'text-amber-500'}" style="font-variation-settings:\'FILL\' 1">${isPersonalityItem ? 'favorite' : 'monetization_on'}</span>`}
                                </div>
                            </div>` : ''}
                        </div>
                        <!-- Content -->
                        <div class="p-5 flex flex-col flex-1">
                            <div class="cursor-pointer flex-1 flex flex-col" onclick="window.showItemDetailModal && window.showItemDetailModal('${encodeURIComponent(item.title)}', '${encodeURIComponent(item.desc)}', '${item.image || ''}')" title="Nhấn để xem chi tiết">
                                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 ${(item.category === 'power_card' || item.category === 'POWER_CARD') ? 'hidden' : ''}">${item.category}</span>
                                <h3 class="font-black text-slate-800 dark:text-white text-base mb-2 leading-tight group-hover:text-primary transition-colors">${item.title}</h3>
                                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-4 line-clamp-2 hidden">${item.desc}</p>
                            </div>
                            <button
                                onclick="window.redeemPremiumItem && window.redeemPremiumItem('${item.id}')" class="${(canAfford && !isPending)
                    ? (isPersonalityItem ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:opacity-90 shadow-md active:scale-95' : `bg-gradient-to-r ${colorAccent} text-white hover:opacity-90 shadow-md active:scale-95`)
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                } w-full font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
                                ${(!canAfford || isPending) ? 'disabled' : ''}>
                                <span class="material-symbols-outlined text-lg">${isPending ? 'schedule' : (canAfford ? (isPersonalityItem ? 'auto_awesome' : 'redeem') : 'lock')}</span>
                                ${isPending ? 'Đang Chờ Duyệt' : (canAfford ? (isPersonalityItem ? 'Đổi Đặc Quyền' : 'Gửi Yêu Cầu') : (isPersonalityItem ? 'Chưa Đủ Điểm' : 'Chưa Đủ Vàng'))}
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
                    ${this.navItem('home', 'Tổng quan', 'home/index.html', active === 'home' || active === '')}
                    ${this.navItem('dashboard', 'Nhiệm vụ', 'dashboard/index.html', active === 'dashboard')}
                    ${this.navItem('book_5', 'Nhật Ký', 'personality/index.html', active === 'diary')}
                    ${this.navItem('sports_kabaddi', 'Đấu trường', 'arena/index.html', active === 'arena')}
                    ${this.navItem('leaderboard', 'Xếp hạng', 'leaderboard/index.html', active === 'leaderboard')}
                    ${this.navItem('workspace_premium', 'Danh hiệu', 'titles/index.html', active === 'titles')}
                    ${this.navStickerItem(active === 'stickers')}
                    ${this.navItem('park', 'Hành trình', 'tree-growth/index.html', active === 'tree-growth')}
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
            <a href="../sticker-book/index.html" class="relative flex flex-col items-center justify-center transition-all duration-300 ${activeClass} flex-1 min-w-[44px] text-center">
                <div class="${isActive ? 'bg-primary/10 p-2.5 rounded-2xl' : 'p-2.5'} transition-all duration-300 relative">
                    <span class="material-symbols-outlined text-2xl ${isActive ? 'font-black' : ''}">sell</span>
                    ${badge}
                </div>
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
            <a ${attrs} class="relative flex flex-col items-center justify-center transition-all duration-300 ${activeClass} flex-1 min-w-[44px] text-center">
                <div class="${isActive ? 'bg-primary/10 p-2.5 rounded-2xl' : 'p-2.5'} transition-all duration-300">
                    <span class="material-symbols-outlined text-2xl ${iconClass}">${icon}</span>
                </div>
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
                            <h2 class="text-2xl font-black text-slate-800 dark:text-white leading-tight">Bộ Sưu Tập
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

        window.deleteBehaviorPreset = (bid) => {
            if (confirm('Bạn có chắc muốn xóa hành động này khỏi danh sách?')) {
                let overrides = JSON.parse(localStorage.getItem('behavior_overrides') || '{"GOOD": [], "BAD": []}');
                if (!overrides[this.activeType]) overrides[this.activeType] = [];
                overrides[this.activeType] = overrides[this.activeType].filter(b => b.id !== bid);

                // If it's a default behavior, we mark it as deleted
                const defaults = window.GROWTH_BEHAVIORS ? (window.GROWTH_BEHAVIORS[this.activeType] || []) : [];
                const isDefault = defaults.some(b => b.id === bid);

                if (isDefault) {
                    if (!overrides[this.activeType + '_DELETED']) overrides[this.activeType + '_DELETED'] = [];
                    overrides[this.activeType + '_DELETED'].push(bid);
                }

                localStorage.setItem('behavior_overrides', JSON.stringify(overrides));
                if (this.selectedBehavior?.id === bid) this.resetForm();
                this.render();
            }
        };

        window.saveBehaviorAsPreset = () => {
            const titleInput = this.querySelector('#bh-title');
            if (!titleInput || !titleInput.value.trim()) {
                if (window.showToast) window.showToast('Vui lòng nhập tiêu đề!', 'warning');
                return;
            }

            const goldInput = this.querySelector('#bh-gold');
            const xpInput = this.querySelector('#bh-xp');
            const waterInput = this.querySelector('#bh-water');
            const stickerInput = this.querySelector('#bh-sticker');

            let overrides = JSON.parse(localStorage.getItem('behavior_overrides') || '{"GOOD": [], "BAD": []}');
            if (!overrides[this.activeType]) overrides[this.activeType] = [];

            const newPreset = {
                id: this.selectedBehavior?.id && this.selectedBehavior.id !== 'custom' ? this.selectedBehavior.id : 'custom_' + Date.now(),
                text: titleInput.value.trim(),
                emoji: this.activeType === 'GOOD' ? '⭐' : '⚠️',
                gold: parseInt(goldInput?.value || 0),
                xp: parseInt(xpInput?.value || 0),
                water: parseInt(waterInput?.value || 0),
                sticker: parseInt(stickerInput?.value || 0)
            };

            // Update or Add
            const index = overrides[this.activeType].findIndex(b => b.id === newPreset.id);
            if (index >= 0) {
                overrides[this.activeType][index] = newPreset;
            } else {
                overrides[this.activeType].push(newPreset);
            }

            localStorage.setItem('behavior_overrides', JSON.stringify(overrides));
            this.selectedBehavior = newPreset;
            this.render();
            if (window.showToast) window.showToast('Đã lưu vào danh sách!', 'success');
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
                btn.innerHTML = 'GHI NHẬT KÝ TRƯỞNG THÀNH';
            }
        }
    }

    render() {
        if (!this.data) return;
        const children = this.data.leaderboard ? this.data.leaderboard.filter(p => p.role === 'child') : [];

        let behaviors = [];
        if (window.GROWTH_BEHAVIORS) {
            const defaults = window.GROWTH_BEHAVIORS[this.activeType] || [];
            const overrides = JSON.parse(localStorage.getItem('behavior_overrides') || '{"GOOD": [], "BAD": []}');
            const deleted = overrides[this.activeType + '_DELETED'] || [];

            // Filter out deleted defaults
            behaviors = defaults.filter(b => !deleted.includes(b.id));

            // Apply/Append overrides
            (overrides[this.activeType] || []).forEach(ov => {
                const idx = behaviors.findIndex(b => b.id === ov.id);
                if (idx >= 0) behaviors[idx] = ov;
                else behaviors.push(ov);
            });
        }

        const modalClasses = this.isOpen
            ? "fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md opacity-100 transition-all duration-300"
            : "fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md opacity-0 pointer-events-none transition-all duration-300";

        const contentClasses = this.isOpen
            ? "bg-white dark:bg-[#1a140c] w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl transform scale-100 transition-all duration-300 flex flex-col overflow-hidden border border-white/20"
            : "bg-white dark:bg-[#1a140c] w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl transform scale-95 transition-all duration-300 flex flex-col overflow-hidden border border-white/20";

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
                                <h2 class="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">Ghi Nhật Ký Trưởng Thành</h2>
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
                                            <div class="group relative">
                                                <button onclick="window.onSelectBehavior('${b.id}')" class="w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${this.selectedBehavior?.id === b.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-50 dark:border-slate-800/50 bg-slate-50 dark:bg-white/5 hover:border-slate-200'}">
                                                    <span class="text-2xl">${b.emoji}</span>
                                                    <span class="font-bold text-sm text-slate-700 dark:text-slate-200">${b.text}</span>
                                                </button>
                                                <button onclick="window.deleteBehaviorPreset('${b.id}')" class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                                                    <span class="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </div>
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
                                            <div class="flex justify-between items-center">
                                                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tiêu đề</label>
                                                <button onclick="window.saveBehaviorAsPreset()" class="text-[9px] font-black text-primary hover:underline uppercase tracking-widest">
                                                    Lưu mẫu này
                                                </button>
                                            </div>
                                            <input id="bh-title" type="text" placeholder="Ví dụ: Lễ phép, Tự lập..." 
                                                class="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm font-bold focus:border-primary outline-none transition-all dark:text-white" 
                                                value="${this.form.title}">
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
                                                <!-- Gold -->
                                                <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                                                    <div class="flex items-center gap-2">
                                                        <span class="material-symbols-outlined text-orange-400 text-xl" style="font-variation-settings:'FILL' 1">monetization_on</span>
                                                        <input id="bh-gold" type="number" class="w-full bg-transparent font-black text-sm outline-none dark:text-white" value="${this.form.gold}">
                                                    </div>
                                                    <select onchange="document.getElementById('bh-gold').value = this.value" class="text-[10px] bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1 outline-none text-slate-500 font-bold">
                                                        <option value="">Nhanh...</option>
                                                        <option value="10">10 Gold</option>
                                                        <option value="20">20 Gold</option>
                                                        <option value="30">30 Gold</option>
                                                    </select>
                                                </div>
                                                <!-- EXP -->
                                                <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                                                    <div class="flex items-center gap-2">
                                                        <span class="material-symbols-outlined text-amber-500 text-xl">military_tech</span>
                                                        <input id="bh-xp" type="number" class="w-full bg-transparent font-black text-sm outline-none dark:text-white" value="${this.form.xp}">
                                                    </div>
                                                    <select onchange="document.getElementById('bh-xp').value = this.value" class="text-[10px] bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1 outline-none text-slate-500 font-bold">
                                                        <option value="">Nhanh...</option>
                                                        <option value="10">10 EXP</option>
                                                        <option value="15">15 EXP</option>
                                                        <option value="20">20 EXP</option>
                                                        <option value="25">25 EXP</option>
                                                        <option value="30">30 EXP</option>
                                                    </select>
                                                </div>
                                                <!-- Water -->
                                                <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                                                    <div class="flex items-center gap-2">
                                                        <span class="material-symbols-outlined text-blue-400 text-xl" style="font-variation-settings:'FILL' 1">water_drop</span>
                                                        <input id="bh-water" type="number" class="w-full bg-transparent font-black text-sm outline-none dark:text-white" value="${this.form.water}">
                                                    </div>
                                                    <select onchange="document.getElementById('bh-water').value = this.value" class="text-[10px] bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1 outline-none text-slate-500 font-bold">
                                                        <option value="">Nhanh...</option>
                                                        <option value="10">10 Drops</option>
                                                        <option value="20">20 Drops</option>
                                                        <option value="30">30 Drops</option>
                                                    </select>
                                                </div>
                                                <!-- Sticker -->
                                                <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                                                    <div class="flex items-center gap-2">
                                                        <span class="material-symbols-outlined text-purple-400 text-xl" style="font-variation-settings:'FILL' 1">sell</span>
                                                        <input id="bh-sticker" type="number" class="w-full bg-transparent font-black text-sm outline-none dark:text-white" value="${this.form.sticker}">
                                                    </div>
                                                    <select onchange="document.getElementById('bh-sticker').value = this.value" class="text-[10px] bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1 outline-none text-slate-500 font-bold">
                                                        <option value="">Nhanh...</option>
                                                        <option value="1">1 Sticker</option>
                                                        <option value="2">2 Stickers</option>
                                                        <option value="3">3 Stickers</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <button onclick="window.submitBehaviorLog()" id="submit-bh-btn" class="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all mt-4 flex items-center justify-center gap-3">
                                            GHI NHẬT KÝ TRƯỞNG THÀNH
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
        const personalityScore = data.user.personalityPoints || 0;

        const milestones = [
            { score: 0, title: "Bạn Nhỏ Lễ Phép", color: "slate", emoji: "🙇" },
            { score: 50, title: "Bé Ngoan Đáng Yêu", color: "blue", emoji: "👶" },
            { score: 150, title: "Dũng Sĩ Tốt Bụng", color: "emerald", emoji: "🛡️" },
            { score: 350, title: "Trái Tim Ấm Áp", color: "rose", emoji: "💝" },
            { score: 600, title: "Người Bạn Chân Thành", color: "indigo", emoji: "🤝" },
            { score: 900, title: "Ngôi Sao Tỏa Sáng", color: "amber", emoji: "⭐" },
            { score: 1300, title: "Nhà Kiến Tạo Tài Năng", color: "teal", emoji: "🎨" },
            { score: 1800, title: "Phù Thủy Nhân Ái", color: "violet", emoji: "🧙" },
            { score: 2400, title: "Người Truyền Cảm Hứng", color: "orange", emoji: "🚀" },
            { score: 3000, title: "Đại Sứ Hòa Bình", color: "yellow", emoji: "👑" }
        ];

        let currentMilestone = milestones[0];
        let nextMilestone = milestones[1];

        for (let i = 0; i < milestones.length; i++) {
            if (personalityScore >= milestones[i].score) {
                currentMilestone = milestones[i];
                nextMilestone = milestones[i + 1] || null;
            }
        }

        const auraTitle = currentMilestone.title;
        const auraColor = currentMilestone.color;
        const pointsToNext = nextMilestone ? nextMilestone.score - personalityScore : 0;
        const progressToNext = nextMilestone ? ((personalityScore - currentMilestone.score) / (nextMilestone.score - currentMilestone.score) * 100) : 100;

        const groupedLogs = {};
        logs.forEach(log => {
            if (!log.createdAt) return;
            const d = new Date(log.createdAt);
            const dateDisplay = d.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            if (!groupedLogs[dateDisplay]) groupedLogs[dateDisplay] = { GOOD: [], BAD: [], REFLECTION: [] };

            const title = (log.itemTitle || "").toLowerCase();
            const desc = (log.itemDesc || "").toLowerCase();

            const isReflection = log.type === 'reflection' ||
                log.type === 'behavior_reflection' ||
                title.includes('tự đánh giá') ||
                title.includes('nhật ký') ||
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
            const [initialTitle, initialDesc] = log.itemTitle.includes(' | ') ? log.itemTitle.split(' | ') : [log.itemTitle, ''];
            const isBad = log.type === 'behavior_bad';
            const isResolved = log.itemTitle.includes('Đã chuộc lỗi ✨');
            const isReflection = log.type === 'reflection' || log.type === 'behavior_reflection';

            const modal = document.createElement('div');
            modal.id = 'diary-detail-modal';
            modal.className = 'fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300';

            const renderContent = (isEditing = false) => {
                const title = isEditing ? `<input id="edit-title" type="text" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-emerald-400 focus:ring-0 rounded-xl px-4 py-2 text-center text-xl font-black text-slate-800" value="${initialTitle}">` : `<h3 class="text-2xl font-black text-slate-800">${initialTitle}</h3>`;

                const descContent = isEditing ?
                    `<textarea id="edit-desc" class="w-full h-32 bg-slate-50 border-2 border-slate-100 focus:border-emerald-400 focus:ring-0 rounded-[2rem] p-6 text-sm font-medium text-slate-600 transition-all resize-none shadow-inner">${initialDesc}</textarea>` :
                    `"${initialDesc || (isBad ? 'Con hãy cố gắng sửa đổi để tốt hơn nhé!' : 'Ba mẹ rất tự hào về con!')}"`;

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
                                ${title}
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">${log.time}</p>
                            </div>

                            <div class="space-y-2">
                                 <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left px-2">${isReflection ? 'Nội dung nhật ký' : 'Lời nhắn từ Ba Mẹ'}</p>
                                 <div class="bg-slate-50 ${isEditing ? 'p-2' : 'p-6'} rounded-[2rem] border border-slate-100 text-slate-600 font-medium leading-relaxed italic text-sm text-left relative overflow-hidden">
                                    ${!isEditing ? '<span class="material-symbols-outlined absolute -right-2 -bottom-2 text-slate-100 text-6xl opacity-50">format_quote</span>' : ''}
                                    ${descContent}
                                </div>
                            </div>

                            <div class="flex justify-center gap-6 py-2">
                                ${log.reward !== 0 ? `<div class="flex flex-col items-center gap-1"><span class="material-symbols-outlined text-orange-400 text-2xl" style="font-variation-settings:'FILL' 1">monetization_on</span><span class="text-xs font-black ${log.reward > 0 ? 'text-orange-600' : 'text-rose-500'}">${log.reward > 0 ? '+' : ''}${log.reward}</span></div>` : ''}
                                ${log.xp !== 0 ? `<div class="flex flex-col items-center gap-1"><span class="material-symbols-outlined text-amber-500 text-2xl">military_tech</span><span class="text-xs font-black ${log.xp > 0 ? 'text-amber-600' : 'text-rose-500'}">${log.xp > 0 ? '+' : ''}${log.xp}</span></div>` : ''}
                                ${log.sticker !== 0 ? `<div class="flex flex-col items-center gap-1"><span class="material-symbols-outlined text-pink-500 text-2xl rotate-12" style="font-variation-settings:'FILL' 1">sell</span><span class="text-xs font-black ${log.sticker > 0 ? 'text-pink-600' : 'text-rose-500'}">${log.sticker > 0 ? '+' : ''}${log.sticker}</span></div>` : ''}
                                ${log.water !== 0 ? `<div class="flex flex-col items-center gap-1"><span class="material-symbols-outlined text-blue-500 text-2xl" style="font-variation-settings:'FILL' 1">water_drop</span><span class="text-xs font-black ${log.water > 0 ? 'text-blue-600' : 'text-rose-500'}">${log.water > 0 ? '+' : ''}${log.water}</span></div>` : ''}
                            </div>

                            <div class="grid grid-cols-1 gap-3">
                                ${isEditing ? `
                                    <button id="btn-save-edit" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                                        <span class="material-symbols-outlined">save</span> LƯU THAY ĐỔI
                                    </button>
                                    <button id="btn-cancel-edit" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black py-4 rounded-2xl transition-all">
                                        HỦY
                                    </button>
                                ` : `
                                    ${isBad && !isResolved ? `
                                        <button onclick="window.handleAtonement('${log.id}')" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                                            <span class="material-symbols-outlined">auto_awesome</span>
                                            CON HỨA SẼ SỬA SAI
                                        </button>
                                    ` : ''}
                                    <div class="flex gap-3">
                                        <button id="btn-edit-mode" class="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-amber-100 flex items-center justify-center gap-2">
                                            <span class="material-symbols-outlined">edit</span> SỬA
                                        </button>
                                        <button onclick="document.getElementById('diary-detail-modal').remove()" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black py-4 rounded-2xl transition-all">
                                            ĐÓNG
                                        </button>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                `;

                if (isEditing) {
                    modal.querySelector('#btn-save-edit').onclick = async () => {
                        const newTitle = modal.querySelector('#edit-title').value.trim();
                        const newDesc = modal.querySelector('#edit-desc').value.trim();
                        if (!newTitle) return alert("Tiêu đề không được để trống!");

                        modal.querySelector('#btn-save-edit').disabled = true;
                        modal.querySelector('#btn-save-edit').innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> ĐANG LƯU...';

                        const success = await window.AppState.updateGrowthLog(logId, newTitle, newDesc);
                        if (success) {
                            window.showFamilyQuestAlert && window.showFamilyQuestAlert("Thành công", "Đã cập nhật nhật ký của con!", "success");
                            modal.remove();
                        } else {
                            modal.querySelector('#btn-save-edit').disabled = false;
                            modal.querySelector('#btn-save-edit').innerHTML = '<span class="material-symbols-outlined">save</span> LƯU THAY ĐỔI';
                        }
                    };
                    modal.querySelector('#btn-cancel-edit').onclick = () => renderContent(false);
                } else {
                    const editBtn = modal.querySelector('#btn-edit-mode');
                    if (editBtn) editBtn.onclick = () => renderContent(true);
                }
            };

            renderContent(false);
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
            modal.className = 'fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300';
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

        window.showDiaryDetail = (date) => {
            const group = groupedLogs[date];
            if (!group) return;

            const modal = document.createElement('div');
            modal.id = 'diary-detail-modal-full';
            modal.className = 'fixed inset-0 z-[4000] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300';

            modal.innerHTML = `
                <div class="bg-white dark:bg-[#2c2215] w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-[#3a2e22] flex flex-col">
                    <div class="p-6 sm:p-8 border-b border-slate-100 dark:border-[#3a2e22] flex items-center justify-between bg-slate-50 dark:bg-[#1a140c]">
                        <div class="flex items-center gap-4">
                            <div class="size-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                                <span class="material-symbols-outlined text-2xl">calendar_today</span>
                            </div>
                            <div>
                                <h3 class="text-2xl font-black text-slate-800 dark:text-white">${date === new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) ? 'Hôm nay' : date}</h3>
                                <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                    ${group.GOOD.length} VIỆC TỐT • ${group.BAD.length} CẦN RÈN LUYỆN
                                    ${group.REFLECTION.length > 0 ? ` • ${group.REFLECTION.length} NHẬT KÝ` : ''}
                                </p>
                            </div>
                        </div>
                        <button onclick="document.getElementById('diary-detail-modal-full').remove()" class="size-12 rounded-full bg-slate-200/50 hover:bg-slate-200 dark:bg-[#2c2215] dark:hover:bg-[#3a2e22] text-slate-500 flex items-center justify-center transition-all">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div class="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- GOOD COLUMN -->
                            <div class="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-[2.5rem] p-6 space-y-5 border border-emerald-100 dark:border-emerald-800/30 shadow-inner">
                                <div class="flex items-center gap-3 mb-2 px-2">
                                    <div class="size-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md">
                                        <span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' 1">sunny</span>
                                    </div>
                                    <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Những mầm tốt</span>
                                </div>
                                ${group.GOOD.length === 0 ? `<div class="p-8 rounded-3xl border-2 border-dashed border-emerald-100 text-center italic text-xs text-emerald-400 font-bold bg-white/50">Ngày hôm nay con chưa có ghi nhận tốt</div>` : group.GOOD.map(log => this.renderLogItem(log, true)).join('')}
                            </div>

                            <!-- BAD COLUMN -->
                            <div class="bg-rose-50/50 dark:bg-rose-900/10 rounded-[2.5rem] p-6 space-y-5 border border-rose-100 dark:border-rose-800/35 shadow-inner">
                                <div class="flex items-center gap-3 mb-2 px-2">
                                    <div class="size-8 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-md">
                                        <span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' 1">history_edu</span>
                                    </div>
                                    <span class="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Bài học rèn luyện</span>
                                </div>
                                ${group.BAD.length === 0 ? `<div class="p-8 rounded-3xl border-2 border-dashed border-rose-100 text-center italic text-xs text-rose-400 font-bold bg-white/50">Con đã rèn luyện rất tốt hôm nay!</div>` : group.BAD.map(log => this.renderLogItem(log, false)).join('')}
                            </div>
                        </div>

                        ${group.REFLECTION.length > 0 ? `
                            <div class="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-[#1a140c] dark:to-[#2c2215]/50 rounded-[2.5rem] p-6 sm:p-8 border border-indigo-100 dark:border-[#3a2e22] shadow-inner">
                                <div class="flex items-center gap-3 mb-5 px-2">
                                    <div class="size-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-md">
                                        <span class="material-symbols-outlined text-xl">auto_awesome</span>
                                    </div>
                                    <span class="text-sm font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Lời Tự Sự Của Con</span>
                                </div>
                                
                                <div class="space-y-4">
                                    ${group.REFLECTION.map(log => {
                const ratingMatch = log.itemTitle.match(/(\d+)\/10/);
                const rating = ratingMatch ? ratingMatch[1] : '?';
                const desc = (log.itemTitle.includes(' | ') ? log.itemTitle.split(' | ')[1] : log.itemDesc) || "Con hôm nay thật tuyệt vời!";
                return `
                                            <div class="bg-white dark:bg-[#1a140c]/80 rounded-[2rem] p-6 shadow-sm border border-indigo-50 dark:border-[#3a2e22] relative group hover:shadow-md transition-all">
                                                <div class="absolute top-4 right-4">
                                                    <div class="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-rose-900/20 rounded-full border border-red-100 dark:border-rose-900/30">
                                                        <span class="material-symbols-outlined text-red-500 text-xs fill-1">favorite</span>
                                                        <span class="text-xs font-black text-red-600 dark:text-rose-400">${rating}/10</span>
                                                    </div>
                                                </div>
                                                <div class="flex gap-4 items-start pr-16 text-left">
                                                    <span class="text-4xl opacity-20 text-indigo-300 dark:text-[#3a2e22] font-serif leading-none mt-1">"</span>
                                                    <div class="flex-1">
                                                        <p class="text-lg font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic mb-3 pt-2">${desc}</p>
                                                        <div class="flex items-center gap-1.5 text-[10px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest">
                                                            <span class="material-symbols-outlined text-[10px]">schedule</span>
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
                </div>
            `;

            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });
            document.body.appendChild(modal);
        };

        const todayStr = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const todayGroup = groupedLogs[todayStr];
        const pastDates = dateKeys.filter(d => d !== todayStr);

        this.innerHTML = `
            <div class="relative space-y-6 pb-20 antialiased overflow-visible">
                <!-- No background shells here, pure transparency -->

                <!-- 01. DASHBOARD HERO SECTION (Premium Minimalist Redesign) -->
                <div class="pt-8 px-6 sm:px-12">
                    <div class="relative group bg-white/70 dark:bg-white/5 backdrop-blur-2xl p-10 sm:p-14 rounded-[5rem] shadow-xl dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/5 overflow-hidden">
                        <!-- Dynamic Aura Background -->
                        <div class="absolute inset-0 bg-gradient-to-br from-${auraColor}-500/20 via-transparent to-transparent pointer-events-none opacity-50"></div>
                        <div class="absolute -right-20 -top-20 size-80 bg-${auraColor}-500/10 blur-[100px] rounded-full"></div>
                        
                        <div class="relative z-10 flex flex-col gap-8">
                            
                            <!-- Top Row: Identity, Score, Metrics -->
                            <div class="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-4 w-full">
                                
                                <!-- Left: Identity & Next Goal -->
                                <div class="w-full lg:w-[30%] space-y-6 text-center lg:text-left">
                                    <div class="space-y-1">
                                        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2 whitespace-nowrap">Cấp độ trưởng thành</p>
                                        <h3 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight drop-shadow-sm dark:drop-shadow-2xl">${auraTitle}</h3>
                                    </div>
                                    
                                    ${nextMilestone ? `
                                        <div class="pt-2 space-y-1 mx-auto lg:mx-0 max-w-[220px]">
                                            <p class="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Mục tiêu tiếp theo:</p>
                                            <div class="flex items-center justify-between mb-2">
                                                <span class="text-xs font-black text-slate-700 dark:text-white/80 whitespace-nowrap">${nextMilestone.title}</span>
                                                <span class="text-${auraColor}-600 dark:text-${auraColor}-400 font-bold ml-2">+${pointsToNext}đ</span>
                                            </div>
                                            <div class="h-1 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden border border-slate-300 dark:border-white/5">
                                                <div class="h-full bg-gradient-to-r from-${auraColor}-600 to-${auraColor}-400 shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-1000" style="width: ${progressToNext}%"></div>
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                                
                                <!-- Middle: Character Points (Hyper-Glassmorphic Sphere) -->
                                <div class="relative flex justify-center flex-shrink-0 lg:w-[40%]">
                                    <div class="relative group/score">
                                        <!-- Orbit Rings -->
                                        <div class="absolute inset-x-0 inset-y-0 border border-white/5 rounded-full scale-125 animate-[spin_20s_linear_infinite]"></div>
                                        <div class="absolute inset-x-0 inset-y-0 border border-white/5 rounded-full scale-110 animate-[spin_30s_linear_infinite_reverse] opacity-50"></div>
                                        
                                        <div class="absolute inset-x-0 inset-y-0 bg-${auraColor}-500/20 blur-[60px] rounded-full transition-all duration-700"></div>
                                        
                                        <div class="relative size-48 sm:size-56 rounded-full bg-white dark:bg-white/5 backdrop-blur-3xl border-2 border-slate-200 dark:border-white/20 shadow-xl dark:shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center overflow-hidden">
                                        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.05),transparent)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
                                        
                                        <div class="flex flex-col items-center gap-0">
                                            <span class="text-[11px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-[0.2em] mb-4">ĐIỂM NHÂN CÁCH</span>
                                            <div class="flex items-center gap-4">
                                                <div class="flex items-center justify-center size-10 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-inner">
                                                    <span class="material-symbols-outlined text-orange-400" style="font-variation-settings: 'FILL' 1">favorite</span>
                                                </div>
                                                <span class="${personalityScore > 999 ? 'text-4xl sm:text-5xl' : (personalityScore > 99 ? 'text-5xl sm:text-6xl' : 'text-7xl sm:text-8xl')} font-black text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none drop-shadow-sm dark:drop-shadow-2xl transition-all duration-300">${personalityScore}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Right: Performance Metrics -->
                            <div class="w-full lg:w-[30%] space-y-8">
                                <div class="flex items-end justify-between border-b border-slate-200 dark:border-white/5 pb-3">
                                    <div class="space-y-1">
                                        <p class="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Tỉ lệ rèn luyện</p>
                                        <h4 class="text-xl font-black text-slate-900 dark:text-white whitespace-nowrap">${Math.round(goodCount + badCount > 0 ? (goodCount / (goodCount + badCount) * 100) : 100)}% <span class="text-[9px] uppercase font-bold text-slate-400 dark:opacity-60">Bé ngoan</span></h4>
                                    </div>
                                    <div class="size-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-sm">
                                        <span class="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-xl font-bold">bolt</span>
                                    </div>
                                </div>
                                
                                <div class="space-y-3">
                                    <div class="bg-white/80 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-sm dark:shadow-none">
                                        <div class="flex items-center gap-2">
                                            <div class="size-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                                            <span class="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Khen ngợi</span>
                                        </div>
                                        <span class="text-sm font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">${goodCount}</span>
                                    </div>
                                    <div class="bg-white/80 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-sm dark:shadow-none">
                                        <div class="flex items-center gap-2">
                                            <div class="size-1.5 bg-rose-500 rounded-full shadow-[0_0_5px_rgba(244,63,94,0.5)]"></div>
                                            <span class="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nhắc nhở</span>
                                        </div>
                                        <span class="text-sm font-black text-rose-600 dark:text-rose-400 whitespace-nowrap">${badCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Roadmap Row: Integrated Journey Map -->
                        <div class="relative z-10 bg-slate-50/50 dark:bg-black/20 border border-slate-200 dark:border-white/5 p-8 rounded-[3rem] backdrop-blur-md">
                            <!-- Roadmap Label (Minimalist Harmonized Style) -->
                            <div class="flex items-center gap-4 mb-8">
                                <div class="h-px flex-1 bg-slate-200 dark:bg-white/5"></div>
                                <div class="flex items-center gap-2 text-amber-500">
                                    <span class="material-symbols-outlined text-sm">timeline</span>
                                    <span class="text-[9px] font-black text-slate-500 dark:text-white/40 uppercase tracking-[0.4em] whitespace-nowrap">Lộ trình trưởng thành</span>
                                </div>
                                <div class="h-px flex-1 bg-slate-200 dark:bg-white/5"></div>
                            </div>

                            <div class="flex items-center justify-center gap-2 overflow-visible">
                                ${milestones.map((m, idx) => {
            const isCurrent = m.title === auraTitle;
            const isPassed = personalityScore >= m.score;
            return `
                                        <div class="relative flex-1 flex flex-col items-center group/m">
                                            <!-- Path Line -->
                                            ${idx > 0 ? `<div class="absolute top-1/2 -left-1/2 w-full h-[1px] ${isPassed ? 'bg-emerald-500/50' : 'bg-slate-200 dark:bg-white/10'} -translate-y-1/2 z-0"></div>` : ''}
                                            
                                            <!-- Node Shell -->
                                            <div class="relative z-10 size-9 rounded-2xl flex items-center justify-center text-lg transition-all duration-500 
                                                ${isCurrent ? 'bg-amber-500 text-white scale-125 shadow-lg shadow-amber-500/40' :
                    (isPassed ? 'bg-emerald-500/20 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-white/5 border border-slate-200 dark:border-white/5')}">
                                                ${m.emoji}
                                                ${isCurrent ? `<div class="absolute inset-x-0 inset-y-0 rounded-2xl bg-amber-500 animate-ping opacity-20"></div>` : ''}
                                                
                                                <!-- Minimalist Tooltip -->
                                                <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 border border-white/10 text-[8px] font-black text-white rounded-lg opacity-0 group-hover/m:opacity-100 transition-all scale-75 group-hover/m:scale-100 whitespace-nowrap pointer-events-none z-20">
                                                    ${m.title}
                                                </div>
                                            </div>
                                        </div>
                                    `;
        }).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 02. MAIN JOURNEY (Expanding Grid Architecture) -->
                <div class="px-6 sm:px-12 mt-20 space-y-24 pb-20">
                    
                    <!-- TODAY'S LOGS (Reverted to 2-Column Layout) -->
                    <section class="max-w-[85rem] mx-auto space-y-10">
                        <div class="flex items-center gap-6">
                            <h4 class="flex items-center gap-3 text-slate-800 dark:text-white font-black text-sm uppercase tracking-[0.4em] whitespace-nowrap">
                                <span class="material-symbols-outlined text-amber-500">category</span>
                                Hoạt động hôm nay <span class="text-[10px] font-bold text-slate-400 tracking-normal ml-2">(${new Date().toLocaleDateString('vi-VN')})</span>
                            </h4>
                            <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                        </div>

                        ${!todayGroup ? `
                            <div class="py-12 text-center bg-white/40 dark:bg-black/20 rounded-[3rem] border border-slate-100 dark:border-white/5 border-dashed">
                                <p class="text-slate-400 font-medium">Chưa có hoạt động nào trong ngày hôm nay.</p>
                            </div>
                        ` : `
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <!-- GOOD DEEDS -->
                                <div class="space-y-4">
                                    <div class="flex items-center gap-3 px-5 py-3 bg-emerald-500/10 text-emerald-500 rounded-2xl w-full border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                                        <span class="material-symbols-outlined text-base">verified</span>
                                        <span class="text-xs font-black uppercase tracking-[0.2em]">Việc Làm Tốt</span>
                                    </div>
                                    <div class="space-y-4">
                                        ${todayGroup.GOOD.length === 0 ? `
                                            <div class="p-8 rounded-[2.5rem] bg-emerald-50/50 dark:bg-emerald-900/5 border border-dashed border-emerald-200 dark:border-emerald-800/20 text-center text-sm text-slate-400 font-medium italic">Chưa có ghi nhận việc tốt nào hôm nay.</div>
                                        ` : todayGroup.GOOD.map(log => this.renderLogItem(log, true)).join('')}
                                    </div>
                                </div>
                                
                                <!-- REMINDERS -->
                                <div class="space-y-4">
                                    <div class="flex items-center gap-3 px-5 py-3 bg-rose-500/10 text-rose-500 rounded-2xl w-full border border-rose-500/20 shadow-lg shadow-rose-500/5">
                                        <span class="material-symbols-outlined text-base">report</span>
                                        <span class="text-xs font-black uppercase tracking-[0.2em]">Việc Làm Chưa Tốt</span>
                                    </div>
                                    <div class="space-y-4">
                                        ${todayGroup.BAD.length === 0 ? `
                                            <div class="p-8 rounded-[2.5rem] bg-rose-50/50 dark:bg-rose-900/5 border border-dashed border-rose-200 dark:border-rose-800/20 text-center text-sm text-slate-400 font-medium italic">Thật tuyệt vời, hôm nay con chưa có việc chưa tốt nào!</div>
                                        ` : todayGroup.BAD.map(log => this.renderLogItem(log, false)).join('')}
                                    </div>
                                </div>
                            </div>

                            <!-- TODAY'S REFLECTIONS -->
                            ${todayGroup.REFLECTION.length > 0 ? `
                                <div class="col-span-1 md:col-span-2 space-y-6 pt-10 border-t border-slate-100 dark:border-white/5">
                                    <div class="flex items-center gap-3 px-5 py-3 bg-indigo-500/10 text-indigo-500 rounded-2xl w-fit border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                                        <span class="material-symbols-outlined text-base">auto_awesome</span>
                                        <span class="text-xs font-black uppercase tracking-[0.2em]">Lời Tự Sự Của Con</span>
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        ${todayGroup.REFLECTION.map(log => {
            const ratingMatch = (log.itemTitle || "").match(/(\d+)\/10/);
            const rating = ratingMatch ? ratingMatch[1] : '?';
            const desc = (log.itemTitle.includes(' | ') ? log.itemTitle.split(' | ')[1] : log.itemDesc) || "Con hôm nay thật tuyệt vời!";
            return `
                                                <div class="bg-white dark:bg-[#1a140c]/60 rounded-3xl p-6 shadow-sm border border-indigo-50 dark:border-white/5 relative group hover:shadow-md transition-all">
                                                    <div class="absolute top-4 right-4">
                                                        <div class="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 rounded-full border border-rose-100 dark:border-rose-900/30">
                                                            <span class="material-symbols-outlined text-rose-500 text-xs" style="font-variation-settings:'FILL' 1">favorite</span>
                                                            <span class="text-xs font-black text-rose-600 dark:text-rose-400">${rating}/10</span>
                                                        </div>
                                                    </div>
                                                    <div class="flex gap-4 items-start pr-16 text-left">
                                                        <span class="text-4xl opacity-20 text-indigo-300 dark:text-slate-700 font-serif leading-none mt-1">"</span>
                                                        <div class="flex-1">
                                                            <p class="text-base font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic mb-3 pt-2">${desc}</p>
                                                            <div class="flex items-center gap-1.5 text-[9px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest">
                                                                <span class="material-symbols-outlined text-[10px]">schedule</span>
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
                        `}
                    </section>

                    <!-- Diary Writing Area (Expanded) -->
                    <section class="max-w-[85rem] mx-auto bg-slate-900 dark:bg-[#2c2215] p-8 sm:p-14 rounded-[4rem] shadow-2xl relative overflow-hidden text-white border border-white/5">
                        <div class="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <span class="material-symbols-outlined text-[100px]">auto_stories</span>
                        </div>
                        
                        <div class="relative z-10 space-y-10">
                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 class="text-3xl font-black tracking-tight mb-2 whitespace-nowrap">Hôm nay của con thế nào?</h3>
                                    <p class="text-slate-400 font-medium text-sm">Hôm nay con cảm thấy thế nào? Hãy chia sẻ với bố mẹ nhé! ❤️</p>
                                </div>
                                <div class="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl flex-shrink-0">
                                    <span class="material-symbols-outlined text-rose-500" style="font-variation-settings: 'FILL' 1">favorite</span>
                                    <span class="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Cảm nhận của con</span>
                                </div>
                            </div>

                            <!-- Optimized Heart Row -->
                            <div class="flex flex-wrap justify-center md:justify-start gap-3">
                                ${Array.from({ length: 10 }).map((_, i) => {
            const rating = i + 1;
            const currentRating = parseInt(localStorage.getItem('daily_rating_' + data.user.id)) || 0;
            const isActive = rating <= currentRating;
            return `
                                        <button onclick="window.setDailyRating(${rating})" 
                                            class="heart-btn size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center group ${isActive ? 'bg-rose-500/20 shadow-lg shadow-rose-500/10' : ''}">
                                            <span class="material-symbols-outlined text-2xl ${isActive ? 'text-rose-500' : 'text-white/20 group-hover:text-white/40'}" style="font-variation-settings: 'FILL' ${isActive ? '1' : '0'}">favorite</span>
                                        </button>
                                    `;
        }).join('')}
                            </div>

                            <div class="relative group">
                                <textarea id="reflection-text" 
                                    oninput="localStorage.setItem('daily_reflection_' + '${data.user.id}', this.value)"
                                    class="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-lg font-medium text-white focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400/50 transition-all outline-none min-h-[140px] placeholder:text-slate-600 resize-none pr-20"
                                    placeholder="VD: Hôm nay con rất vui vì được điểm 10, hoặc con hơi buồn vì chưa làm xong bài...">${localStorage.getItem('daily_reflection_' + data.user.id) || ''}</textarea>
                                
                                <button id="voice-record-btn" onclick="window.toggleVoiceRecording()" class="absolute bottom-6 right-6 size-12 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center justify-center transition-all group/mic">
                                    <span id="voice-mic-icon" class="material-symbols-outlined text-amber-400 group-hover/mic:scale-110">mic</span>
                                </button>
                            </div>

                            <button onclick="window.saveDailyReflection()" 
                                class="w-full h-16 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-sm rounded-[2rem] shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] group">
                                <span class="material-symbols-outlined text-xl group-hover:rotate-12">save</span>
                                Ghi lại hành trình
                            </button>
                        </div>
                    </section>

                    <!-- 03. HISTORY ARCHIVE (Full Width) -->
                    <section class="max-w-[85rem] mx-auto pt-16 border-t border-slate-100 dark:border-white/5">
                        <div class="flex items-center justify-between mb-10 px-4">
                            <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">Hành trình đã qua</h4>
                            <div class="px-4 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-black text-slate-400">
                                ${pastDates.length} bản ghi
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            ${pastDates.length === 0 ? `
                                <div class="col-span-2 py-8 text-center text-slate-300 text-xs italic">Chưa có dữ liệu lịch sử.</div>
                            ` : pastDates.map((date, idx) => {
            const group = groupedLogs[date];
            return `
                                    <div onclick="window.showDiaryDetail('${date}')" class="flex items-center justify-between p-5 bg-white dark:bg-[#1a140c] border border-slate-100 dark:border-white/5 rounded-[2rem] hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer group">
                                        <div class="flex items-center gap-4">
                                            <div class="size-10 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors">
                                                <span class="material-symbols-outlined text-lg">calendar_today</span>
                                            </div>
                                            <div>
                                                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">${date.split(', ')[0]}</p>
                                                <h5 class="text-sm font-black text-slate-800 dark:text-white">${date.split(', ')[1]}</h5>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-4">
                                            <div class="h-1 w-12 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                <div class="h-full bg-emerald-500" style="width: ${group.GOOD.length / (group.GOOD.length + group.BAD.length || 1) * 100}%"></div>
                                            </div>
                                            <span class="material-symbols-outlined text-slate-200 group-hover:text-slate-400">chevron_right</span>
                                        </div>
                                    </div>
                                `;
        }).join('')}
                        </div>
                    </section>
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
            const currentRating = parseInt(localStorage.getItem('daily_rating_' + data.user.id)) || 0;

            // Toggle logic: if same rating clicked, set to 0
            const newRating = (rating === currentRating) ? 0 : rating;

            if (newRating > 0) {
                localStorage.setItem('daily_rating_' + data.user.id, newRating);
            } else {
                localStorage.removeItem('daily_rating_' + data.user.id);
            }

            document.querySelectorAll('.heart-btn').forEach((btn, i) => {
                const r = i + 1;
                const icon = btn.querySelector('.material-symbols-outlined');
                const label = btn.querySelector('span:last-child');
                const glow = btn.querySelector('.blur-xl');

                if (r <= newRating && newRating > 0) {
                    btn.classList.remove('opacity-40');
                    btn.classList.add('scale-115');
                    icon.classList.add('text-red-500');
                    icon.classList.remove('text-slate-300');
                    icon.style.fontVariationSettings = "'FILL' 1";
                    if (label) {
                        label.classList.add('text-red-500');
                        label.classList.remove('text-slate-400');
                    }
                    if (glow) glow.classList.add('opacity-100');
                } else {
                    btn.classList.add('opacity-40');
                    btn.classList.remove('scale-115');
                    icon.classList.remove('text-red-500');
                    icon.classList.add('text-slate-300');
                    icon.style.fontVariationSettings = "'FILL' 0";
                    if (label) {
                        label.classList.remove('text-red-500');
                        label.classList.add('text-slate-400');
                    }
                    if (glow) {
                        glow.classList.remove('opacity-100');
                        glow.classList.add('opacity-0');
                    }
                }
            });
            if (window.confetti && newRating > 0) {
                window.confetti({ particleCount: 20 * newRating, spread: 85, origin: { y: 0.85 }, colors: ['#ef4444', '#ffffff'] });
            }
        };

        window.saveDailyReflection = async () => {
            const textarea = document.getElementById('reflection-text');
            const currentText = textarea ? textarea.value.trim() : '';
            const currentRating = localStorage.getItem('daily_rating_' + data.user.id);
            const userId = data.user.id;

            if (!currentRating) {
                window.showFamilyQuestAlert("Nhắc nhở", "Con hãy chọn số trái tim để đánh giá ngày hôm nay nhé!", "warning");
                return;
            }

            if (!currentRating) {
                window.showFamilyQuestAlert("Lưu ý", "Con hãy chọn mức độ hài lòng bằng các trái tim trước nhé! ❤️", "warning");
                return;
            }

            const backupText = currentText;
            const backupRating = currentRating;

            if (window.AppState) {
                try {
                    // Show loading state on button
                    const btn = document.querySelector('button[onclick="window.saveDailyReflection()"]');
                    const originalBtnContent = btn ? btn.innerHTML : '';
                    if (btn) btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> ĐANG LƯU...';

                    const result = await window.AppState.resolveBehavior(null, {
                        title: `Tự đánh giá: ${currentRating}/10 điểm`,
                        description: currentText || "Con cảm thấy hài lòng với hôm nay!"
                    });

                    if (result) {
                        // 1. CLEAR NOW (after success)
                        localStorage.setItem('daily_rating_' + userId, '');
                        localStorage.setItem('daily_reflection_' + userId, '');
                        localStorage.removeItem('daily_rating_' + userId);
                        localStorage.removeItem('daily_reflection_' + userId);
                        if (textarea) textarea.value = '';
                        window.setDailyRating(0);

                        window.showFamilyQuestAlert("Tuyệt vời", "Nhật Ký Trưởng Thành của con đã được lưu vào rồi nhé! ✨", "success");
                        if (window.confetti) {
                            window.confetti({ particleCount: 200, spread: 150, origin: { y: 0.7 }, colors: ['#10b981', '#ffffff'] });
                        }
                        window.showFamilyQuestAlert("Tuyệt vời", "Nhật Ký Trưởng Thành của con đã được lưu vào rồi nhé! ✨", "success");

                        window.scrollTo({ top: 0, behavior: 'smooth' });

                        // Final cleanup just in case sync put it back
                        localStorage.removeItem('daily_rating_' + userId);
                        localStorage.removeItem('daily_reflection_' + userId);
                        localStorage.setItem('daily_rating_saved_' + userId, 'true'); // Flag to prevent immediate clear on re-render

                        setTimeout(() => {
                            this.render(window.AppState.data);
                            // Force final DOM cleanup one more time
                            const finalCleanupText = document.getElementById('reflection-text');
                            if (finalCleanupText) finalCleanupText.value = '';
                            window.setDailyRating(0);
                        }, 300);
                    } else {
                        throw new Error("Save failure");
                    }
                } catch (err) {
                    const errorBtn = document.querySelector('button[onclick="window.saveDailyReflection()"]');
                    if (errorBtn) errorBtn.innerHTML = '<span class="material-symbols-outlined pb-1">save</span> Ghi lại hành trình';

                    console.error("Diary save error:", err);
                    localStorage.setItem('daily_rating_' + userId, backupRating);
                    localStorage.setItem('daily_reflection_' + userId, backupText);
                    if (textarea) textarea.value = backupText;
                    window.setDailyRating(backupRating);
                    window.showFamilyQuestAlert("Lỗi kết nối", "Hệ thống chưa lưu được nhật ký, con hãy nhấn nút gửi lại nhé! 🛠️", "error");
                }
            }
        };
    }

    renderLogItem(log, isGood) {
        const behaviorList = window.GROWTH_BEHAVIORS[isGood ? 'GOOD' : 'BAD'] || [];
        let [title, splitDesc] = log.itemTitle.includes(' | ') ? log.itemTitle.split(' | ') : [log.itemTitle, ''];

        // Ultrahard Date Stripping (e.g. "Title 26/2/2026", "Title 26/2/", "Title 26/2", "Title 26/02")
        title = title.replace(/\s+\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?\/?/g, '').trim();
        // Fallback for cases like "26/2/" at the very end without a space
        title = title.replace(/\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?\/?$/g, '').trim();

        const description = splitDesc || log.itemDesc || '';
        const behavior = behaviorList.find(b => b.text === title);

        const isRepairing = log.status === 'repairing';
        const isResolved = log.status === 'resolved' || log.itemTitle.includes('Đã sửa lỗi hoàn hảo ✨');

        let emoji = isGood ? '✨' : (isResolved ? '🌱' : '⚠️');
        if (isRepairing) emoji = '⏳';
        if (behavior) emoji = behavior.emoji;

        const accentColor = isGood ? 'emerald' : 'rose';

        return `
            <div onclick="window.showGrowthDetail('${log.id}')" 
                class="group relative p-6 rounded-[2rem] bg-white dark:bg-[#1a140c]/40 border border-slate-100 dark:border-white/5 hover:border-${accentColor}-400/50 hover:shadow-xl hover:shadow-${accentColor}-500/5 transition-all cursor-pointer overflow-hidden">
                
                ${isResolved ? `<div class="absolute top-0 right-0 px-4 py-1.5 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-2xl shadow-lg">Victory ✨</div>` : ''}
                
                <div class="flex items-center gap-5">
                    <div class="size-14 rounded-2xl bg-${accentColor}-50 dark:bg-${accentColor}-900/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 select-none shadow-sm">
                        ${emoji}
                    </div>
                    
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-center mb-1">
                            <h6 class="font-black ${isGood ? 'text-slate-800' : 'text-rose-600'} dark:text-white text-base truncate flex-1">${title}</h6>
                        </div>
                        
                        ${description ? `<p class="text-xs font-medium text-slate-400 dark:text-slate-500 line-clamp-1">${description}</p>` : ''}
                        
                        <div class="flex items-center gap-3 mt-3">
                            ${log.reward !== 0 ? `
                                <div class="flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[14px] text-amber-500" style="font-variation-settings:'FILL' 1">monetization_on</span>
                                    <span class="text-[10px] font-black ${log.reward > 0 ? 'text-amber-600' : 'text-rose-500'}">${log.reward > 0 ? '+' : ''}${log.reward}</span>
                                </div>
                            ` : ''}
                            ${log.xp !== 0 ? `
                                <div class="flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[14px] text-indigo-500">military_tech</span>
                                    <span class="text-[10px] font-black ${log.xp > 0 ? 'text-indigo-600' : 'text-rose-500'}">${log.xp > 0 ? '+' : ''}${log.xp}</span>
                                </div>
                            ` : ''}
                            ${log.sticker !== 0 ? `
                                <div class="flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[14px] text-pink-500 rotate-12" style="font-variation-settings:'FILL' 1">sell</span>
                                    <span class="text-[10px] font-black ${log.sticker > 0 ? 'text-pink-600' : 'text-rose-500'}">${log.sticker > 0 ? '+' : ''}${log.sticker}</span>
                                </div>
                            ` : ''}
                            ${log.water !== 0 ? `
                                <div class="flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[14px] text-blue-500" style="font-variation-settings:'FILL' 1">water_drop</span>
                                    <span class="text-[10px] font-black ${log.water > 0 ? 'text-blue-600' : 'text-rose-500'}">${log.water > 0 ? '+' : ''}${log.water}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="size-8 rounded-full border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-200 dark:text-slate-800 group-hover:text-primary transition-colors">
                        <span class="material-symbols-outlined text-lg">chevron_right</span>
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
