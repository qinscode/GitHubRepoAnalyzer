# GitHub Repository Analyzer

<p align="center">
  <a href="https://github.com/qinscode/GitHubRepoAnalyzer/releases/latest">
    <img src="https://img.shields.io/github/v/release/qinscode/GitHubRepoAnalyzer?include_prereleases&style=flat-square" alt="GitHub Release">
  </a>
  <a href="https://github.com/qinscode/GitHubRepoAnalyzer/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/qinscode/GitHubRepoAnalyzer?style=flat-square" alt="License">
  </a>
  <a href="https://github.com/qinscode/GitHubRepoAnalyzer/stargazers">
    <img src="https://img.shields.io/github/stars/qinscode/GitHubRepoAnalyzer?style=flat-square" alt="GitHub Stars">
  </a>
  <a href="https://github.com/qinscode/GitHubRepoAnalyzer/issues">
    <img src="https://img.shields.io/github/issues/qinscode/GitHubRepoAnalyzer?style=flat-square" alt="GitHub Issues">
  </a>
  <a href="https://github.com/qinscode/GitHubRepoAnalyzer/network/members">
    <img src="https://img.shields.io/github/forks/qinscode/GitHubRepoAnalyzer?style=flat-square" alt="GitHub Forks">
  </a>
  <br>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React">
  </a>
  <a href="https://tauri.app/">
    <img src="https://img.shields.io/badge/Tauri-2.0-FFC131?style=flat-square&logo=tauri" alt="Tauri">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  </a>
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/Vite-6.3-646CFF?style=flat-square&logo=vite" alt="Vite">
  </a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/qinscode/GitHubRepoAnalyzer/main/public/icon.png" alt="GitHub Repository Analyzer Logo" width="128" height="128">
</p>

A powerful desktop application built with React and Tauri that provides comprehensive analysis of GitHub repositories, individually or in batch.

## 🚀 Features

- **Single Repository Analysis**: Deep dive into metrics of individual GitHub repositories
- **Batch Processing**: Analyze multiple repositories simultaneously
- **Data Visualization**: Interactive charts and graphs for repository metrics
- **Modern UI**: Clean, intuitive interface built with Material UI components

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **TanStack** ecosystem:
  - Router for navigation
  - React Query for data fetching
  - Table for data display
- **Material UI** for component library
- **Recharts** for data visualization
- **Zustand** for state management
- **React Hook Form** with Zod validation
- **Tailwind CSS** for styling

### Backend
- **Tauri** (Rust-based desktop framework)
- Tauri API and Plugin Opener

## 🔧 Development Setup

### Prerequisites
- Node.js (latest LTS version)
- pnpm 10.11.0 or newer
- Rust and Cargo (for Tauri development)

### Installation

1. Clone the repository
```bash
git clone https://github.com/qinscode/GitHubRepoAnalyzer.git
cd github-repository-analyzer
```

2. Install dependencies
```bash
pnpm install
```

3. Setup development environment
```bash
pnpm setup
```

### Development

```bash
pnpm dev           # Web-only development
pnpm tauri:dev     # Tauri app development
```

### Building

```bash
pnpm build         # Web build
pnpm tauri:build   # Tauri app build
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite development server |
| `pnpm build` | Build the web application |
| `pnpm tauri:dev` | Start Tauri development |
| `pnpm tauri:build` | Build the Tauri application |
| `pnpm lint` | Run ESLint to check for issues |
| `pnpm lint:fix` | Fix linting issues automatically |
| `pnpm format` | Format code with Prettier |

## 📁 Project Structure

- `src/` - React application source code
- `src-tauri/` - Tauri backend code (Rust)
- `public/` - Static assets

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details.

## ⚠️ macOS Installation Note

Since this application is not signed with an Apple Developer Certificate, macOS users may encounter security warnings. If you see:

```
"GH Analyzer.app" is damaged and can't be opened. You should move it to the Bin.
```

To resolve this issue:

1. Open Terminal
2. Run the following command:
```bash
sudo xattr -rd com.apple.quarantine "/path/to/GH Analyzer.app"
```

Replace `/path/to/GH Analyzer.app` with the actual path to the application.

Example:
```bash
sudo xattr -rd com.apple.quarantine /Users/username/Downloads/GH\ Analyzer.app
```

This removes the macOS quarantine attribute that blocks unsigned applications.
