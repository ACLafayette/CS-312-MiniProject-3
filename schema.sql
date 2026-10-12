
-- Mini-Project 3 Database Schema
-- Create a database named BlogDB first.

CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE blogs (
    blog_id SERIAL PRIMARY KEY,
    creator_name VARCHAR(255) NOT NULL,
    creator_user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_creator
        FOREIGN KEY (creator_user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);
