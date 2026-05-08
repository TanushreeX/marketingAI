import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let openai = null;

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'YOUR_OPENAI_KEY') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

app.get('/', (req, res) => {
  res.send('VyaparAI Backend Running');
});

app.post('/generate', async (req, res) => {

  try {

    const {
      businessName,
      industry,
      city,
      language
    } = req.body;

    // DEMO MODE
    if (!openai) {

      return res.json({
        success: true,
        content: `
Instagram Caption:
Grow your ${industry} business in ${city} with VyaparAI 🚀

WhatsApp Message:
Special offers now available for ${businessName}. Contact us today.

Google Business Post:
${businessName} is helping customers in ${city} with trusted ${industry} services.

Hashtags:
#Business #Marketing #India #Growth #AI #Startup #LocalBusiness
        `
      });

    }

    // OPENAI MODE
    const prompt = `
Generate marketing content for:

Business Name: ${businessName}
Industry: ${industry}
City: ${city}
Language: ${language}

Generate:
1 Instagram Caption
1 WhatsApp Promotion Message
1 Google Business Post
7 Hashtags
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    res.json({
      success: true,
      content: response.choices[0].message.content
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});