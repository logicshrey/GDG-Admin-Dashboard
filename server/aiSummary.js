const express = require('express');
const router = express.Router();
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Use environment variable for the API key in production!
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { formattedAttendance } = req.body;
    if (!formattedAttendance) {
      return res.status(400).json({ error: 'Missing attendance data' });
    }

    /*
    API Key Checklist:
    - Make sure your API key is from https://makersuite.google.com/app/apikey
    - It should be for the public Google Generative Language API (not Vertex AI)
    - If you still get 404, regenerate your key from Google AI Studio
    */
    const prompt = `Summarize the following attendance records as a formal report (max 2-3 lines):\n${formattedAttendance}`;
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const summary = result.response.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated.';
    res.json({ summary });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
});

module.exports = router;
