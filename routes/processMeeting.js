require("dotenv").config();
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Check if API key is provided
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is not set in environment variables");
  console.error("Please create a .env file with your Gemini API key");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

module.exports = async (req, res) => {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error:
          "Gemini API key not configured. Please set GEMINI_API_KEY in your .env file.",
      });
    }

    let meetingText = req.file
      ? fs.readFileSync(req.file.path, "utf-8")
      : req.body.text || "";

    if (!meetingText.trim()) {
      return res.status(400).json({
        error:
          "No input provided. Please provide meeting text or upload a file.",
      });
    }

    const prompt = `
From the meeting notes, produce:
1. A 2–3 sentence summary
2. List of decisions
3. JSON array of actionItems (task, owner optional, due optional)

Return ONLY the JSON object without any markdown formatting, code blocks, or additional text:
{"summary":...,"decisions":[...],"actionItems":[...]}

Meeting Notes:
${meetingText}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    let parsedResult;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanReply = reply.trim();
      if (cleanReply.startsWith("```json")) {
        cleanReply = cleanReply
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (cleanReply.startsWith("```")) {
        cleanReply = cleanReply.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      parsedResult = JSON.parse(cleanReply);
    } catch (parseError) {
      console.error("❌ Failed to parse AI response as JSON:", reply);
      return res.status(500).json({
        error: "AI response could not be parsed as JSON",
        raw: reply,
        parseError: parseError.message,
      });
    }

    res.json(parsedResult);
  } catch (err) {
    console.error("❌ Error processing meeting:", err);

    // Handle specific API errors
    if (err.message.includes("API key")) {
      return res.status(401).json({
        error:
          "Invalid or missing Gemini API key. Please check your .env file.",
      });
    }

    if (err.message.includes("quota")) {
      return res.status(429).json({
        error: "API quota exceeded. Please try again later.",
      });
    }

    res.status(500).json({ error: err.message });
  }
};
