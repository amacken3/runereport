# RuneReport

RuneReport is a full-stack OSRS Grand Exchange market analysis app. Users can sign up, log in, save item positions, maintain a watchlist, and analyze current market data using live OSRS Wiki price endpoints.

The app helps users track items they have bought, estimate current profit or loss after Grand Exchange tax, monitor market movement, and generate plain-English market analysis summaries.

## Links

* **Deployed Frontend:** https://runereport-client.onrender.com
* **Deployed Backend:** https://runereport.onrender.com
* **GitHub Repository:** https://github.com/amacken3/runereport



## Features

* User signup, login, logout, and protected routes
* JWT authentication with refresh token support
* User-owned positions and watchlist items
* Full CRUD for positions
* Full CRUD for watchlist items
* Add watchlist items to positions without removing them from the watchlist
* Live OSRS Grand Exchange market data from the OSRS Wiki API
* OSRS API requests include a configurable backend `User-Agent` contact email
* Item search using OSRS item mapping data
* Item icons displayed in search results and item cards
* Top market movers dashboard
* Position profit/loss analysis
* Estimated Grand Exchange tax calculations
* Long-term trend analysis using pandas
* Optional AI-generated market summary
* Responsive OSRS-inspired frontend theme using CSS Modules

## Tech Stack

### Frontend

* React 19
* Vite
* React Router
* CSS Modules
* Fetch API

### Backend

* Python
* Flask
* Flask-SQLAlchemy
* Flask-Migrate
* Flask-JWT-Extended
* Flask-Bcrypt
* Marshmallow
* pandas
* requests
* PostgreSQL for deployment
* SQLite fallback for local development

## Project Structure

```txt
runereport/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── authApi.js
│   │   │   ├── client.js
│   │   │   ├── config.js
│   │   │   ├── marketApi.js
│   │   │   ├── positionsApi.js
│   │   │   └── watchlistApi.js
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ItemSearchInput.jsx
│   │   │   ├── ItemSearchInput.module.css
│   │   │   ├── MarketMoverCard.jsx
│   │   │   ├── MarketMoverCard.module.css
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.module.css
│   │   │   ├── PositionCard.jsx
│   │   │   ├── PositionCard.module.css
│   │   │   ├── PositionForm.jsx
│   │   │   ├── PositionForm.module.css
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── WatchlistCard.jsx
│   │   │   ├── WatchlistCard.module.css
│   │   │   ├── WatchlistForm.jsx
│   │   │   └── WatchlistForm.module.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useMarketMovers.js
│   │   │   ├── usePositions.js
│   │   │   └── useWatchlist.js
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── DashboardPage.module.css
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LandingPage.module.css
│   │   │   ├── LoginPage.jsx
│   │   │   ├── LoginPage.module.css
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── NotFoundPage.module.css
│   │   │   ├── PositionAnalysisPage.jsx
│   │   │   ├── PositionAnalysisPage.module.css
│   │   │   ├── PositionsPage.jsx
│   │   │   ├── PositionsPage.module.css
│   │   │   ├── SignupPage.jsx
│   │   │   ├── SignupPage.module.css
│   │   │   ├── WatchlistPage.jsx
│   │   │   └── WatchlistPage.module.css
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   └── package.json
│
├── server/
│   ├── instance/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth_routes.py
│   │   ├── market_routes.py
│   │   ├── position_routes.py
│   │   └── watchlist_routes.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── position_schema.py
│   │   ├── user_schema.py
│   │   └── watchlist_schema.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_analysis.py
│   │   ├── cache.py
│   │   ├── icon_utils.py
│   │   ├── market_analysis.py
│   │   ├── market_timeseries.py
│   │   ├── osrs_api.py
│   │   └── position_analysis.py
│   ├── .env
│   ├── .flaskenv
│   ├── app.py
│   ├── config.py
│   ├── Pipfile
│   ├── Pipfile.lock
│   └── seed.py
│
├── .gitignore
└── README.md
```

## How It Works

RuneReport uses a separated frontend and backend.

The React frontend handles page routing, forms, authentication state, protected routes, and user interaction. It communicates with the Flask backend through API helper files in `client/src/api`.

The Flask backend handles authentication, database operations, protected API routes, market analysis logic, AI analysis requests, and OSRS API communication. It stores user data, positions, and watchlist items in the database. It also requests live item price data from the OSRS Wiki API.

OSRS API requests are made from the backend through `server/services/osrs_api.py`. The request headers include a `User-Agent` string with a configurable contact email stored in the backend environment as `OSRS_API_CONTACT_EMAIL`.

When a user logs in or signs up, the backend returns an access token and a refresh token. The frontend stores both tokens and uses the access token for protected requests. If the access token expires, the frontend can request a new one with the refresh token and retry the original request.

## Main User Flow

