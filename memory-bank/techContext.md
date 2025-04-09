# Technology Context

## Frontend Stack
- **Framework**: Vue.js
- **Build Tool**: Vite
- **CSS Framework**: 
  - Tailwind CSS for utility-first styling
  - Daisy UI as a component library on top of Tailwind

## Backend Stack
- **Framework**: Hono (lightweight, fast web framework)
- **Runtime**: Node.js

## Database
- **Development**: SQLite (local database)
- **Production**: Turso (distributed SQL database built on libSQL, compatible with SQLite)

## Authentication
- Clerk for user authentication and management

## Development Environment
- TypeScript for type safety across the entire stack
- ESLint and Prettier for code formatting and quality
- Git for version control
- Monorepo structure for managing frontend and backend

## Deployment
- Cloudflare Pages for frontend hosting
- Cloudflare Workers for serverless backend
- Edge-ready with Hono backend

## Dependencies
### Frontend
- vue
- vite
- @vitejs/plugin-vue
- tailwindcss
- daisyui
- vue-router
- pinia (Vue's official state management)
- @clerk/clerk-vue
- vee-validate (form validation)
- vue-query (data fetching)
- date-fns (date manipulation)
- zod (schema validation)

### Backend
- hono
- @hono/node-server
- drizzle-orm (for SQLite/Turso)
- @clerk/clerk-sdk-node
- zod (schema validation)
- better-sqlite3 (development)
- libsql (production with Turso)

## Development Tools
- TypeScript
- ESLint
- Prettier
- Vitest for testing
- Playwright for E2E testing

## Development Environment

### Local Setup
- Node.js 20+
- pnpm as package manager
- VSCode with ESLint and Prettier extensions
- Drizzle Studio for database management
- Postman for API testing

### Testing Strategy
- Vitest for unit testing
- Playwright for E2E testing
- MSW for API mocking

## Technical Constraints

### Performance Requirements
- First contentful paint under 1s
- Time to interactive under 2s
- Core Web Vitals optimized
- Bundle size optimized

### Scalability Considerations
- Serverless architecture for automatic scaling
- Edge computing with Cloudflare Workers
- Efficient database query patterns
- Implement caching strategies

### Security Requirements
- Authentication through Clerk
- HTTPS-only
- Content Security Policy
- Rate limiting
- Input validation

## Technical Decisions

### Database Strategy
- Use SQLite for development with easy setup
- Design schema for compatibility with Turso for production
- Use Drizzle ORM for type-safe database access
- Implement flat schema design to avoid circular dependencies
- Migration path to Cloudflare D1 for production

### API Architecture
- REST API for simplicity and broad compatibility
- Typed API routes with Zod validation
- Structured error responses
- Pagination on list endpoints
- API versioning

### Frontend Architecture
- Component-based design with atomic principles
- Global state management with React Context
- Client-side caching with SWR
- Responsive design with Tailwind CSS
- Accessibility-first approach

### Optimization Strategy
- Server-side rendering for critical pages
- Static generation for content-focused pages
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Edge caching with Cloudflare

## Technology Stack

### Frontend
- **Framework**: Next.js (React framework)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: Headless UI and custom components
- **Form Handling**: React Hook Form with Zod validation
- **API Client**: Axios with request/response interceptors
- **Testing**: Jest and React Testing Library
- **Mobile Framework**: Progressive Web App (PWA) capabilities
- **QR Code**: react-qr-code for generating and reading QR codes
- **Data Visualization**: Chart.js or D3.js for analytics dashboards
- **Maps Integration**: Google Maps API for location-based events
- **Filter System**: react-query for filter state management
- **URL State Management**: next-query-params for filter persistence in URLs
- **Animation**: Framer Motion for smooth filter transitions

### Backend
- **Framework**: Node.js with Express
- **API**: RESTful with OpenAPI specification
- **Authentication**: Clerk
- **Database**: 
  - SQLite for prototyping and development
  - TURSO (SQLite-compatible) for production deployment
- **ORM**: Drizzle for type-safe database access
- **Caching**: Redis for performance optimization
- **Search**: Elasticsearch for advanced event discovery and multi-dimensional filtering
- **Testing**: Jest with Supertest
- **File Storage**: AWS S3 for event images and documents
- **Notifications**: FCM (Firebase Cloud Messaging) for push notifications
- **Category Management**: Custom hierarchical categorization system with PostgreSQL LTREE extension

### Mobile Specific
- **PWA Support**: Service workers for offline capabilities
- **Native Features**: Camera access for QR code scanning
- **Geolocation**: For location-based event recommendations
- **Push Notifications**: For timely event updates and reminders

### DevOps & Infrastructure
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (frontend), Heroku (backend)
- **Monitoring**: Sentry, Datadog
- **Version Control**: Git with GitHub
- **Infrastructure as Code**: Terraform
- **CDN**: Cloudflare for static asset delivery

## Development Setup

### Prerequisites
- Node.js (v20+)
- npm or yarn
- Docker and Docker Compose
- PostgreSQL (local or containerized)
- Redis (local or containerized)

### Local Development
```bash
# Clone the repository
git clone https://github.com/username/awesomeevent.git

# Install dependencies
cd awesomeevent
npm install

# Set up environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

### Environment Variables
- `DATABASE_URL`: Database connection string (SQLite file path during development, Turso URL in production)
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret for JWT tokens
- `API_URL`: URL for the backend API
- `NEXT_PUBLIC_API_URL`: Publicly exposed API URL for frontend
- `NODE_ENV`: Environment (development, test, production)
- `OAUTH_PROVIDERS`: Configuration for social login providers
- `S3_BUCKET`: AWS S3 bucket for file storage
- `MAPS_API_KEY`: Google Maps API key
- `FCM_SERVER_KEY`: Firebase Cloud Messaging server key

## Technical Constraints

### Performance Requirements
- Page load times under 2 seconds
- API response times under 300ms
- Support for at least 100,000 concurrent users
- Mobile app responsiveness under 1 second
- Efficient handling of large event catalogs (10,000+ events)

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest version)
- Mobile browsers (iOS Safari, Android Chrome)

### Security Requirements
- HTTPS for all connections
- OWASP security best practices
- Regular security audits
- Data encryption at rest and in transit
- Secure authentication with 2FA option
- PCI compliance for payment processing

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Responsive design for various devices and screen sizes

## Dependencies

### Core Dependencies
- **nextjs**: React framework for production
- **react**: UI library
- **redux**: State management
- **tailwindcss**: Utility-first CSS framework
- **prisma**: Database ORM
- **express**: Node.js web framework
- **jsonwebtoken**: JWT implementation
- **axios**: HTTP client
- **firebase**: For push notifications and authentication
- **@stripe/stripe-js**: For payment processing
- **react-hook-form**: Form validation and handling
- **react-qr-code**: QR code generation and scanning
- **react-query**: Data fetching and filter state management
- **next-query-params**: URL parameter handling for filter persistence
- **framer-motion**: Animations for filter interface
- **elasticsearch**: Advanced search and multi-dimensional filtering
- **postgres-ltree**: Hierarchical category management
- **drizzle-orm**: Database ORM for SQLite and Turso
- **sqlite3/better-sqlite3**: SQLite database driver for development

### Development Dependencies
- **typescript**: Type checking
- **jest**: Testing framework
- **eslint**: Code linting
- **prettier**: Code formatting
- **husky**: Git hooks
- **docker-compose**: Container orchestration
- **lighthouse**: Performance and accessibility auditing
- **storybook**: Component development and documentation

## Monitoring and Analytics
- Error tracking with Sentry
- Performance monitoring with Datadog
- User analytics with Google Analytics
- Custom application metrics with Prometheus
- User behavior tracking with Hotjar
- Conversion funnel analysis for registration process

## Integration Points
- Payment gateways (Stripe, PayPal)
- Social login providers (Google, Facebook, Apple)
- Email delivery services (SendGrid, Mailchimp)
- Maps and geolocation services
- Calendar applications (Google Calendar, Apple Calendar)
- Push notification services 

## Database Schema Highlights

### Category System Schema
- **categories**: Main category table with hierarchical structure
  - id: Primary key
  - name: Category name
  - slug: URL-friendly identifier
  - type: Type of category (event_type, industry, format, audience)
  - path: LTREE path for hierarchical relationships
  - parent_id: Parent category reference (nullable)
  - icon: Icon identifier
  - color: Branding color reference
  - created_at: Timestamp
  - updated_at: Timestamp

- **event_categories**: Junction table for events and categories
  - event_id: Reference to events table
  - category_id: Reference to categories table
  - primary: Boolean flag for primary category
  - created_at: Timestamp

The category system is designed to support:
- Multi-dimensional filtering
- Hierarchical relationships (parent/child categories)
- Cross-cutting categorization (events belong to multiple category types)
- Efficient querying with indexing on frequently accessed fields 

## Database Migration Strategy
- Initial development with SQLite for fast prototyping
- Database schema defined with Drizzle ORM for type safety
- Migration to Turso before production deployment
- Leveraging Turso's SQLite compatibility for seamless transition
- Using Turso's replica capabilities for scaling in production 