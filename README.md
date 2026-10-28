# Fantics-Motors

## Backend deployment configuration

The backend uses the MySQL environment variables in `backend/.env.example` for local development. To use PostgreSQL in production, set `DATABASE_URL` to the provider's PostgreSQL connection URL; it takes precedence over the MySQL settings and uses SSL, non-persistent connections, and disabled server-side cursors for serverless deployments using a transaction pooler.

Set `CLOUDINARY_URL` in the backend environment to store uploaded vehicle images in Cloudinary. Without it, Django uses local media storage, which is suitable for development but not persistent serverless storage. Copy `backend/.env.example` as a reference and keep real credentials in the hosting provider's environment-variable settings, not in source control.

After configuring the production database, run `python manage.py migrate` and create an admin with `python manage.py createsuperuser` from the backend directory, targeting that same production environment.
