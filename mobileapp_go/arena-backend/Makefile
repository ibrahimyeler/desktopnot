.PHONY: build run test clean docker-build docker-run help

# Variables
BINARY_NAME=arena-server
DOCKER_IMAGE=arena-backend
DOCKER_TAG=latest

# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
GOMOD=$(GOCMD) mod

# Build the application
build:
	$(GOBUILD) -o $(BINARY_NAME) cmd/server/main.go

# Run the application
run: build
	./$(BINARY_NAME)

# Run the application directly
run-dev:
	$(GOCMD) run cmd/server/main.go

# Test the application
test:
	$(GOTEST) ./...

# Test with coverage
test-coverage:
	$(GOTEST) -coverprofile=coverage.out ./...
	$(GOCMD) tool cover -html=coverage.out

# Clean build artifacts
clean:
	$(GOCLEAN)
	rm -f $(BINARY_NAME)
	rm -f coverage.out

# Install dependencies
deps:
	$(GOMOD) download
	$(GOMOD) tidy

# Format code
fmt:
	$(GOCMD) fmt ./...

# Lint code
lint:
	golangci-lint run

# Docker build
docker-build:
	docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .

# Docker run
docker-run:
	docker run -p 8080:8080 --env-file .env $(DOCKER_IMAGE):$(DOCKER_TAG)

# Docker compose up
docker-up:
	docker-compose up -d

# Docker compose down
docker-down:
	docker-compose down

# Docker compose logs
docker-logs:
	docker-compose logs -f

# Setup development environment
setup-dev:
	@echo "Setting up development environment..."
	@echo "1. Installing dependencies..."
	$(GOMOD) download
	@echo "2. Building application..."
	$(MAKE) build
	@echo "3. Starting databases with Docker..."
	docker-compose up -d postgres redis
	@echo "4. Waiting for databases to be ready..."
	sleep 10
	@echo "✅ Development environment ready!"
	@echo "Run 'make run' to start the server"

# Health check
health:
	curl -f http://localhost:8080/healthz || echo "Server not responding"

# Create room via API
create-room:
	curl -X POST http://localhost:8080/api/v1/rooms \
		-H "Content-Type: application/json" \
		-d '{"maxPlayers": 10}'

# Get leaderboard
leaderboard:
	curl http://localhost:8080/api/v1/leaderboard?period=week

# Show help
help:
	@echo "Available commands:"
	@echo "  build         - Build the application"
	@echo "  run           - Build and run the application"
	@echo "  run-dev       - Run the application directly (no build)"
	@echo "  test          - Run tests"
	@echo "  test-coverage - Run tests with coverage report"
	@echo "  clean         - Clean build artifacts"
	@echo "  deps          - Install dependencies"
	@echo "  fmt           - Format code"
	@echo "  lint          - Lint code"
	@echo "  docker-build  - Build Docker image"
	@echo "  docker-run    - Run Docker container"
	@echo "  docker-up     - Start services with Docker Compose"
	@echo "  docker-down   - Stop services with Docker Compose"
	@echo "  docker-logs   - Show Docker Compose logs"
	@echo "  setup-dev     - Setup development environment"
	@echo "  health        - Check server health"
	@echo "  create-room   - Create a room via API"
	@echo "  leaderboard   - Get leaderboard"
	@echo "  help          - Show this help message"

# Default target
all: build
