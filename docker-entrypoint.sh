#!/bin/sh
set -e

echo "⏳ Running Prisma db push..."
npx prisma db push

echo "✅ Prisma schema synced to DB. Starting app..."
exec "$@"
