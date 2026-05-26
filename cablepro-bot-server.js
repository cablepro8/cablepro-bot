// ===================================================
// 🤖 CablePro WhatsApp Bot - Green API
// ===================================================
// הוראות התקנה במדריך הנפרד
// ===================================================

const express = require('express');
const app = express();
app.use(express.json());

// ──────────── הגדרות Green API ────────────
// 👇 תחליף את הערכים האלה בערכים שלך מ-Green API
const ID_INSTANCE = '7107632157';
const API_TOKEN   = '97af2100fe654e9cb6f9f8674cf0ec36f8fcd5a743914f9381';
const API_URL     = `https://api.green-api.com/waInstance${ID_INSTANCE}`;

// ──────────── שירותים ────────────
const SERVICES = [
  { id: '1', emoji: '🔌', name: 'פריסת כבלי רשת וסיבים אופטיים' },
  { id: '2', emoji: '🗄️', name: 'סידור ארונות תקשורת' },
  { id: '3', emoji: '🔗', name: 'התקנת נקודות רשת בחדרים' },
  { id: '4', emoji: '📶', name: 'התקנת מגדילי טווח איכותיים' },
  { id: '5', emoji: '🔍', name: 'בדיקת תשתית קיימת' },
  { id: '6', emoji: '📹', name: 'התקנת מצלמות אבטחה' },
  { id: '7', emoji: '✍️', name: 'שירות אחר' },
];

// ──────────── שאלות לכל שירות ────────────
const QUESTIONS = {
  '1': [
    { key: 'location',      text: 'מה הכתובת להתקנה? 📍' },
    { key: 'points',        text: 'כמה נקודות רשת צריך?' },
    { key: 'building_type', text: 'מה סוג המבנה? (דירה / בית פרטי / משרד)' },
    { key: 'cable_type',    text: 'יש לך העדפה לסוג כבל? (Cat6 / Cat7 / סיבים אופטיים / לא בטוח)' },
    { key: 'phone',         text: 'מה מספר הטלפון ליצירת קשר? 📞' },
    { key: 'name',          text: 'מה השם שלך? 👤' },
  ],
  '2': [
    { key: 'location',      text: 'מה הכתובת? 📍' },
    { key: 'current_state', text: 'תאר בקצרה את מצב ארון התקשורת (כמה כבלים בערך, האם יש סוויצ׳ים?)' },
    { key: 'building_type', text: 'מה סוג המבנה? (דירה / בית פרטי / משרד / בניין)' },
    { key: 'phone',         text: 'מה מספר הטלפון ליצירת קשר? 📞' },
    { key: 'name',          text: 'מה השם שלך? 👤' },
  ],
  '3': [
    { key: 'location',      text: 'מה הכתובת להתקנה? 📍' },
    { key: 'rooms',         text: 'באילו חדרים צריך נקודות רשת? (סלון, חדר שינה, משרד...)' },
    { key: 'points',        text: 'כמה נקודות רשת בסה"כ?' },
    { key: 'building_type', text: 'מה סוג המבנה? (דירה / בית פרטי / משרד)' },
    { key: 'phone',         text: 'מה מספר הטלפון ליצירת קשר? 📞' },
    { key: 'name',          text: 'מה השם שלך? 👤' },
  ],
  '4': [
    { key: 'location', text: 'מה הכתובת? 📍' },
    { key: 'size',     text: 'מה גודל השטח בערך? (מ"ר)' },
    { key: 'floors',   text: 'כמה קומות / חדרים יש?' },
    { key: 'phone',    text: 'מה מספר הטלפון ליצירת קשר? 📞' },
    { key: 'name',     text: 'מה השם שלך? 👤' },
  ],
  '5': [
    { key: 'location',      text: 'מה הכתובת לבדיקה? 📍' },
    { key: 'issue',         text: 'מה הבעיה שאתה חווה? (אינטרנט איטי, ניתוקים, שקעים לא עובדים...)' },
    { key: 'building_type', text: 'מה סוג המבנה? (דירה / בית פרטי / משרד)' },
    { key: 'phone',         text: 'מה מספר הטלפון ליצירת קשר? 📞' },
    { key: 'name',          text: 'מה השם שלך? 👤' },
  ],
  '6': [
    { key: 'location',    text: 'מה הכתובת להתקנה? 📍' },
    { key: 'cameras',     text: 'כמה מצלמות אתה צריך?' },
    { key: 'area',        text: 'פנים / חוץ / שניהם?' },
    { key: 'camera_type', text: 'יש לך העדפה? (אלחוטיות / חוטיות / לא בטוח)' },
    { key: 'phone',       text: 'מה מספר הטלפון ליצירת קשר? 📞' },
    { key: 'name',        text: 'מה השם שלך? 👤' },
  ],
  '7': [
    { key: 'description', text: 'תאר בבקשה את השירות שאתה צריך 📝' },
    { key: 'location',    text: 'מה הכתובת? 📍' },
    { key: 'phone',       text: 'מה מספר הטלפון ליצירת קשר? 📞' },
    { key: 'name',        text: 'מה השם שלך? 👤' },
  ],
};

