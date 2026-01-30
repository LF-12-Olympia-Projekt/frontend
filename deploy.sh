#!/bin/bash
set -e

echo "🚀 Deploy started"

# HIER ist dein Git-Repo
cd /home/frontend

echo "📦 Pull latest code"
git pull origin master

echo "🐳 Build & restart docker"
docker compose down
docker compose build
docker compose up -d

echo "✅ Deploy finished"
