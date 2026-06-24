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
  
  // Create a loan object with an ID
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

app.post('/api/telegram/send-auth', (req, res) => {
  console.log('📱 Telegram:', req.body);
  res.json({ success: true, message: 'Authorization sent' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TelecelLoans Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled`);
});
