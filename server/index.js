// server/index.js
import OpenAI from "openai";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/message
app.post("/api/message", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", //  use a real model
      messages: [
        {
          role: "system",
          content:
            "You are XSanitaz, a culturally sensitive mental health assistant for young people. Be empathetic, respectful, and supportive.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err.message);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(` XSanitaz backend is running on http://localhost:${PORT}`);
});
