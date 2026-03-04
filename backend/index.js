require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const pagesRoute = require('./routes/pages');
const aiRoute = require('./routes/ai');
const generateBackendRoute = require('./routes/generateBackend');

app.use('/api/pages', pagesRoute);
app.use('/api/ai', aiRoute);
app.use('/api/builder', generateBackendRoute);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/webgenie', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
