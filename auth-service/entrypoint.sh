echo "Waiting for the database to be ready..."
until npx prisma db pull >/dev/null 2>&1; do
    npx prisma migrate dev
    echo "Database is not ready yet. Retrying in 2 seconds..."
    sleep 2
done

echo "Running migrations..."
npx prisma migrate dev 

echo "Starting the server..."
exec node dist/server.js