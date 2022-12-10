#!/bin/bash

# Stop container if it's already running
docker compose down -v

# Start container
docker compose up -d

# Run a migration to create your database tables with Prisma Migrate
npx prisma migrate dev --name init 
