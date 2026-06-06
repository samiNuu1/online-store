# Online Store

A full stack online store I built to practice backend development. No frameworks like React — just Node.js, Express, PostgreSQL, and EJS on the server side with plain HTML and CSS on the front end.

## What it does

- Register and login with hashed passwords
- Browse products and view individual product pages
- Add items to a cart (stored in session)
- Checkout and get an order confirmation
- View your order history
- Protected routes — you can't access cart or orders without logging in

## Built with

- Node.js + Express.js
- PostgreSQL
- EJS (templating)
- bcrypt (password hashing)
- express-session (user sessions)
- dotenv

## Running it locally

**1. Clone the repo**
```bash
git clone https://github.com/samiNuu1/online-store.git
cd online-store
```

**2. Install packages**
```bash
npm install
```

**3. Set up your environment variables**

Copy the example file and fill in your details:
```bash
cp .env.example .env
```

Your `.env` should look like this:
```
PORT=3000

PGUSER=postgres
PGPASSWORD=your_password
PGHOST=localhost
PGPORT=5432
PGDATABASE=store

SESSION_SECRET=anylongrandomstring
```

**4. Create the database**
```bash
psql -U postgres -c "CREATE DATABASE store;"
```

**5. Create the tables**
```bash
psql -U postgres -d store -f db/schema.sql
```

**6. Add sample products**
```bash
psql -U postgres -d store -f db/seed.sql
```

**7. Start the server**
```bash
npm run dev
```

Open `http://localhost:3000` and you're good to go.

## Folder structure

```
online-store/
  controllers/        business logic
  db/                 database connection, schema, seed data
  middleware/         auth middleware to protect routes
  public/             css and images
  routes/             url routing
  views/              ejs templates
  server.js           entry point
  .env.example        environment variable reference
```
