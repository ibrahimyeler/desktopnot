# Kovan Backend

A multi-tenant, sector-aware SaaS platform backend built with Go and Chi framework.

## Architecture Overview

Kovan is a sophisticated multi-tenant SaaS platform with four distinct admin panels:

1. **Customer Panel** - Next.js web and React Native app for browsing services, booking, checkout, profiles, and multi-language domains
2. **Vendor Admin Panel** - Drag-and-drop builder for composing customer experiences, managing catalog/availability, payments, themes, SEO, and publishing
3. **Vertical Admin Panel** - For sector owners (travel, education, etc.) to manage vendors, templates, block libraries, pricing, analytics, and revenue-share
4. **Root Admin Panel** - Cross-tenant oversight, billing, feature flags, security/audit, and "act-as" support

## Tech Stack

- **Framework**: Chi (Go HTTP router)
- **Database**: PostgreSQL with row-level security for multi-tenancy
- **Cache**: Redis for caching, rate limiting, and sessions
- **Authentication**: JWT + MFA
- **Payments**: Stripe/Connect integration
- **Observability**: OpenTelemetry, Prometheus, Sentry
- **Deployment**: Static artifact generation + CDN invalidation

## Project Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go              # Application entry point
├── internal/
│   ├── api/
│   │   ├── customer/            # Customer panel handlers
│   │   ├── vendor/              # Vendor admin handlers
│   │   ├── vertical/            # Vertical admin handlers
│   │   ├── root/                # Root admin handlers
│   │   └── routes.go            # Route definitions
│   ├── middleware/
│   │   ├── auth/                # JWT authentication
│   │   ├── tenant/              # Multi-tenant context
│   │   └── rate_limit/          # Rate limiting
│   ├── models/                  # Data models
│   ├── services/                # Business logic
│   └── database/                # Database operations
├── pkg/                         # Public packages
├── go.mod                       # Go module file
└── env.example                  # Environment variables template
```

## Getting Started

### Prerequisites

- Go 1.21+
- PostgreSQL 13+
- Redis 6+
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kovan/backend
```

2. Install dependencies:
```bash
go mod download
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
# Create database and user
createdb kovan
createuser kovan_user
# Set password and permissions as needed
```

5. Run the application:
```bash
go run cmd/server/main.go
```

The server will start on `http://localhost:8080`

## API Endpoints

### Customer Panel (`/api/v1/customer`)
- `GET /services` - List services
- `GET /services/{id}` - Get service details
- `POST /bookings` - Create booking
- `GET /profile` - Get user profile
- `GET /translations/{locale}` - Get translations

### Vendor Admin (`/api/v1/vendor`)
- `GET /pages` - List pages
- `POST /pages` - Create page
- `GET /catalog` - Get catalog
- `POST /catalog/services` - Create service
- `GET /payments` - Get payments
- `POST /publish` - Publish version

### Vertical Admin (`/api/v1/vertical`)
- `GET /vendors` - List vendors
- `POST /vendors` - Create vendor
- `GET /templates` - List templates
- `GET /analytics` - Get analytics
- `GET /revenue` - Get revenue data

### Root Admin (`/api/v1/root`)
- `GET /tenants` - List all tenants
- `GET /billing` - Get billing info
- `GET /features` - List feature flags
- `GET /audit` - Get audit logs
- `POST /act-as/{userID}` - Act as user

## Multi-Tenancy

The platform uses row-level security in PostgreSQL to ensure data isolation between tenants. Each request is processed with tenant context middleware that:

1. Extracts tenant information from domain/subdomain
2. Validates user permissions for the tenant
3. Applies tenant-specific filters to all database queries

## Authentication & Authorization

- **JWT-based authentication** with configurable expiry
- **Multi-factor authentication** support
- **Role-based access control** (customer, vendor, vertical, root)
- **Tenant-specific permissions** and data access

## Development

### Running Tests
```bash
go test ./...
```

### Code Formatting
```bash
go fmt ./...
```

### Linting
```bash
golangci-lint run
```

### Building
```bash
go build -o bin/server cmd/server/main.go
```

## Deployment

### Docker
```bash
docker build -t kovan-backend .
docker run -p 8080:8080 kovan-backend
```

### Production Considerations

1. **Environment Variables**: Ensure all sensitive configuration is set via environment variables
2. **Database**: Use connection pooling and read replicas for production
3. **Redis**: Configure Redis cluster for high availability
4. **CDN**: Set up CDN for static assets and caching
5. **Monitoring**: Configure Prometheus, Grafana, and alerting
6. **Security**: Enable HTTPS, rate limiting, and security headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

[Add your license here]

## Support

For support and questions, please contact [your contact information].
