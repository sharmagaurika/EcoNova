# EcoNova

The galaxy’s competitive sustainability tracker.

> In the race to save the galaxy, your footprint is your speed. The lighter you are, the faster you go.

EcoNova turns carbon mass into a weekly sprint. GPS classifies how you move, Gemini (with an on-device fallback) parses receipts and bank lines, and friend circles race for the Supernova badge.

## Product

- **AvaSTAR** — orbital avatar that brightens as eco score rises and gathers debris when weekly mass is heavy.
- **Live GPS** — Geolocation API speed thresholds map walking, cycling, transit, car, and highway.
- **Nova parser** — Gemini 2.0 Flash for receipts/bank text, IPCC/DEFRA 2024 factors on device if the API is offline.
- **Race** — global, national, and friend-circle leaderboards on a rolling 7-day window.
- **Nova coach** — swap suggestions and a weekly narrative of why rank moved.

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 18, Vite, Tailwind, Framer Motion, Canvas HUD |
| Backend | FastAPI, Gemini Flash, IPCC/DEFRA emission tables |
| Storage | Privacy-first `localStorage` for the demo client |

## Run

```bash
# frontend
cd frontend
npm install
npm run dev

# backend (optional — client degrades gracefully)
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Open `http://localhost:3000`. Enter the race from the landing page, then use Command, Galaxy, Race, Logger, and Nova.

Set `GOOGLE_API_KEY` in `backend/.env` to enable live Gemini parsing. Without it, the logger uses the local estimator so the demo still presents.
