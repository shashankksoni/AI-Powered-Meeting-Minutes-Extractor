require("dotenv").config();
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  vertexai: false  // since we use API key instead of ADC
});

module.exports = async (req, res) => {
  try {
    let meetingText = req.file
      ? fs.readFileSync(req.file.path, "utf-8")
      : req.body.text || "";

    if (!meetingText.trim()) {
      return res.status(400).json({ error: "No input provided." });
    }

    const promptStruct = {
      contents: [
        {
          parts: [
            {
              text: `
From the meeting notes, produce:
1. A 2–3 sentence summary
2. List of decisions
3. JSON array of actionItems (task, owner optional, due optional)

Return ONLY JSON: {"summary":...,"decisions":[...],"actionItems":[...]}
            
Meeting Notes:
${meetingText}
`
            }
          ]
        }
      ]
    };

    const model = ai.models.generateContent;
    const completion = await model({
      model: "gemini-2.5-flash",
      ...promptStruct
    });

    const reply = completion.candidates[0].content.parts[0].text;

    let result;
    try {
      result = JSON.parse(reply);
    } catch {
      return res.status(500).json({ error: "Invalid JSON", raw: reply });
    }

    res.json(result);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: err.message });
  }
};
