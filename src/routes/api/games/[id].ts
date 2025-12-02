import type { RequestHandler } from "@sveltejs/kit";
import { connectDb } from "../../../lib/db";
import { ObjectId } from "mongodb";

export const GET: RequestHandler = async ({ params }) => {
  const db = await connectDb();
  const game = await db.collection("games").findOne({ _id: new ObjectId(params.id) });

  if (!game) return new Response(JSON.stringify({ success: false, message: "Game not found" }), { status: 404 });

  return new Response(JSON.stringify({ success: true, game }));
};
