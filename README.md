# Statify - Spotify Music Analytics

A modern React application that provides detailed analytics and insights about your Spotify listening habits.

## 🚀 Features

- **Personalized Music Analytics**: View your top tracks and artists across different time periods
- **Genre Analysis**: Interactive charts showing your music genre preferences
- **Modern UI**: Built with Bootstrap 5 and modern React patterns
- **Real-time Data**: Fetches live data from Spotify Web API
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18 with Hooks
- **Build Tool**: Vite
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Charts**: Chart.js 4 with react-chartjs-2
- **Styling**: Bootstrap 5
- **Routing**: React Router 6

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Spotify Premium account (for full functionality)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd statify
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Spotify API credentials
Create a `.env` file in the root directory:
```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000
```

### 4. Start development server
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Spotify API Setup
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Add `http://localhost:3000` to Redirect URIs
4. Copy your Client ID to the `.env` file

### Environment Variables
- `VITE_SPOTIFY_CLIENT_ID`: Your Spotify application client ID
- `VITE_SPOTIFY_REDIRECT_URI`: Your application's redirect URI

## 🏗️ Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── store/              # Zustand state management
├── App.js              # Main application component
└── index.js            # Application entry point
```

## 🔄 Migration Notes

This project has been modernized from React 16 to React 18 with the following key changes:

- **Class Components → Functional Components**: All components now use hooks
- **React Scripts → Vite**: Faster build times and modern tooling
- **Prop Drilling → Zustand Store**: Centralized state management
- **Chart.js 2 → Chart.js 4**: Updated chart library with new API
- **React Router 4 → React Router 6**: Modern routing patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spotify Web API for music data
- Chart.js for beautiful visualizations
- React community for excellent tooling
