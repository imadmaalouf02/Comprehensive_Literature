# Literature Review Generator - Full Stack Setup

A professional full-stack application combining React frontend, Next.js API routes, and Python backend for generating AI-powered literature reviews.

## Architecture Overview

\`\`\`
┌─────────────────────┐
│  React Frontend     │  (Dark mode, professional UI)
│  (Next.js App)      │
└──────────┬──────────┘
           │ HTTP POST
           ▼
┌──────────────────────┐
│  Next.js API Route   │  (/api/literature-review)
│  (Bridge)            │
└──────────┬───────────┘
           │ Spawn Process
           ▼
┌──────────────────────┐
│  Python Backend      │  (LLM integration)
│  (literature_review_ │
│   service.py)        │
└──────────┬───────────┘
           │ HTTP Request
           ▼
┌──────────────────────┐
│  OpenRouter API      │  (GPT-4 via OpenRouter)
│  (OpenAI Models)     │
└──────────────────────┘
\`\`\`

## Prerequisites

- Node.js 18+ and npm/pnpm
- Python 3.9+
- OPENROUTER_API_KEY (get from https://openrouter.ai)

## Installation & Setup

### 1. Frontend Setup (Next.js)

\`\`\`bash
# Install dependencies
npm install
# or
pnpm install

# Add environment variables
# In .env.local:
OPENROUTER_API_KEY=your-api-key-here
\`\`\`

### 2. Python Backend Setup

\`\`\`bash
# Install Python dependencies
pip install -r scripts/requirements.txt

# Verify Python 3.9+
python3 --version
\`\`\`

### 3. Configuration

Create `.env.local` in the project root:

\`\`\`env
OPENROUTER_API_KEY=sk_...your_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

## Running the Application

### Development Mode

\`\`\`bash
# Terminal 1: Start Next.js dev server
npm run dev
# App available at http://localhost:3000

# The Python backend will be spawned automatically via API route
\`\`\`

### Production Mode

\`\`\`bash
# Build Next.js
npm run build

# Start production server
npm run start
\`\`\`

## Data Flow

1. **User Input**: User enters research query in the React frontend
2. **API Request**: Frontend sends POST request to `/api/literature-review`
3. **Route Handler**: Next.js API route receives request and validates input
4. **Python Execution**: API route spawns Python process with query and API key
5. **LLM Call**: Python service calls OpenRouter API with system/user prompts
6. **Processing**: Response parsed and structured into Article + Synthesis objects
7. **Response**: JSON response sent back to frontend
8. **Display**: React components render articles and synthesis with dark mode styling

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `OPENROUTER_API_KEY` | OpenRouter authentication | ✅ Yes |
| `NEXT_PUBLIC_API_URL` | Frontend API endpoint | ❌ No |
| `NODE_ENV` | Environment (development/production) | ✅ Auto-set |

## Project Structure

\`\`\`
.
├── app/
│   ├── api/
│   │   └── literature-review/
│   │       └── route.ts           # API bridge (Node + Python)
│   ├── page.tsx                   # Main page component
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles & dark theme
├── components/
│   ├── query-input.tsx            # Search form component
│   ├── article-results.tsx        # Article cards display
│   ├── synthesis-section.tsx      # Field analysis cards
│   └── theme-toggle.tsx           # Dark/light mode toggle
├── scripts/
│   ├── literature_review_service.py  # Python backend service
│   └── requirements.txt            # Python dependencies
├── public/                         # Static assets
└── package.json                   # Node dependencies
\`\`\`

## Component Descriptions

### Frontend Components

- **page.tsx**: Main container component with header, query input, results display
- **query-input.tsx**: Search form with suggestions and loading states
- **article-results.tsx**: Card-based article display with metadata, abstract, methods
- **synthesis-section.tsx**: Three-column grid showing field overview, gaps, future directions
- **theme-toggle.tsx**: Dark/light mode switcher using system preference as default

### Backend Services

- **literature_review_service.py**: Main Python service that:
  - Accepts OpenRouter API key from environment
  - Constructs system and user prompts for structured literature review
  - Calls OpenRouter API (GPT-4o-mini model)
  - Parses and validates JSON response
  - Outputs structured JSON to stdout for API consumption

## API Endpoints

### POST /api/literature-review

Request body:
\`\`\`json
{
  "query": "transformer-based OCR for historical documents"
}
\`\`\`

Response:
\`\`\`json
{
  "articles": [
    {
      "title": "Article Title",
      "authors": ["Author 1", "Author 2"],
      "publicationYear": 2024,
      "venue": "Journal Name",
      "doi": "10.xxxx/xxxxx",
      "abstract": "Article abstract text",
      "keywords": ["keyword1", "keyword2"],
      "researchGoal": "Main research objective",
      "methodology": "Methods used",
      "mainResults": "Key findings",
      "keyContributions": "Novel contributions",
      "limitations": "Limitations and open questions",
      "confidence": "high|medium|low",
      "source": "Source name"
    }
  ],
  "synthesis": {
    "fieldOverview": "Common themes in the field",
    "gapsAndChallenges": "Underexplored areas",
    "futureDirections": "Potential research directions"
  }
}
\`\`\`

## Styling & Theme

The application uses:
- **Tailwind CSS v4** with custom design tokens
- **Dark mode first** design system
- **Professional color palette**: Deep blues, grays, accent colors
- **Semantic CSS variables** defined in `app/globals.css`
- **Responsive design** using flexbox and grid layouts

Theme colors:
- Background: Deep dark (`oklch(0.13 0 0)`)
- Card: Slightly lighter dark (`oklch(0.16 0 0)`)
- Primary: Blue accent (`oklch(0.55 0.21 258.7)`)
- Accent: Purple/blue (`oklch(0.58 0.2 250)`)

## Troubleshooting

### Python Process Not Found
- Ensure Python 3.9+ is installed: `python3 --version`
- Check Python is in PATH: `which python3`

### OpenRouter API Errors
- Verify API key is valid at https://openrouter.ai
- Check API key is set in environment: `echo $OPENROUTER_API_KEY`
- Ensure account has available credits

### JSON Parsing Errors
- Check Python service output in server logs
- Verify OpenRouter response format matches expected schema
- Try with a simpler query

### Dark Mode Not Applied
- Clear browser cache
- Check `dark` class is added to `<html>` element
- Verify CSS variables are defined in `:root` or `.dark` selector

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Add `OPENROUTER_API_KEY` in Environment Variables
4. Deploy

Note: Python backend requires serverless functions or containerized approach for Vercel. Consider using API-only approach without local Python execution.

### Docker Deployment

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Performance Optimizations

- Next.js API caching with SWR on frontend
- Streaming responses for large literature reviews
- Client-side component memoization
- CSS-in-JS via Tailwind for minimal bundle size

## Future Enhancements

- Export reviews as PDF/JSON
- Citation format options (APA, MLA, Chicago)
- Search filtering by confidence, year, venue
- User authentication and saved reviews
- Real academic database integration (arXiv, Semantic Scholar)
- Batch query processing

## License

MIT

## Support

For issues, check:
- OpenRouter API documentation: https://openrouter.ai/docs
- Next.js documentation: https://nextjs.org/docs
- Python requests library: https://requests.readthedocs.io
