#!/bin/bash

# Stop container if it's already running
docker compose down -v

# Start container
docker compose up -d

# Wait for the container to start up
sleep 3

# Run a migration to create your database tables with Prisma Migrate
# && Populate database with sample data
npx prisma db push && npx prisma migrate dev --name init && npx ts-node scripts/populate_db.ts
