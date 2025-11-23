# Market Intelligence - Stock News Feed

A professional real-time stock market news feed dashboard powered by Alpha Vantage API.

## Features

- 📊 Real-time stock market news streaming
- 📈 Sentiment analysis with visual indicators (bullish/bearish)
- 🔍 Filter news by ticker symbols
- 🔄 Auto-refresh functionality (60-second intervals)
- 🎨 Professional financial dashboard design
- 📱 Fully responsive layout

## Getting Started

### Prerequisites

- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Alpha Vantage API key (get your free key at [alphavantage.co](https://www.alphavantage.co/support/#api-key))

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start development server
npm run dev
```

### Configuration

1. Get your free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Open `src/components/NewsFeed.tsx`
3. Replace the demo API key:
   ```typescript
   const ALPHA_VANTAGE_API_KEY = "YOUR_API_KEY_HERE";
   ```

## Alpha Vantage API Integration

This app uses the NEWS_SENTIMENT endpoint from Alpha Vantage:

**Endpoint:** `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=YOUR_API_KEY`

**Optional Parameters:**
- `tickers`: Filter by stock symbols (e.g., `AAPL`, `TSLA`)
- `topics`: Filter by news topics
- `time_from` / `time_to`: Time range filters
- `limit`: Number of results

[View full API documentation](https://www.alphavantage.co/documentation/#news-sentiment)

## Technologies

- **Frontend:** React, TypeScript, Vite
- **UI:** Tailwind CSS, shadcn/ui components
- **Data Fetching:** TanStack Query (React Query)
- **API:** Alpha Vantage NEWS_SENTIMENT

## Project Structure

```
src/
├── components/
│   ├── DashboardHeader.tsx    # Main header component
│   ├── NewsFeed.tsx           # News feed with API integration
│   └── NewsCard.tsx           # Individual news article card
├── types/
│   └── news.ts                # TypeScript types for API responses
└── pages/
    └── Index.tsx              # Main dashboard page
```

## Deployment

Simply open [Lovable](https://lovable.dev/projects/c974d832-c829-4a05-aa9f-c8284eca0fa5) and click on Share → Publish.

## Next Steps

- Add more ticker filtering options
- Implement topic-based filtering
- Add historical news archive
- Create price charts integration
- Build portfolio tracking features

## License

This project was built with [Lovable](https://lovable.dev)