1. A visitor lands on the RuneReport landing page.
2. The user signs up or logs in.
3. The user is taken to the market dashboard.
4. The dashboard displays top gaining and losing OSRS items.
5. The user can add positions for items they have bought.
6. The user can add items to a watchlist before deciding whether to track them as positions.
7. The user can add a watchlist item to positions without removing it from the watchlist.
8. The user can view a detailed analysis page for a position.
9. The analysis page shows current value, estimated GE tax, profit or loss, market movement, long-term trend data, and optional AI analysis.

## Backend Setup

From the project root:

```bash
cd server
pipenv install
```

Create a `.env` file inside the `server` directory:

```bash
touch .env
```

Add the required environment variables:

```bash
echo "SECRET_KEY=your-secret-key" >> .env
echo "JWT_SECRET_KEY=your-jwt-secret-key" >> .env
echo "OSRS_API_CONTACT_EMAIL=your-email@example.com" >> .env
```

Optional environment variables:

```bash
echo "DATABASE_URL=sqlite:///runereport.db" >> .env
echo "OPENAI_API_KEY=your-openai-api-key" >> .env
```

Apply database migrations:

```bash
pipenv run flask db upgrade
```

Seed the database intentionally:

```bash
ALLOW_SEED=true pipenv run python seed.py
```

Run the backend server:

```bash
pipenv run flask run --port 5555
```

## Frontend Setup

From the project root:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```bash
touch .env
```

Add the frontend API base URL:

```bash
echo "VITE_API_BASE_URL=http://127.0.0.1:5555" >> .env
```

Run the frontend development server:

```bash
npm run dev
```

## Frontend Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Frontend Dependencies

The frontend production dependencies are:

```txt
react
react-dom
react-router-dom
```

The frontend development tooling includes:

```txt
vite
@vitejs/plugin-react
eslint
eslint-plugin-react-hooks
eslint-plugin-react-refresh
@types/react
@types/react-dom
globals
```

## Local Development URLs

```txt
Frontend: http://localhost:5173
Backend:  http://127.0.0.1:5555
```

## Important API Routes

### Auth

```txt
POST /auth/signup
POST /auth/login
POST /auth/refresh
GET  /auth/current-user
```

### Market

```txt
GET /market/mapping
GET /market/latest
GET /market/top-movers
GET /market/analysis/:item_id
GET /market/analysis/:item_id/timeseries
```

### Positions

```txt
GET    /positions
POST   /positions
GET    /positions/:id
PATCH  /positions/:id
DELETE /positions/:id
GET    /positions/:id/analysis
POST   /positions/:id/ai-analysis
```

### Watchlist

```txt
GET    /watchlist
POST   /watchlist
GET    /watchlist/:id
PATCH  /watchlist/:id
DELETE /watchlist/:id
```

## Deployment Notes

RuneReport is deployed as two separate services:

```txt
Frontend: Render Static Site
Backend:  Render Web Service
```

The frontend uses a Render rewrite rule so React Router routes work on refresh:

```txt
Source: /*
Destination: /index.html
Action: Rewrite
```

The backend uses PostgreSQL in production through `DATABASE_URL`.

The backend Render service should include these environment variables:

```txt
DATABASE_URL=your-render-postgres-url
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
OSRS_API_CONTACT_EMAIL=your-email@example.com
OPENAI_API_KEY=your-openai-api-key
```

`OPENAI_API_KEY` is only required if AI analysis is enabled.

## Demo Login

After running the seed file, the app includes demo users:

```txt
Username: demo_user_one
Password: password123
```

```txt
Username: demo_user_two
Password: password123
```

## Notes

RuneReport uses live market data from the OSRS Wiki API. Market prices can change frequently, so displayed values are estimates based on the latest available API data.

Grand Exchange tax calculations are estimates and are intended to help users understand possible after-tax value. The app is not financial advice and is built as a software engineering project.

## Future Improvements

Possible future improvements for RuneReport include:

* Add interactive price graphs for item trends over time
* Display historical price movement on each position analysis page
* Add more detailed AI market summaries with clearer risk levels, recommendation reasoning, and supporting market data
* Add saved AI analysis history so users can compare previous summaries against newer market conditions
* Add more advanced filters for top movers, including volume, price range, and item category
* Add watchlist alerts for large price changes
* Add portfolio-level summaries showing total invested value, total estimated value, and total estimated profit or loss
* Improve mobile responsiveness and add additional UI polish
* Add more backend tests for authentication, protected resources, and market analysis calculations

## Project Reflection

One key takeaway from this project was the importance of keeping pull requests small, focused, and easy to review. During the styling phase, a large CSS update was merged into `main`, which made the changes harder to review and reason about as a single pull request.

In future projects, I would split larger frontend updates into smaller, more targeted pull requests. For example, global styling, shared components, and major page-specific changes could each be handled separately. This would make the review process cleaner, reduce the risk of unrelated changes being introduced, and make it easier to track the purpose of each update.

