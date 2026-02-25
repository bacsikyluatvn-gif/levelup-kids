const fs = require('fs');

const stateFile = '/Users/admin/Downloads/00. Tai Lieu/Project Antigravity/family-quest/shared/js/state.js';
let stateContent = fs.readFileSync(stateFile, 'utf8');

// We will inject logic inside `syncFromDatabase()` after `const profiles = profRes.data || [];`
const injectionTarget = "const profiles = profRes.data || [];";
const injectedLogic = `
        const profiles = profRes.data || [];

        // --- BOT SYSTEM INJECTION ---
        const botProfiles = profiles.filter(p => p.role === 'bot');
        const humanChildren = profiles.filter(p => p.role === 'child');
        
        if (botProfiles.length === 0 && this.familyId && !this._isGeneratingBots) {
            this._isGeneratingBots = true;
            const botNames = ['Bảo', 'Vy', 'Long', 'Trang', 'Phúc', 'Việt', 'Mai', 'Linh', 'Quân', 'Châu', 'Tâm', 'Hải', 'Chi', 'Đạt', 'An', 'Bình', 'Ngọc', 'Sơn', 'Quang', 'Hà'];
            const botsToInsert = botNames.map((name, i) => {
                const lvl = Math.floor(Math.random() * 3) + 1;
                return {
                    family_id: this.familyId,
                    name: \`\${name} (Bot)\`,
                    role: 'bot',
                    avatar: \`../shared/assets/generated_avatars/avatar_\${Math.floor(Math.random() * 14) + 1}.png\`,
                    level: lvl,
                    xp: Math.floor(Math.random() * 50),
                    weekly_xp: Math.floor(Math.random() * 50) + 10,
                    weekly_streak: Math.floor(Math.random() * 3),
                    completion_streak: Math.floor(Math.random() * 5)
                };
            });
            this.client.from('profiles').insert(botsToInsert).then(() => {
                console.log("20 Bots created!");
            });
        } else if (botProfiles.length > 0 && !this._didSimulateBotsToday) {
            this._didSimulateBotsToday = true; // Only simulate once per frontend session load
            
            setTimeout(() => {
                try {
                    let highestHumanLvl = 1;
                    let highestHumanXp = 0;
                    if (humanChildren.length > 0) {
                        highestHumanLvl = Math.max(...humanChildren.map(c => c.level || 1));
                        highestHumanXp = Math.max(...humanChildren.map(c => c.xp || 0));
                    }
                    
                    // Pick 1-3 random bots to grant tiny XP
                    const numBotsToUpdate = Math.floor(Math.random() * 3) + 1;
                    
                    for(let i = 0; i < numBotsToUpdate; i++) {
                        const luckyBot = botProfiles[Math.floor(Math.random() * botProfiles.length)];
                        // Make sure bot is not outscaling the child too far (max level diff: 1)
                        if (luckyBot.level > highestHumanLvl + 1) continue;
                        
                        const xpGain = Math.floor(Math.random() * 15) + 5;
                        let newXp = luckyBot.xp + xpGain;
                        let newLvl = luckyBot.level || 1;
                        const limitXp = Math.floor(100 * Math.pow(newLvl, 1.5));
                        
                        if (newXp >= limitXp) {
                            newLvl++;
                            newXp = newXp - limitXp;
                        }
                        
                        this.client.from('profiles').update({
                            xp: newXp,
                            level: newLvl,
                            weekly_xp: (luckyBot.weekly_xp || 0) + xpGain
                        }).eq('id', luckyBot.id).then();
                    }
                } catch(e) {}
            }, 3000);
        }
        // --- END BOT SYSTEM INJECTION ---
`;

if (stateContent.includes("--- BOT SYSTEM INJECTION ---")) {
   console.log("Already injected!");
} else {
   stateContent = stateContent.replace(injectionTarget, injectedLogic);
   fs.writeFileSync(stateFile, stateContent, 'utf8');
   console.log("Injected Successfully!");
}
