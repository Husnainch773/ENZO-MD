const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK0owb2ZsYmw0cFdIRm5WSXZQT0ZtdzR5aVhaNktoNUV2VkRSdWN1NzNVaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSk90TWtpc2w4eVgyR0lMMWpUTXUvbXcvQVcxZlhPSFRiSGpDM2l5RVRnST0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIrRnlvVTE4YmdoN2NGOThxNE8zcmtmc1NqZW5aclJBdEV4RFBiNjF1MUdBPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIzYUdpVGQybGd0cXRmclFFUVJFL3hXVnZXanZsYlovRWh6QkkrS2c3b0J3PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImtOQXdyN002K2NvUUdqRXRXRjFJZ1M0Y1JwR002Ty9mdWxhcUs0aXROM1k9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjFTUjhMU0d1QUZDMnArUXFuT0FmbWhkL3NYZGhlWFJuQWF6VTNlWnRoelU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0NIZjBYSmJWR1NvSzhwcEdiVGRwL1JQRC9FQW1GcW9NeTE1OWlmSk9rUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS3lZcFNQSTNDa3FSczNTN3JDbE1vUTVpa0k3S1dUS0dFNXExd3VZVUZDYz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjRJVnRIK0NSazBsRzVHL0NKckU0WTZVMXJ5bnRKYy9hZmR3Q2M5NitHMm51dXg2TFdXTW5WSjgvWFN0ZVo4Q2tZQnovRDhwajU4ZEZoTFZIV2FRcUJ3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6OTYsImFkdlNlY3JldEtleSI6IjlxZUVxM003aXBaQzg3bWtDNUsyM0JwWng3b0o5QkZ1Qm12RXhVVm1aR1U9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6InNaNGQwOWJiUU9LSFpoc3gzQXdJd2ciLCJwaG9uZUlkIjoiOGY3NGNhZWYtNzVlZi00M2Q5LTk3MTUtZThmNzEzZjMxNWQzIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJlclUxVnpsMmZYdUVjaUNyKzV5cG1seC8rdz0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJoZUtSOG1FV2h2b2piYURhN0JZNzNac3UxNTQ9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiTkFBSFg2VFciLCJtZSI6eyJpZCI6Ijk3MTU1ODI4MzAzNjoyMEBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSTNJZ0tzREVQeUkrYmdHR0FVZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiZWJCK3M5bzN0RWdCK0hjcWN2bXNtUUg0UmlwbllQZlY2WWlwQmxhVDNSTT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiWDkvTU0xcFRGaXZ5S002a2tFbUYrVHFINk9MSTVWRkxOdVZXMUE1VEpyQW0rQkhQZVBxTzdURGU4OFVGTjRqYm1hZ09xNDg2emNnKzFjNVZCdWV3Qnc9PSIsImRldmljZVNpZ25hdHVyZSI6Ijk5RUZiUVRJRElWWE5ueENiNkFudzQ1dFBUL0tpSUhNR3ZCYUtneitNSVN0dDhYcVhpV2x6S1lDRFZyQUl0TDVWY1JMdGVCdy9UZ2EzclUxQktlSEFnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTcxNTU4MjgzMDM2OjIwQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlhtd2ZyUGFON1JJQWZoM0tuTDVySmtCK0VZcVoyRDMxZW1JcVFaV2s5MFQifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzAwMzY4NzMsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBQnJhIn0=',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Ibrahim Adams",
    NUMERO_OWNER : process.env.NUMERO_OWNER || " Ibrahim Adams",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'BMW_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/17c83719a1b40e02971e4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
