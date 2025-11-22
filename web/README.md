# POA Multi-Agent Frontend

React + TypeScript frontend for the Public Opinion Analysis Multi-Agent System.

## Features

- 🎯 **Task Submission**: Natural language interface for analysis requests
- 📊 **Results Visualization**: Interactive charts for sentiment, topics, and trends
- 🔄 **Real-time Status**: Monitor analysis progress
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Beautiful, premium design with smooth animations

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8100`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── TaskForm/        # Analysis task submission
│   ├── TaskList/        # Task history
│   ├── ResultDashboard/ # Main results display
│   ├── SentimentChart/  # Sentiment visualization
│   ├── TopicCloud/      # Topic analysis display
│   ├── TrendGraph/      # Trend charts
│   └── ReportViewer/    # Report display
├── services/            # API integration
│   └── api.ts           # API client
├── types/               # TypeScript types
│   └── index.ts         # Type definitions
├── hooks/               # Custom React hooks
├── App.tsx              # Main application
└── index.css            # Global styles
```

## Configuration

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8100/api/v1
```

## Usage

1. **Submit Analysis Task**: Enter a natural language request (e.g., "分析抖音上关于'人工智能'的舆情")
2. **View Results**: Explore sentiment analysis, topic extraction, and trend detection
3. **Review Reports**: Read comprehensive analysis reports and recommendations

## Technologies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Recharts**: Data visualization
- **Axios**: HTTP client
- **Lucide React**: Icon library

## License

MIT