// ──────────── תוויות לסיכום ────────────
const LABELS = {
  location: '📍 כתובת',
  points: '🔌 נקודות רשת',
  building_type: '🏠 סוג מבנה',
  phone: '📞 טלפון',
  name: '👤 שם',
  size: '📏 גודל שטח',
  floors: '🏗️ קומות/חדרים',
  current_state: '🗄️ מצב ארון תקשורת',
  cameras: '📹 כמות מצלמות',
  area: '🏗️ פנים/חוץ',
  camera_type: '📷 סוג מצלמות',
  cable_type: '🔌 סוג כבל',
  description: '📝 תיאור',
  rooms: '🚪 חדרים',
  issue: '⚠️ בעיה',
};

// ──────────── ניהול שיחות ────────────
// שומר את המצב של כל שיחה לפי מספר טלפון
const sessions = {};

function getSession(chatId) {
  if (!sessions[chatId]) {
    sessions[chatId] = { phase: 'greeting', service: null, questionIndex: 0, answers: {} };
  }
  return sessions[chatId];
}

function resetSession(chatId) {
  sessions[chatId] = { phase: 'greeting', service: null, questionIndex: 0, answers: {} };
}

// ──────────── שליחת הודעה ────────────
async function sendMessage(chatId, text) {
  try {
    const response = await fetch(`${API_URL}/sendMessage/${API_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message: text }),
    });
    const data = await response.json();
    console.log('📤 נשלח ל:', chatId);
    return data;
  } catch (err) {
    console.error('❌ שגיאה בשליחה:', err.message);
  }
}

// ──────────── הודעת פתיחה ────────────
function getGreeting() {
  let msg = `שלום! 👋\nברוכים הבאים ל-*CablePro - מומחים בכבלים*\n\n`;
  msg += `אנחנו מתמחים בפריסת רשתות כבלים, התקנת מצלמות אבטחה, סידור ארונות תקשורת ועוד.\n\n`;
  msg += `איך נוכל לעזור לך? *שלח מספר* לבחירת שירות:\n\n`;
  SERVICES.forEach(s => {
    msg += `*${s.id}.* ${s.emoji} ${s.name}\n`;
  });
  return msg;
}

// ──────────── טיפול בהודעה נכנסת ────────────
async function handleMessage(chatId, text) {
  const session = getSession(chatId);
  const input = text.trim();

  // פקודת אתחול
  if (input === '0' || input === 'תפריט' || input === 'menu') {
    resetSession(chatId);
    await sendMessage(chatId, getGreeting());
    return;
  }

  // ──── שלב 1: הודעת פתיחה ────
  if (session.phase === 'greeting') {
    // בדיקה אם הלקוח שלח מספר שירות
    const serviceId = input.replace(/[^1-7]/g, '');
    const service = SERVICES.find(s => s.id === serviceId);

    if (service) {
      session.service = serviceId;
      session.phase = 'questions';
      session.questionIndex = 0;
      session.answers = {};

      const questions = QUESTIONS[serviceId];
      let msg = `בחרת: *${service.name}* ✅\n\n`;
      msg += `מעולה! כדי שנוכל לחזור אליך עם הצעת מחיר, אני צריך כמה פרטים.\n\n`;
      msg += questions[0].text;
      await sendMessage(chatId, msg);
    } else {
      // שלח את התפריט
      await sendMessage(chatId, getGreeting());
    }
    return;
  }

  // ──── שלב 2: שאלות ────
  if (session.phase === 'questions') {
    const questions = QUESTIONS[session.service];
    const currentQ = questions[session.questionIndex];

    // שמירת תשובה
    session.answers[currentQ.key] = input;
    session.questionIndex++;

    // עוד שאלות?
    if (session.questionIndex < questions.length) {
      await sendMessage(chatId, questions[session.questionIndex].text);
    } else {
      // ──── שלב 3: סיום ────
      session.phase = 'done';
      const name = session.answers.name || 'לקוח/ה יקר/ה';
      const serviceName = SERVICES.find(s => s.id === session.service)?.name || '';

      // הודעת סיום
      let closing = `תודה רבה ${name}! 🙏\n\n`;
      closing += `קיבלנו את כל הפרטים שלך.\n`;
      closing += `נחזור אליך בהקדם האפשרי עם הצעת מחיר.\n\n`;
      closing += `📞 דחוף? אפשר להתקשר ישירות: 054-9811154\n\n`;
      closing += `צוות *CablePro - מומחים בכבלים* 💪`;
      await sendMessage(chatId, closing);

      // סיכום
      let summary = `📋 *סיכום הפניה:*\n\n🔧 שירות: ${serviceName}\n`;
      for (const [key, val] of Object.entries(session.answers)) {
        summary += `${LABELS[key] || key}: ${val}\n`;
      }
      summary += `\n✅ _הפניה נשלחה לצוות CablePro ונחזור אליכם בהקדם האפשרי_`;
      await sendMessage(chatId, summary);

      // 👇 כאן אפשר להוסיף שליחת הסיכום אליך (לבעל העסק)
      // await sendMessage('972549811154@c.us', `📩 פניה חדשה!\n\n${summary}`);

      // אתחול לשיחה הבאה
      resetSession(chatId);
    }
    return;
  }

  // אם השיחה הסתיימה והלקוח שלח עוד הודעה
  if (session.phase === 'done') {
    resetSession(chatId);
    await sendMessage(chatId, getGreeting());
  }
}

// ──────────── Webhook - קבלת הודעות ────────────
app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    // רק הודעות נכנסות
    if (body.typeWebhook === 'incomingMessageReceived') {
      const chatId = body.senderData?.chatId;
      const msgType = body.messageData?.typeMessage;

      // רק הודעות טקסט
      if (msgType === 'textMessage' && chatId) {
        const text = body.messageData.textMessageData.textMessage;
        console.log(`📩 הודעה מ-${chatId}: ${text}`);
        await handleMessage(chatId, text);
      } else if (chatId) {
        // הודעה שהיא לא טקסט
        await sendMessage(chatId, 'סליחה, אני יכול לקבל רק הודעות טקסט כרגע 😊\nשלח מספר כדי לבחור שירות.');
      }
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('❌ שגיאה:', err.message);
    res.status(500).send('Error');
  }
});

// ──────────── בדיקת חיים ────────────
app.get('/', (req, res) => {
  res.send('🤖 CablePro Bot is running!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', sessions: Object.keys(sessions).length });
});

// ──────────── הפעלה ────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 CablePro Bot running on port ${PORT}`);
  console.log(`📡 Webhook URL: https://YOUR-APP.onrender.com/webhook`);
});
