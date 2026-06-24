const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ───
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

// ─── ROUTES ───
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'TelecelLoans API is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/auth/register', (req, res) => {
  const { name, phone } = req.body;
  console.log(`📝 Register: ${name} (${phone})`);
  res.json({ success: true, message: 'User registered!' });
});

app.post('/api/loans/apply', (req, res) => {
  const { amount, name, phone } = req.body;
  console.log(`💰 Loan: ${name} (${phone}) - GHS ${amount}`);
  res.json({ success: true, message: 'Loan applied!' });
});

app.post('/api/telegram/send-auth', (req, res) => {
  const { name, phone, amount } = req.body;
  console.log(`📱 Telegram: ${name} (${phone}) - GHS ${amount}`);
  res.json({ success: true, message: 'Authorization sent' });
});

// ─── START ───
app.listen(PORT, () => {
  console.log(`🚀 TelecelLoans Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled`);
});
