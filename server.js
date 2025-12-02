import { serve } from "bun";
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");
const db = client.db("jolzz");
const users = db.collection("users");

serve({
  port: 4000,
  fetch: async (req) => {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/api/register") {
      const { username, password } = await req.json();
      const hash = await Bun.password.hash(password);
      await users.insertOne({ username, hash });
      return new Response(JSON.stringify({ message: "User registered" }), { status: 201 });
    }

    if (req.method === "POST" && url.pathname === "/api/login") {
      const { username, password } = await req.json();
      const user = await users.findOne({ username });
      if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

      const valid = await Bun.password.verify(password, user.hash);
      if (!valid) return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });

      return new Response(JSON.stringify({ message: "Login successful" }), { status: 200 });
    }

    return new Response("Not found", { status: 404 });
  },
});