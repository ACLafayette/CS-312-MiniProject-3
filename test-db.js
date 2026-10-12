
const db = require("./db");

async function testDatabase() {
    try {
        const result = await db.query(
            "SELECT blog_id, title FROM blogs ORDER BY blog_id"
        );

        console.log("Connected to PostgreSQL!");
        console.log("Number of posts:", result.rows.length);
        console.table(result.rows);

    } catch (error) {
        console.error("Database connection failed:");
        console.error(error.message);

    } finally {
        await db.end();
    }
}

testDatabase();
