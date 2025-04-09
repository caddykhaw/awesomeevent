# AwesomeEvent

A comprehensive event management platform designed to enhance the experience of creating, managing, and attending events.

## Features

- 🎫 Intuitive event creation and ticketing
- 📊 Robust event management tools
- 👥 Enhanced attendee experience
- 🎟️ Seamless ticketing system
- 📱 Mobile-friendly interface
- 🔍 Advanced event discovery
- 📈 Real-time analytics

## Tech Stack

- **Frontend**: Vue.js, Vite, Tailwind CSS, DaisyUI
- **Backend**: Hono, Node.js
- **Database**: SQLite (Dev), Turso (Prod)
- **Authentication**: Clerk
- **Deployment**: Cloudflare Pages & Workers

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/awesomeevent.git
cd awesomeevent
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Start development servers
```bash
pnpm dev
```

## Project Structure

```
awesomeevent/
├── apps/
│   ├── api/         # Backend application
│   └── web/         # Frontend application
├── packages/
│   ├── config/      # Shared configuration
│   └── types/       # Shared TypeScript types
└── memory-bank/     # Project documentation
```

## Development

- `pnpm dev`: Start development servers
- `pnpm build`: Build all applications
- `pnpm test`: Run tests
- `pnpm lint`: Lint code
- `pnpm format`: Format code

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 