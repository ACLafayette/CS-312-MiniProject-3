
const express = require("express");
const db = require("./db");

const session = require("express-session");
const connectPgSimple = require("connect-pg-simple");
const bcrypt = require("bcrypt");

const PgSession = connectPgSimple(session);

const app = express();
const port = 3000;

//sets EJS as template engine
app.set("view engine", "ejs");

//enables Express to read form submissions
app.use(express.urlencoded({ extended: true }));

app.use(session({
    store: new PgSession({
        pool: db,
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/signin");
    }

    next();
}

// Serve static files such as CSS
app.use(express.static("public"));


 // Home Page - Shows posts
app.get("/", async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                blog_id AS id,
                creator_name AS author,
                creator_user_id AS "creatorUserId",
                title,
                body AS content,
                date_created AS "createdAt"
            FROM blogs
            ORDER BY date_created DESC, blog_id DESC
        `);

        res.render("index", {
            posts: result.rows
        });

    } catch (error) {
        console.error("Error loading posts:", error);
        res.status(500).send("Unable to load posts.");
    }
});

// New Blog Post
app.post("/posts", requireLogin, async (req, res) => {
    const title = req.body.title?.trim();
    const content = req.body.content?.trim();

    if (!title || !content || title.length > 255) {
        return res.status(400).send("Invalid post title or content.");
    }

    try {
        await db.query(
            `INSERT INTO blogs
             (creator_name, creator_user_id, title, body)
             VALUES ($1, $2, $3, $4)`,
            [
                req.session.user.name,
                req.session.user.user_id,
                title,
                content
            ]
        );

        res.redirect("/");
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send("Unable to create post.");
    }
});

// Edit Page
app.get("/posts/:id/edit", requireLogin, async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).send("Invalid post ID.");
    }

    try {
        const result = await db.query(
            `SELECT
                blog_id AS id,
                creator_name AS author,
                creator_user_id AS "creatorUserId",
                title,
                body AS content
             FROM blogs
             WHERE blog_id = $1`,
            [id]
        );

        const post = result.rows[0];

        if (!post) {
            return res.status(404).send("Post not found.");
        }

        if (post.creatorUserId !== req.session.user.user_id) {
            return res.status(403).send(
                "You can only edit your own posts."
            );
        }

        res.render("edit", { post });
    } catch (error) {
        console.error("Error loading edit page:", error);
        res.status(500).send("Unable to load edit page.");
    }
});

// Save an edited post
app.post("/posts/:id/edit", requireLogin, async (req, res) => {
    const id = Number(req.params.id);
    const title = req.body.title?.trim();
    const content = req.body.content?.trim();

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).send("Invalid post ID.");
    }

    if (!title || !content || title.length > 255) {
        return res.status(400).send("Invalid post details.");
    }

    try {
        const result = await db.query(
            `UPDATE blogs
             SET title = $1, body = $2
             WHERE blog_id = $3 AND creator_user_id = $4
             RETURNING blog_id`,
            [
                title,
                content,
                id,
                req.session.user.user_id
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).send(
                "Post not found or permission denied."
            );
        }

        res.redirect("/");
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).send("Unable to update post.");
    }
});

// Delete a blog post
app.post("/posts/:id/delete", requireLogin, async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).send("Invalid post ID.");
    }

    try {
        const result = await db.query(
            `DELETE FROM blogs
             WHERE blog_id = $1 AND creator_user_id = $2
             RETURNING blog_id`,
            [id, req.session.user.user_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send(
                "Post not found or permission denied."
            );
        }

        res.redirect("/");
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).send("Unable to delete post.");
    }
});

// Page to Sign up
app.get("/signup", (req, res) => {
    res.render("signup", { error: null });
});

// Create an account
app.post("/signup", async (req, res) => {
    const user_id = req.body.user_id?.trim();
    const name = req.body.name?.trim();
    const password = req.body.password;

    if (!user_id || !name || !password ||
        user_id.length > 255 || name.length > 255 ||
        password.length < 8 || password.length > 72) {
        return res.status(400).render("signup", {
            error: "Enter valid details and a password between 8 and 72 characters."
        });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 12);

        await db.query(
            `INSERT INTO users (user_id, password, name)
             VALUES ($1, $2, $3)`,
            [user_id, passwordHash, name]
        );

        res.redirect("/signin");

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).render("signup", {
                error: "That User ID is already taken."
            });
        }

        console.error("Signup error:", error);
        res.status(500).send("Unable to create account.");
    }
});

// Login page
app.get("/signin", (req, res) => {
    res.render("signin", { error: null });
});

// Login
app.post("/signin", async (req, res) => {
    const user_id = req.body.user_id?.trim();
    const password = req.body.password;

    if (!user_id || !password) {
        return res.status(400).render("signin", {
            error: "Please enter your User ID and password."
        });
    }

    try {
        const result = await db.query(
            "SELECT user_id, name, password FROM users WHERE user_id = $1",
            [user_id]
        );

        const user = result.rows[0];

        const validPassword = user
            ? await bcrypt.compare(password, user.password)
            : false;

        if (!validPassword) {
            return res.status(401).render("signin", {
                error: "Incorrect User ID or password."
            });
        }

        // Regenerate the session after successful authentication
        req.session.regenerate((error) => {
            if (error) {
                console.error("Session error:", error);
                return res.status(500).send("Unable to sign in.");
            }

            req.session.user = {
                user_id: user.user_id,
                name: user.name
            };

            req.session.save((error) => {
                if (error) {
                    console.error("Session save error:", error);
                    return res.status(500).send("Unable to sign in.");
                }

                res.redirect("/");
            });
        });

    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).send("Unable to sign in.");
    }
});

// Logout
app.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Logout error:", error);
            return res.status(500).send("Unable to log out.");
        }

        res.clearCookie("connect.sid");
        res.redirect("/signin");
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
