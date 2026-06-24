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
  res.json({ success: true, message: 'User registered!' });
});

app.post('/api/auth/login', (req, res) => {
  console.log('🔑 Login:', req.body);
  res.json({ success: true, message: 'User logged in!' });
});

app.post('/api/loans/apply', (req, res) => {
  console.log('💰 Loan:', req.body);
  res.json({ success: true, message: 'Loan applied!' });
});

app.post('/api/telegram/send-auth', (req, res) => {
  console.log('📱 Telegram:', req.body);
  res.json({ success: true, message: 'Authorization sent' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TelecelLoans Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled`);
});
