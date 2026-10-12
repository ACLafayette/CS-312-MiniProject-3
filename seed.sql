
-- Demo users (bcrypt password hashes)
-- Passwords are for classroom testing only.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users (user_id, password, name)
VALUES
('alex01', crypt('password123', gen_salt('bf', 12)), 'Alex Johnson'),
('sarah02', crypt('hello456', gen_salt('bf', 12)), 'Sarah Smith'),
('john03', crypt('blog789', gen_salt('bf', 12)), 'John Davis');

-- Five sample blog posts

INSERT INTO blogs
(creator_name, creator_user_id, title, body, date_created)
VALUES
('Alex Johnson', 'alex01',
 'My First PostgreSQL Blog',
 'This is my first blog post stored in PostgreSQL.',
 CURRENT_TIMESTAMP - INTERVAL '5 days'),

('Sarah Smith', 'sarah02',
 'Learning Express.js',
 'I am learning to build web applications using Express.js.',
 CURRENT_TIMESTAMP - INTERVAL '4 days'),

('John Davis', 'john03',
 'Why I Like Node.js',
 'Node.js allows JavaScript to run on the server.',
 CURRENT_TIMESTAMP - INTERVAL '3 days'),

('Alex Johnson', 'alex01',
 'Understanding EJS',
 'EJS helps display dynamic content on web pages.',
 CURRENT_TIMESTAMP - INTERVAL '2 days'),

('Sarah Smith', 'sarah02',
 'My Coding Progress',
 'I have learned about databases, authentication, and CRUD operations.',
 CURRENT_TIMESTAMP - INTERVAL '1 day');
