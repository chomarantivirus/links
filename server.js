const express = require('express');
const { sendMail } = require('./email.service');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist', 'c-prot-links', 'browser')));


// Assets klasörünü ayrıca servis et
app.use('/assets', express.static(path.join(__dirname, 'dist', 'c-prot-links', 'browser', 'assets')));

// Favicon'u doğrudan sun
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'c-prot-links', 'browser', 'assets', 'favicon.ico'));
});

// Tüm yönlendirmeleri Angular'ın index.html dosyasına yönlendir
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'c-prot-links', 'browser', 'index.html'));
});

app.post('/send-email', async (req, res) => {
  const { to, subject, htmlContent } = req.body;

  const result = await sendMail(to, subject, htmlContent);
  if (result.success) {
    res.status(200).send({ message: 'Mail başarıyla gönderildi', messageId: result.messageId });
  } else {
    res.status(500).send({ error: 'Mail gönderilemedi', details: result.error });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});
