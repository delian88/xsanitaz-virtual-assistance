import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { detectIntent } from './dialogflowClient.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/message', async (req, res) => {
  const { message, sessionId } = req.body;

  try {
    const response = await detectIntent(message, sessionId || 'default-session');
    res.json({ reply: response.fulfillmentText });
  } catch (err) {
    console.error('Dialogflow error:', err);
    res.status(500).json({ error: 'Failed to get response from Dialogflow' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
