import type { RequestEvent } from '@sveltejs/kit';
import { connectDb, db } from '$lib/db';

export async function POST({ request }: RequestEvent) {
  try {
    const data = await request.json();
    const { username, password } = data;

    if (!username || !password) {
      return new Response('Missing username or password', { status: 400 });
    }

    // Connect to Mongo
    await connectDb();

    // Hash the password using Bun
    const hashedPassword = await Bun.password.hash(password);

    // Insert user
    const result = await db.collection('users').insertOne({
      username,
      password: hashedPassword
    });

    return new Response('User registered successfully', { status: 201 });
  } catch (err: any) {
    console.error(err);
    return new Response('Error registering user: ' + err.message, { status: 500 });
  }
}

