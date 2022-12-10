#!/bin/bash

# Stop container if it's already running
docker compose down -v

# Start container
docker compose up -d

# Run a migration to create your database tables with Prisma Migrate
# && Populate database with sample data
npx prisma migrate dev --name init && npx ts-node populate_db.ts
