import type { RequestHandler } from "@sveltejs/kit";
import { connectDb } from "../../../lib/db";
import { ObjectId } from "mongodb";

export const GET: RequestHandler = async ({ params }) => {
  const db = await connectDb();
  const user = await db.collection("users").findOne({ _id: new ObjectId(params.id) });

  if (!user) return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });

  return new Response(JSON.stringify({ success: true, user }));
};
