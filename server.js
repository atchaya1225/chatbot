const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// Root route for testing
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});
