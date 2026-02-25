const fs = require('fs');

const stateFile = '/Users/admin/Downloads/00. Tai Lieu/Project Antigravity/family-quest/shared/js/state.js';
let stateContent = fs.readFileSync(stateFile, 'utf8');

// Update bot names generator
const targetNamesOld = "const botNames = ['Bảo', 'Vy', 'Long', 'Trang', 'Phúc', 'Việt', 'Mai', 'Linh', 'Quân', 'Châu', 'Tâm', 'Hải', 'Chi', 'Đạt', 'An', 'Bình', 'Ngọc', 'Sơn', 'Quang', 'Hà'];";
const targetNamesNew = "const botNames = ['Bảo (Báo Thù)', 'Tiểu Vy', 'Nhóc Long', 'Chị Trang', 'Bé Phúc', 'Việt (Boss)', 'Mai Mai', 'Linh Mít', 'Đại Quân', 'Bé Châu', 'Tâm Tít', 'Hải Dớ', 'Chíp', 'Đạt Cỏ', 'Bé An', 'Bình Gold', 'Bé Ngọc', 'Sơn Sói', 'Quang Teo', 'Hà Múm'];";

stateContent = stateContent.replace(targetNamesOld, targetNamesNew);

// Make sure that EVERY bot gets updated rather than 80-100%, 
const oldUpdateLogic = "const numBotsToUpdate = Math.floor(botProfiles.length * (0.8 + Math.random() * 0.2));";
const newUpdateLogic = "const numBotsToUpdate = botProfiles.length; // Tất cả Bot đều hoạt động";

stateContent = stateContent.replace(oldUpdateLogic, newUpdateLogic);

fs.writeFileSync(stateFile, stateContent, 'utf8');
console.log("Updated bot names and XP chance globally!");

