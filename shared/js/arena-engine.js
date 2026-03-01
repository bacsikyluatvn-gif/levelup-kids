/**
 * Global Arena Engine - Handles Bot Challenges & Invitations across all pages
 */

// Global Engine State
let currentInvitingBot = null;
let currentInvitingTask = null;
let botInvitationInterval = null;

function scheduleNextBotChallenge() {
    // Tần suất ngẫu nhiên từ 3 đến 10 phút (180000ms - 600000ms)
    const isDebug = window.location.search.includes('debug=true');
    const randomTime = isDebug ? 10000 : Math.floor(Math.random() * (600000 - 180000 + 1)) + 180000;

    console.log(`[ArenaEngine] 🛡️ Lên lịch kiểm tra thách đấu mới sau ${Math.round(randomTime / 1000)} giây...`);

    if (botInvitationInterval) clearTimeout(botInvitationInterval);
    botInvitationInterval = setTimeout(() => {
        checkForBotChallenge();
        scheduleNextBotChallenge();
    }, randomTime);
}

function getGlobalSuitableTask(isBotInitiated = false) {
    const hour = new Date().getHours();
    const taskPool = isBotInitiated ? window.HERO_TASKS : Object.keys(window.TASK_SCHEDULE);

    const validTasks = (taskPool || []).filter(task => {
        const range = window.TASK_SCHEDULE[task];
        return range && hour >= range.start && hour <= range.end;
    });

    if (validTasks.length === 0) {
        return isBotInitiated ? window.HERO_TASKS[Math.floor(Math.random() * window.HERO_TASKS.length)] : null;
    }
    return validTasks[Math.floor(Math.random() * validTasks.length)];
}

function checkForBotChallenge() {
    console.log("[ArenaEngine] Running periodic check for bot challenges...");

    // Check if any modal is truly visible (not hidden by CSS or Tailwind classes)
    const isAnyModalVisible = Array.from(document.querySelectorAll('.fixed.inset-0')).some(el => {
        // Skip our own invitation modal
        if (el.id === 'bot-invitation-modal') return false;
        // Skip elements hidden by Tailwind 'hidden' class or display:none
        if (el.classList.contains('hidden') || el.style.display === 'none') return false;
        // Skip elements that are invisible (opacity-0 + pointer-events-none)
        if (el.classList.contains('opacity-0') && el.classList.contains('pointer-events-none')) return false;
        // Check if it's an overlay-style modal
        const isOverlay = el.classList.contains('bg-slate-900/80') || el.classList.contains('bg-slate-900/40') || el.classList.contains('bg-slate-900/90') || el.classList.contains('bg-black') || el.classList.contains('bg-slate-900/60') || el.classList.contains('bg-black/60');
        return isOverlay;
    });

    if (isAnyModalVisible || !window.AppState || !window.AppState.data.user) {
        console.log("[ArenaEngine] Bỏ qua thách đấu vì đang bận hoặc chưa sẵn sàng. Modals visible:", isAnyModalVisible);
        return;
    }

    const userData = window.AppState.data.user;
    if (userData.role !== 'child') {
        console.log("[ArenaEngine] Ngừng check vì user không phải role CHILD:", userData.role);
        return;
    }

    const passiveUsed = window.AppState.getDailyChallengeCount(userData.id, 'passive');
    console.log("[ArenaEngine] Current passive challenges used today:", passiveUsed);

    const isDebug = window.location.search.includes('debug=true');
    const triggerChance = 1.0; // Always trigger for testing

    if (passiveUsed < 3 && Math.random() < triggerChance) {
        console.log("[ArenaEngine] Conditions met for a new challenge!");

        const bots = window.AppState.data.leaderboard.filter(p => p.role === 'bot');
        if (bots.length === 0) {
            console.warn("[ArenaEngine] No bots found in leaderboard to challenge.");
            return;
        }

        // Tránh chọn chính mình hoặc Ba Mẹ
        const validBots = bots.filter(b => b.id !== userData.id);
        if (validBots.length === 0) {
            console.warn("[ArenaEngine] No valid bots found (excluding user).");
            return;
        }

        const randomBot = validBots[Math.floor(Math.random() * validBots.length)];
        const suitableTask = getGlobalSuitableTask(true);

        console.log("[ArenaEngine] Selected bot:", randomBot.name, "with task:", suitableTask);

        if (suitableTask) {
            openGlobalBotInvitation(randomBot, suitableTask);
        } else {
            console.warn("[ArenaEngine] Failed to find a suitable task for bot challenge.");
        }
    } else {
        console.log(`[ArenaEngine] ⏭️ Bỏ qua chu kỳ này: passiveUsed=${passiveUsed}, chance=${triggerChance}`);
    }
}

