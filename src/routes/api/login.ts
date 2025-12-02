import { MongoClient } from "mongodb";
import { serve } from "bun";

// Mongo client setup
const client = new MongoClient("mongodb://127.0.0.1:27017");
const db = client.db("jolzz");
const users = db.collection("users");

serve({
  port: 4000,
  fetch: async (req: Request) => {
    const url = new URL(req.url);

    if (url.pathname === "/api/login" && req.method === "POST") {
      try {
        const { username, password } = await req.json() as { username: string; password: string };

        // Find user in database
        const user = await users.findOne({ username });
        if (!user) {
          return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Verify password using Bun
        const valid = await Bun.password.verify(password, user.hash);
        if (!valid) {
          return new Response(JSON.stringify({ error: "Invalid password" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ message: "Login successful" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Server error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});



