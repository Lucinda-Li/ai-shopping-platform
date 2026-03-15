# AuraFit

A unified shopping platform that lets you search across multiple retailers in one place, with **AI virtual try-on** and **wishlist** support. Built for a better clothing search experience.

## Features

- **Cross-platform search** — One search bar returns products from many brands (powered by SerpApi / Google Shopping).
- **Product detail** — Gallery, size selector, “Go to official website,” and link to AI try-on.
- **AI virtual try-on** — Upload your photo and enter height, weight, and size; get a generated try-on image and size recommendation (via fal.ai).
- **Wishlist** — Save products and view them on a dedicated wishlist page (persisted in browser).

## Tech Stack

| Layer    | Stack |
|----------|--------|
| Frontend | React, TypeScript, Vite, React Router DOM |
| Backend  | Python, FastAPI, Uvicorn |
| APIs     | SerpApi (search), fal.ai (virtual try-on) |

## Project Structure

```
ai-shopping-platform/
├── frontend/          # React + Vite app
│   └── src/
│       ├── context/   # WishlistContext
│       ├── pages/     # HomePage, SearchResultsPage, ProductDetailsPage, AiTryOnPage, WishlistPage
│       └── ...
├── backend/           # FastAPI app
│   └── app/
│       ├── main.py
│       ├── routes/    # search_and_filter, tryon
│       └── services/  # search_and_filter_service, tryon_service
└── README.md
```

## Setup & Run

### Prerequisites

- **Node.js** (for frontend)
- **Python 3** (for backend)
- **API keys**: SerpApi (search), fal.ai (try-on). Place them in `backend/.env`.

### Backend

```bash
cd backend
pip install -r requirements.txt
# Create backend/.env with SERPAPI_KEY and FAL_KEY
python -m uvicorn app.main:app --reload --port 8000
```

API base: `http://localhost:8000`

- `POST /api/search` — body: `{ "query": "hoodie", "limit": 20 }` → returns product list.
- `POST /tryon` — form: `user_image` (file), `cloth_image_url` (or `cloth_image`), `height`, `weight`, `size` → returns try-on image path, `recommended_size`, `bmi`.
- Try-on result images: `http://localhost:8000/outputs/<filename>`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Use the login flow to reach the home page, then search, open a product, add to wishlist, or try AI try-on.

### Environment (backend)

Create `backend/.env`:

```
SERPAPI_KEY=your_serpapi_key
FAL_KEY=your_fal_key
```

## License

MIT (or specify your license).
