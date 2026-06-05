#!/bin/sh
set -e

cd /app

if [ -f "./node_modules/.bin/prisma" ]; then
  ./node_modules/.bin/prisma migrate deploy --schema=packages/database/prisma/schema.prisma || true
fi

exec node apps/web/server.js
