// ===================================================
// 🤖 CablePro WhatsApp Bot - Green API + Poll Buttons
// ===================================================

const express = require('express');
const app = express();
app.use(express.json());

// ──────────── הגדרות Green API ────────────
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

// ──────────── שליחת הודעת טקסט ────────────
async function sendMessage(chatId, text) {
  try {
    const response = await fetch(`${API_URL}/sendMessage/${API_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message: text }),
    });
    const data = await response.json();
    console.log('📤 טקסט נשלח ל:', chatId);
    return data;
  } catch (err) {
    console.error('❌ שגיאה בשליחת טקסט:', err.message);
  }
}

// ──────────── שליחת סקר (כפתורי בחירה) ────────────
async function sendPoll(chatId, message, options, multipleAnswers = false) {
  try {
    const response = await fetch(`${API_URL}/sendPoll/${API_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId,
        message,
        options: options.map(o => ({ optionName: o })),
        multipleAnswers,
      }),
    });
    const data = await response.json();
    console.log('📊 סקר נשלח ל:', chatId);
    return data;
  } catch (err) {
    console.error('❌ שגיאה בשליחת סקר:', err.message);
  }
}

// ──────────── שליחת תפריט שירותים כסקר ────────────
async function sendServiceMenu(chatId) {
  const options = SERVICES.map(s => `${s.emoji} ${s.name}`);
  await sendMessage(chatId, `שלום! 👋\nברוכים הבאים ל-*CablePro - מומחים בכבלים*\n\nאנחנו מתמחים בפריסת רשתות כבלים, התקנת מצלמות אבטחה, סידור ארונות תקשורת ועוד.\n\nבחר שירות מהרשימה למטה 👇`);

  // שולח סקר עם כל השירותים
  await sendPoll(chatId, '🔧 באיזה שירות אתה מעוניין?', options);
}

// ──────────── זיהוי שירות מתוך תשובת סקר ────────────
function findServiceFromPollAnswer(answer) {
  for (const service of SERVICES) {
    if (answer.includes(service.name) || answer.includes(service.emoji)) {
      return service;
    }
  }
  // fallback - חיפוש לפי מספר
  const num = answer.replace(/[^1-7]/g, '');
  return SERVICES.find(s => s.id === num) || null;
}

// ──────────── מילות הפעלה ────────────
const TRIGGER_WORDS = ['שלום', 'היי', 'הי', 'תפריט', 'menu', 'שירות', 'שירותים', 'מחירון', 'בוקר טוב', 'ערב טוב', 'הזמנה', 'start', 'hello', 'hi', '0'];

function isTriggerWord(text) {
  const lower = text.toLowerCase().trim();
  return TRIGGER_WORDS.some(w => lower === w || lower.includes(w));
}

// ──────────── טיפול בהודעה נכנסת ────────────
async function handleMessage(chatId, text, msgType) {
  const session = getSession(chatId);
  const input = text.trim();

  // פקודת אתחול
  if (input === '0' || input === 'תפריט' || input === 'menu') {
    resetSession(chatId);
    await sendServiceMenu(chatId);
    return;
  }

  // ──── שלב 1: הודעת פתיחה ────
  if (session.phase === 'greeting') {
    // בדיקה אם הלקוח בחר שירות מהסקר
    const service = findServiceFromPollAnswer(input);

    if (service) {
      session.service = service.id;
      session.phase = 'questions';
      session.questionIndex = 0;
      session.answers = {};

      const questions = QUESTIONS[service.id];
      let msg = `בחרת: *${service.name}* ✅\n\n`;
      msg += `מעולה! כדי שנוכל לחזור אליך עם הצעת מחיר, אני צריך כמה פרטים.\n\n`;
      msg += questions[0].text;
      await sendMessage(chatId, msg);
    } else if (isTriggerWord(input)) {
      // רק אם הלקוח שלח מילת הפעלה - שלח תפריט
      await sendServiceMenu(chatId);
    }
    // אם זו הודעה רגילה בלי מילת הפעלה - הבוט לא מגיב (שיחה רגילה)
    return;
  }

  // ──── שלב 2: שאלות ────
  if (session.phase === 'questions') {
    const questions = QUESTIONS[session.service];
    const currentQ = questions[session.questionIndex];

    session.answers[currentQ.key] = input;
    session.questionIndex++;

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

      // 👇 הפעל את השורה הזו כדי לקבל כל פניה ישירות לוואטסאפ שלך
      // await sendMessage('972549811154@c.us', `📩 פניה חדשה!\n\n${summary}`);

      resetSession(chatId);
    }
    return;
  }

  // אם השיחה הסתיימה והלקוח שלח עוד הודעה
  if (session.phase === 'done') {
    if (isTriggerWord(input)) {
      resetSession(chatId);
      await sendServiceMenu(chatId);
    }
    // אחרת - לא מגיב, זו שיחה רגילה ביניכם
  }
}

// ──────────── Webhook ────────────
app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    if (body.typeWebhook === 'incomingMessageReceived') {
      const chatId = body.senderData?.chatId;
      const msgType = body.messageData?.typeMessage;

      // הודעת טקסט רגילה
      if (msgType === 'textMessage' && chatId) {
        const text = body.messageData.textMessageData.textMessage;
        console.log(`📩 הודעה מ-${chatId}: ${text}`);
        await handleMessage(chatId, text, msgType);
      }
      // תשובה לסקר (לחיצה על כפתור)
      else if (msgType === 'pollUpdateMessage' && chatId) {
        const pollData = body.messageData.pollMessageData;
        if (pollData && pollData.votes) {
          // מוצא את האפשרות שנבחרה
          const selectedOption = pollData.votes.find(v => v.optionVoters && v.optionVoters.length > 0);
          if (selectedOption) {
            console.log(`📊 בחירה בסקר מ-${chatId}: ${selectedOption.optionName}`);
            await handleMessage(chatId, selectedOption.optionName, 'pollUpdate');
          }
        }
      }
      // הודעה שהיא לא טקסט ולא סקר
      else if (chatId && msgType !== 'pollUpdateMessage') {
        await sendMessage(chatId, 'סליחה, אני יכול לקבל רק הודעות טקסט כרגע 😊\nשלח "תפריט" כדי להתחיל.');
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
});
