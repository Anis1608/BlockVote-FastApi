# BlockVote Docker Setup

This document describes how to build and run the BlockVote application using Docker and Docker Compose.

## Project Structure

The BlockVote application consists of:

- **Backend**: FastAPI Python application (Port 8000)
- **VoterRegistrationFrontend**: Voter registration React app (Port 5173)
- **AdminFrontend**: Admin dashboard React app (Port 5174)
<!-- - **Frontend**: Voter voting app React app (Port 5175) -->
- **SuperAdminFrontend**: Super admin dashboard React app (Port 5175)

## Prerequisites

- Docker (v20.10+)
- Docker Compose (v1.29+)

## Quick Start

### Using Docker Compose (Recommended)

To start all services at once:

```bash
docker-compose up -d
```

To view logs:

```bash
docker-compose logs -f
```

To stop all services:

```bash
docker-compose down
```

To remove all data volumes:

```bash
docker-compose down -v
```

## Service Details

### Backend
- **Port**: 8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: PostgreSQL (automatically created)
- **Cache**: Redis (automatically created)

### Frontends
- **Voter Registration**: http://localhost:5173
- **Admin Frontend**: http://localhost:5174
- **Voter App**: http://localhost:5175
- **Super Admin**: http://localhost:5176

## Building Individual Services

### Build Backend
```bash
docker build -t blockvote-backend:latest ./Backend
```

### Build a Frontend Service
```bash
docker build -t blockvote-admin-frontend:latest ./AdminFrontend
docker build -t blockvote-frontend:latest ./Frontend
docker build -t blockvote-super-admin:latest ./SuperAdminFrontend
docker build -t blockvote-voter-reg:latest ./VoterRegistrationFrontend
```

## Running Individual Services

### Run Backend
```bash
docker run -d \
  --name blockvote_backend \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:password@localhost:5432/blockvote \
  -e REDIS_URL=redis://localhost:6379 \
  blockvote-backend:latest
```

### Run a Frontend Service
```bash
docker run -d \
  --name blockvote_admin \
  -p 5174:5173 \
  blockvote-admin-frontend:latest
```

## Environment Variables

For the Backend, configure these environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `PYTHONUNBUFFERED=1`: Python logging
- Add other FastAPI-specific variables as needed

## Volumes

- `postgres_data`: PostgreSQL data persistence
- `redis_data`: Redis data persistence

## Networks

All services are connected via the `blockvote_network` bridge network for inter-service communication.

## Troubleshooting

### Backend won't connect to database
- Ensure PostgreSQL container is running: `docker-compose logs postgres`
- Check DATABASE_URL format in environment
- Wait for database to be ready (health check status)

### Port already in use
- Change port mappings in docker-compose.yml
- Or stop existing containers: `docker-compose down`

### Frontend shows blank page
- Check console for API connection errors
- Verify backend is running and accessible
- Check CORS settings in FastAPI main.py

### Clear everything and restart
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d
```

## Production Deployment

For production:

1. Update environment variables in docker-compose.yml or use `.env` file
2. Use specific version tags instead of `latest`
3. Configure proper database credentials
4. Set up reverse proxy (nginx/traefik)
5. Enable HTTPS/SSL
6. Configure logging and monitoring

## Further Information

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
