const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080; // Railway uses 8080

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'TelecelLoans API is running!' });
});

app.post('/api/auth/register', (req, res) => {
  console.log('📝 Register:', req.body);
  res.json({ success: true });
});

app.post('/api/loans/apply', (req, res) => {
  console.log('💰 Loan:', req.body);
  res.json({ success: true });
});

app.post('/api/telegram/send-auth', (req, res) => {
  console.log('📱 Telegram:', req.body);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
