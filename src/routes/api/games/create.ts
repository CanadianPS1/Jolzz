import type { RequestHandler } from "@sveltejs/kit";
import { connectDb } from "../../../lib/db";
import { ObjectId } from "mongodb";

export const POST: RequestHandler = async ({ request }) => {
  const { player1Id, player2Id, variant, winnerId } = await request.json();
  const db = await connectDb();

  const result = await db.collection("games").insertOne({
    player1Id: new ObjectId(player1Id),
    player2Id: new ObjectId(player2Id),
    variant,
    winnerId: winnerId ? new ObjectId(winnerId) : null,
    createdAt: new Date()
  });

  return new Response(JSON.stringify({ success: true, id: result.insertedId }), { status: 201 });
};
