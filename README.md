# CS-312 Mini-Project 3

## Blog Web Application with PostgreSQL

### Project Description

This application was developed using Node.js, Express.js, EJS, and PostgreSQL.

It authorizes users to register accounts, login, create blog posts, view posts, and the ability to edit or delete posts that they made.

### Technologies Used

- Node.js
- Express.js
- EJS
- PostgreSQL
- HTML and CSS
- bcrypt
- express-session
- connect-pg-simple

### Features

- User registration and authentication
- Login and logout
- Create, read, update, and delete blog posts
- PostgreSQL database storage
- Blog ownership restrictions
- Responsive website design

### Installation Instructions

1. Install Node.js and PostgreSQL.
2. Open the project folder in VS Code.
3. Run `npm install`.
4. Create a PostgreSQL database named `BlogDB`.
5. Run schema.sql followed by seed.sql in pgAdmin's Query Tool to create and populate the database.
6. Create a `.env` file containing the PostgreSQL connection settings and a random `SESSION_SECRET`.
7. Run `node app.js`.
8. Open `http://localhost:3000` in a browser.

### Database Tables

**users:** Stores user IDs, password hashes, and names.

**blogs:** Stores blog titles, content, creator information, and creation dates.

### Database Setup Instructions

This project includes two SQL files for setting up the PostgreSQL database:

- **schema.sql:** Creates the `users` and `blogs` tables with the required columns and relationships.
- **seed.sql:** Inserts 3 sample users and 5 sample blog posts for testing.

To set up the database:

1. Open pgAdmin 4 and create a database named `BlogDB`.
2. Open the Query Tool for `BlogDB`.
3. Execute `schema.sql` first to create the tables.
4. Execute `seed.sql` next to insert the sample data.
5. Verify the data using these SQL commands:

```sql
SELECT * FROM users;
SELECT * FROM blogs;
```

Run these scripts on a fresh database to avoid duplicate-table or duplicate-record errors.

The database allows blog posts and user accounts to remain saved even after the Node.js server restarts.

### Security

Passwords are hashed using bcrypt. Users are only able to edit or delete the posts they created.

### Known Limitations

This application is intended for local development only and thus, lacks CSRF protection or login rate limiting.

## Database Setup Instructions

This project uses PostgreSQL to store user accounts and blog posts.

Two SQL files are included to make setting up the database easier:

- **schema.sql** — Creates the `users` and `blogs` tables, including their columns, primary keys, and foreign key relationship.
- **seed.sql** — Inserts 3 sample users and 5 sample blog posts into the database.

### How to Set Up the Database

1. Open pgAdmin 4 and connect to PostgreSQL.
2. Create a new database named `BlogDB`.
3. Right-click `BlogDB` and select **Query Tool**.
4. Open the `schema.sql` file in the Query Tool and click **Execute**. This creates the database tables.
5. Next, open `seed.sql` in the Query Tool and click **Execute**. This inserts the sample users and blog posts.
6. Verify that the data was inserted by running:

```sql
SELECT * FROM users;
SELECT * FROM blogs;
```

7. Create a `.env` file in the project folder using `.env.example` as a template. Enter your own PostgreSQL connection credentials and a randomly generated session secret.
8. Open the project in VS Code and run:

```bash
npm install
node app.js
```

9. Open `http://localhost:3000` in your browser.

**Important:** Run `schema.sql` before `seed.sql`, and run both scripts only once on a fresh database. Running them again may produce errors because the tables or sample records already exist.

The database stores blog posts permanently, so posts remain available after restarting the application.
