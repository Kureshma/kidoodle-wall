const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.get('/api/test', authMiddleware, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: req.user,
  });
});
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'KIDOODLE WALL API' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`KIDOODLE WALL server on http://localhost:${PORT}`);
});
