import type { RequestHandler } from "@sveltejs/kit";
import { connectDb } from "../../lib/db";

export const GET: RequestHandler = async () => {
  const db = await connectDb();
  const leaderboard = await db.collection("users")
    .find({})
    .sort({ "stats.wins": -1 })
    .toArray();

  return new Response(JSON.stringify({ success: true, leaderboard }));
};
