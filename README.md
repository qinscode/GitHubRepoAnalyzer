# GitHub Repository Analyzer

A desktop application built with React and Tauri to analyze GitHub repositories individually or in batch to gain valuable insights.

## Features

- Analyze individual GitHub repositories
- Batch analysis of multiple repositories
- Visualization of repository metrics
- User-friendly interface with Material UI

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TanStack Router for routing
- TanStack React Query for data fetching
- TanStack Table for data display
- Material UI for components
- Recharts for data visualization
- Zustand for state management
- React Hook Form for form handling
- Zod for schema validation
- Tailwind CSS for styling

### Backend
- Tauri (Rust-based framework)
- Tauri API
- Tauri Plugin Opener

## Development Setup

### Prerequisites
- Node.js (latest LTS version)
- pnpm 10.11.0 or newer
- Rust and Cargo (for Tauri)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
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

Start the development server:
```bash
pnpm dev           # Web-only development
pnpm tauri:dev     # Tauri app development
```

### Building

Build the application:
```bash
pnpm build         # Web build
pnpm tauri:build   # Tauri app build
```

## Scripts

- `pnpm dev` - Start Vite development server
- `pnpm build` - Build the web application
- `pnpm tauri:dev` - Start Tauri development
- `pnpm tauri:build` - Build the Tauri application
- `pnpm lint` - Run ESLint to check for issues
- `pnpm lint:fix` - Fix linting issues automatically
- `pnpm format` - Format code with Prettier

## Project Structure

- `src/` - React application source code
- `src-tauri/` - Tauri backend code (Rust)
- `public/` - Static assets

## License

MIT License - See [LICENSE](LICENSE) file for details.

## macOS Installation Note

As this application is not signed with an Apple Developer Certificate, macOS users may encounter the following error when opening the app:

```
"GH Analyzer.app" is damaged and can't be opened. You should move it to the Bin.
```

To resolve this issue, open Terminal and run the following command:

```bash
sudo xattr -rd com.apple.quarantine "/path/to/GH Analyzer.app"
```

Replace `/path/to/GH Analyzer.app` with the actual path to the application. This command removes the macOS quarantine attribute that's blocking the app from running.

## Author

Fudong Qin

