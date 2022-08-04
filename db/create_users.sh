#! /bin/sh
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE USER transcendence WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
  CREATE DATABASE transcendence;
	GRANT ALL PRIVILEGES ON DATABASE transcendence TO transcendence;
EOSQL