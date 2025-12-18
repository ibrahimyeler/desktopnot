# Momby Content Service

Content management and blog service for Momby platform.

## Tech Stack

- FastAPI
- PostgreSQL (SQLAlchemy)
- MongoDB
- Elasticsearch
- AWS S3

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run database migrations:
```bash
alembic upgrade head
```

4. Start the server:
```bash
uvicorn app.main:app --reload
```

## API Endpoints

- `GET /api/v1/posts` - Get all posts
- `POST /api/v1/posts` - Create a new post
- `GET /api/v1/posts/{id}` - Get a single post
- `PUT /api/v1/posts/{id}` - Update a post
- `DELETE /api/v1/posts/{id}` - Delete a post
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/media/upload` - Upload media file
- `GET /api/v1/search?q=...` - Search content

## Development

Run tests:
```bash
pytest
```

