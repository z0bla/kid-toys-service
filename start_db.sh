#!/bin/bash

# Stop container if it's already running
docker compose down -v

# Start container
docker compose up -d