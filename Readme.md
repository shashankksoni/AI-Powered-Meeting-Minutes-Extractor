# AI-Powered Meeting Minutes Extractor

A Node.js backend service that extracts structured information from meeting notes using Google's Gemini AI. It automatically generates summaries, identifies decisions, and creates action items from raw meeting text.

## 🎯 Goal

Build a **Node.js backend** service that:

- Accepts meeting notes (via API)
- Calls an AI API (Gemini) to extract:
  1. A **2–3 sentence summary**
  2. A list of **key decisions**
  3. A structured list of **action items** with task, owner (optional), and deadline (optional)
- Returns the results in **clean JSON**

## 🛠️ Technical Requirements

| Area               | Requirement                                          | Status |
| ------------------ | ---------------------------------------------------- | ------ |
| **Language**       | JavaScript                                           | ✅     |
| **Framework**      | Express.js                                           | ✅     |
| **AI Integration** | Google Gemini API                                    | ✅     |
| **Endpoints**      | `POST /process-meeting`                              | ✅     |
| **Input Format**   | Raw text body or .txt file upload                    | ✅     |
| **Output Format**  | JSON with: `summary`, `decisions[]`, `actionItems[]` | ✅     |
| **Error Handling** | API timeouts, token issues, missing input            | ✅     |
| **Testing**        | 2 sample .txt files + curl examples                  | ✅     |

## 🚀 Setup Instructions

## Tech Stack

- Node.js
- Express.js
- Multer (for file upload)
- Google Generative AI (Gemini API)

### Installation

1. **Clone the repository**

  ```bash
  git clone https://github.com/shashankksoni/AI-Powered-Meeting-Minutes-Extractor.git
  cd AI-Powered-Meeting-Minutes-Extractor
 ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**
   Create a .env file in the root and add:

   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

5. **Get a Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

### Running the Application

```bash
npm start or
node index.js
```

The server will start at `http://localhost:3000`

## 📡 API Usage

### Health Check

```bash
GET /
```
Returns a simple status JSON.

### Process Meeting Notes

**Endpoint:** `POST /process-meeting`

**Methods:**

1. **File Upload** - Upload a .txt file
2. **Text Input** - Send meeting text in request body

#### Method 1: File Upload

```bash
curl -X POST http://localhost:3000/process-meeting \
  -F "file=@samples/sample1.txt"
```

#### Method 2: Raw Text in Request Body

```bash
curl -X POST http://localhost:3000/process-meeting \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Team Sync – May 26\n- We will launch the new product on June 10.\n- Ravi to prepare onboarding docs by June 5.\n- Priya will follow up with logistics team on packaging delay.\n- Beta users requested a mobile-first dashboard."
  }'
```

#### Method 3: Test via Postman

  URL: http://localhost:3000/process-meeting

  Method: POST

  Use either:

  form-data: key = file, value = .txt file

  raw: JSON body with "text": "..."


## 📊 Sample API Input

Using the exact example from requirements:

```
Team Sync – May 26

- We'll launch the new product on June 10.
- Ravi to prepare onboarding docs by June 5.
- Priya will follow up with logistics team on packaging delay.
- Beta users requested a mobile-first dashboard.
```

## ✅ Sample API Output

```json
{
  "summary": "The team confirmed the product launch on June 10, assigned onboarding preparation and logistics follow-up, and discussed user feedback on mobile design.",
  "decisions": [
    "Launch set for June 10",
    "Need mobile-first dashboard for beta users"
  ],
  "actionItems": [
    {
      "task": "Prepare onboarding docs",
      "owner": "Ravi",
      "due": "June 5"
    },
    {
      "task": "Follow up with logistics team",
      "owner": "Priya"
    }
  ]
}
```

## 📁 Sample Files

The project includes 2 sample `.txt` files in the `samples/` directory:

- `sample1.txt` - Product launch meeting
- `sample2.txt` - Weekly review meeting

## 🧪 Testing

### Test with Sample Files

```bash
# Test with sample1.txt
curl -X POST http://localhost:3000/process-meeting \
  -F "file=@samples/sample1.txt"

# Test with sample2.txt
curl -X POST http://localhost:3000/process-meeting \
  -F "file=@samples/sample2.txt"
```

### Test with Raw Text

```bash
curl -X POST http://localhost:3000/process-meeting \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Weekly Review – July 3\n- Client feedback on onboarding was positive.\n- Priya to revise onboarding slides by July 8.\n- Migration to new database planned for July 20."
  }'
```


## 📋 Project Structure

```
├── index.js              # Main server file
├── routes/
│   └── processMeeting.js # Meeting processing logic
├── samples/              # Sample meeting files
│   ├── sample1.txt
│   └── sample2.txt
├── uploads/              # Temporary file storage
├── package.json
├── .env
└── README.md
```