function ensureInvitationModal() {
    if (document.getElementById('bot-invitation-modal')) return;

    const modalHtml = `
        <div id="bot-invitation-modal" class="fixed inset-0 z-[1000] flex items-center justify-center p-0 bg-black backdrop-blur-3xl opacity-0 pointer-events-none transition-all duration-700 font-['Montserrat']">
            <!-- Background VFX -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.1)_0%,transparent_70%)] animate-pulse"></div>
                <div class="lightning-overlay absolute inset-0 bg-white/20"></div>
            </div>
            <div id="bot-invitation-content" class="w-full h-full transform scale-90 transition-all duration-700 overflow-hidden relative bg-[#0f172a] flex flex-col justify-center">
                <!-- Animated Split Background -->
                <div class="absolute inset-0 flex pointer-events-none z-0">
                    <div class="w-full h-full absolute inset-0 flex">
                        <div class="w-1/2 bg-gradient-to-br from-rose-600 via-rose-800 to-black lightning-split opacity-80"></div>
                        <div class="w-1/2 bg-gradient-to-br from-blue-600 via-blue-800 to-black lightning-split-right opacity-80 ms-[-20%]"></div>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90"></div>
                </div>

                <div class="relative z-10 p-10 sm:p-14 text-center">
                    <!-- Battle Header -->
                    <div class="mb-12">
                        <div class="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
                            <span class="material-symbols-outlined text-yellow-400 text-sm animate-spin">stars</span>
                            <span class="text-[10px] font-black text-white uppercase tracking-[0.3em]">LỜI THÁCH ĐẤU TỪ HUYỀN THOẠI</span>
                        </div>

                        <div class="flex items-center justify-center gap-4 sm:gap-10">
                            <!-- Bot Side -->
                            <div class="flex flex-col items-center gap-6 group">
                                <div class="relative">
                                    <div class="absolute -inset-4 bg-rose-500/30 rounded-full blur-2xl animate-pulse"></div>
                                    <img id="invitation-bot-avatar" src="" class="w-28 h-28 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-[0_0_40px_rgba(244,63,94,0.6)] relative z-10 aura-active-red">
                                    <div class="absolute -bottom-3 -right-3 bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-2xl z-20 uppercase tracking-tighter border-2 border-white/20">ATTACKER</div>
                                </div>
                                <h3 class="text-2xl font-black text-white uppercase italic tracking-widest drop-shadow-lg" id="invitation-bot-name">Hiệp sĩ</h3>
                                <div id="invitation-bot-rank" class="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 font-black text-xs uppercase tracking-[0.2em] backdrop-blur-md">
                                    <span class="material-symbols-outlined text-[14px]">military_tech</span>
                                    HẠNG <span id="invitation-bot-rank-num">-</span>
                                </div>
                            </div>

                            <!-- VS Center -->
                            <div class="relative py-10">
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-500/20 blur-3xl rounded-full animate-pulse"></div>
                                <span class="vs-text-styled text-7xl sm:text-8xl drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">VS</span>
                            </div>

                            <!-- Your Side -->
                            <div class="flex flex-col items-center gap-6">
                                <div class="relative">
                                    <div class="absolute -inset-4 bg-blue-500/20 rounded-full blur-2xl"></div>
                                    <img id="invitation-your-avatar" src="" class="w-28 h-28 sm:w-40 sm:h-40 rounded-full border-4 border-white/40 shadow-2xl relative z-10 grayscale-[0.5] opacity-80 aura-active-blue">
                                    <div class="absolute -bottom-3 -left-3 bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-2xl z-20 uppercase tracking-tighter border-2 border-white/20">DEFENDER</div>
                                </div>
                                <h3 class="text-2xl font-black text-white uppercase italic tracking-widest drop-shadow-lg" id="invitation-your-name">BẠN</h3>
                                <div id="invitation-your-rank" class="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-black text-xs uppercase tracking-[0.2em] backdrop-blur-md">
                                    <span class="material-symbols-outlined text-[14px]">stars</span>
                                    HẠNG <span id="invitation-your-rank-num">-</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Task Card -->
                    <div class="invitation-glass-card rounded-[3.5rem] p-8 mb-12 border-2 border-white/10 relative overflow-hidden scanner-effect group hover:border-yellow-500/50 transition-colors">
                        <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                            <span class="material-symbols-outlined text-8xl text-white">swords</span>
                        </div>
                        <p class="text-[11px] font-black text-yellow-500 uppercase tracking-[0.4em] mb-6">NHIỆM VỤ CHIẾN ĐẤU</p>
                        <div class="flex items-center justify-center gap-8 relative z-10">
                            <div class="w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                                <span id="invitation-task-emoji" class="text-6xl sm:text-8xl filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]">⚔️</span>
                            </div>
                            <div class="text-left flex-1">
                                <span id="invitation-task-name" class="text-3xl sm:text-5xl font-black text-white uppercase italic leading-none block mb-4 tracking-tighter drop-shadow-md">Nhiệm vụ</span>
                                <div class="h-[2px] w-20 bg-gradient-to-r from-yellow-500 to-transparent mb-4"></div>
                                <p id="invitation-task-desc" class="text-sm sm:text-lg text-slate-300 font-medium leading-snug italic opacity-80">"Bé có dám nhận lời thách đấu này không?"</p>
                            </div>
                        </div>
                    </div>

                    <!-- Action Central -->
                    <div class="flex flex-col sm:flex-row gap-5 relative z-10">
                        <button id="btn-accept-bot-global" onclick="acceptGlobalBotChallenge()" class="flex-[2] group py-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-rose-600 text-white font-black rounded-[2.5rem] text-3xl shadow-[0_20px_60px_rgba(249,115,22,0.5)] hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-4 shimmer-btn border-t-4 border-white/30">
                            <span class="material-symbols-outlined text-4xl animate-bounce">rocket_launch</span> BẮT ĐẦU CHIẾN!
                        </button>
                        <button onclick="closeGlobalBotInvitation()" class="flex-1 py-8 px-10 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white font-black rounded-[2.5rem] text-xl backdrop-blur-3xl transition-all border border-white/10 hover:border-white/30">ĐỂ SAU...</button>
                    </div>
                </div>
            </div>
            <style>
                #bot-invitation-modal .vs-text-styled {
                    font-weight: 900; font-style: italic;
                    background: linear-gradient(to bottom, #fff 30%, #ffd700 100%);
                    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
                }
                #bot-invitation-modal .invitation-glass-card {
                    background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(16px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                }
                #bot-invitation-modal .lightning-split { clip-path: polygon(0 0, 60% 0, 40% 100%, 0 100%); }
                #bot-invitation-modal .lightning-split-right { clip-path: polygon(60% 0, 100% 0, 100% 100%, 40% 100%); }
                
                @keyframes aura-blue { from { box-shadow: 0 0 10px #3b82f6; } to { box-shadow: 0 0 30px #3b82f6; } }
                @keyframes aura-red { from { box-shadow: 0 0 10px #f43f5e; } to { box-shadow: 0 0 30px #f43f5e; } }
                .aura-active-blue { animation: aura-blue 2s infinite alternate; }
                .aura-active-red { animation: aura-red 2s infinite alternate; }
                
                #bot-invitation-modal .scanner-effect::after {
                    content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 20%;
                    background: linear-gradient(to bottom, transparent, rgba(234, 179, 8, 0.2), transparent);
                    animation: scanning 2s linear infinite;
                }
                @keyframes scanning { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
                
                .shimmer-btn::before {
                    content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
                    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                    transform: rotate(45deg); animation: shimmer 3s infinite;
                }
                @keyframes shimmer { 0% { transform: translateX(-100%) rotate(45deg); } 100% { transform: translateX(100%) rotate(45deg); } }
            </style>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function openGlobalBotInvitation(bot, task) {
    ensureInvitationModal();

    // Sound
    try {
        const audio = new Audio('../shared/assets/khieu chien.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio blocked"));
    } catch (e) { }

    currentInvitingBot = bot;
    currentInvitingTask = task;

    document.getElementById('invitation-bot-avatar').src = bot.avatar;
    document.getElementById('invitation-bot-name').textContent = bot.name.replace(' (Bot)', '');

    const lb = [...window.AppState.data.leaderboard].sort((a, b) => (b.weeklyXp || 0) - (a.weeklyXp || 0));
    const botRank = lb.findIndex(p => p.id === bot.id) + 1;
    document.getElementById('invitation-bot-rank-num').textContent = botRank > 0 ? botRank : '-';

    const yourAvatarImg = document.getElementById('invitation-your-avatar');
    const currentUser = window.AppState.data.user;
    if (yourAvatarImg && currentUser) {
        yourAvatarImg.src = currentUser.avatar;
        const yourRank = lb.findIndex(p => p.id === currentUser.id) + 1;
        document.getElementById('invitation-your-rank-num').textContent = yourRank > 0 ? yourRank : '-';
        const yourNameEl = document.getElementById('invitation-your-name');
        if (yourNameEl) yourNameEl.textContent = currentUser.name.toUpperCase();
    }

    document.getElementById('invitation-task-emoji').textContent = window.TASK_EMOJI[task] || '⚔️';
    document.getElementById('invitation-task-name').textContent = task.toUpperCase();
    document.getElementById('invitation-task-desc').textContent = `"${window.TASK_CONDITIONS[task].split('.')[0]}."`;

    const modal = document.getElementById('bot-invitation-modal');
    const content = document.getElementById('bot-invitation-content');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => content.classList.remove('scale-90'), 10);
}

function closeGlobalBotInvitation() {
    const modal = document.getElementById('bot-invitation-modal');
    if (!modal) return;
    const content = document.getElementById('bot-invitation-content');

    content.classList.add('scale-90');
    setTimeout(() => {
        modal.classList.add('opacity-0', 'pointer-events-none');
    }, 200);
}

async function acceptGlobalBotChallenge() {
    if (!currentInvitingBot || !currentInvitingTask || !window.AppState) return;

    const btn = document.getElementById('btn-accept-bot-global');
    if (!btn) return;

    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> ĐANG CHUẨN BỊ...';

    try {
        const result = await window.AppState.createBotChallenge(currentInvitingBot.id, currentInvitingTask);
        if (result && !result.error) {
            closeGlobalBotInvitation();
            if (window.showLevelUpAlert) {
                window.showLevelUpAlert("XUNG TRẬN! ⚔️", `Con đã chấp nhận lời thách đấu từ ${currentInvitingBot.name.replace(' (Bot)', '')}. Hãy vào Đấu Trường để xem chi tiết nhé!`, "success");
            }
        }
    } catch (err) {
        console.error('[ArenaEngine] acceptBotChallenge error:', err);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalContent;
        }
    }
}

// Global Export
window.ArenaEngine = {
    scheduleNextBotChallenge,
    checkForBotChallenge,
    openInvitation: openGlobalBotInvitation,
    closeInvitation: closeGlobalBotInvitation,
    acceptChallenge: acceptGlobalBotChallenge
};

// Auto start - robust initialization
let engineStarted = false;
let subscribed = false;

function initEngine() {
    if (engineStarted) return false;

    const hasAppState = !!window.AppState;
    const hasData = hasAppState && !!window.AppState.data;
    const hasUser = hasData && !!window.AppState.data.user;
    const hasUserId = hasUser && !!window.AppState.data.user.id;
    const isChild = hasUserId && window.AppState.data.user.role === 'child';

    if (!isChild) {
        if (hasUserId && !isChild) {
            console.log("[ArenaEngine] ⏭️ Not a child user:", window.AppState.data.user.role);
        }
        return false;
    }

    engineStarted = true;
    console.log("[ArenaEngine] 🚀 Engine STARTED for:", window.AppState.data.user.name);

    // Check passive count
    const passiveCount = window.AppState.getDailyChallengeCount(window.AppState.data.user.id, 'passive');
    console.log("[ArenaEngine] 📊 Passive challenges today:", passiveCount, "/ 3");

    scheduleNextBotChallenge();
    return true;
}

// Try subscribing to state changes
function trySubscribe() {
    if (subscribed) return;
    if (window.AppState && typeof window.AppState.subscribe === 'function') {
        subscribed = true;
        window.AppState.subscribe(() => {
            if (!engineStarted) initEngine();
        });
        console.log("[ArenaEngine] 📡 Subscribed to AppState");
    }
}

// Aggressive polling - every 2s for up to 2 minutes
let pollCount = 0;

function pollInit() {
    if (engineStarted) return;
    pollCount++;

    trySubscribe();
    const started = initEngine();

    if (!started && pollCount < 60) {
        setTimeout(pollInit, 2000);
    } else if (!started) {
        console.warn("[ArenaEngine] ⚠️ Gave up after 2 minutes. AppState ready:", !!window.AppState,
            "User:", window.AppState?.data?.user?.name || 'none');
    }
}

// Start immediately
pollInit();

// Also try on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pollInit);
}

// And on window load as final fallback
window.addEventListener('load', () => {
    if (!engineStarted) {
        console.log("[ArenaEngine] 🔄 Window load - retrying init...");
        trySubscribe();
        initEngine();
        if (!engineStarted) pollInit();
    }
});

// Helper globals
window.acceptGlobalBotChallenge = acceptGlobalBotChallenge;
window.closeGlobalBotInvitation = closeGlobalBotInvitation;
window.openGlobalBotInvitation = openGlobalBotInvitation;
