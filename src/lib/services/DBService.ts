import { connectDb } from "$lib/db";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

// create user
export async function createUser(username: string, password: string): Promise<string> {
  validateUsername(username);
  validatePassword(password);

  const db = await connectDb();
  const users = db.collection("users");

  // check duplicate
  const existing = await users.findOne({ username });
  if (existing) throw new Error("Username already exists");

  const hash = await bcrypt.hash(password, 10);
  const uuid = randomUUID();

  await users.insertOne({
    uuid,
    username,
    passwordHash: hash
  });

  return uuid;
}

// login user
export async function loginUser(username: string, password: string): Promise<string> {
  validateUsername(username);
  validatePassword(password);

  const db = await connectDb();
  const users = db.collection("users");

  const user = await users.findOne({ username });

  if (!user) throw new Error("Invalid username or password");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error("Invalid username or password");

  return user.uuid;
}

// validation
export function validateUsername(username: string) {
  if (username.length < 4 || username.length > 16)
    throw new Error("Username must be between 4 to 16 characters");
}

export function validatePassword(password: string) {
  if (password.length < 4 || password.length > 20)
    throw new Error("Password must be between 4 to 20 characters");

  const lowerLetterExp = /[a-z]/;
  const upperLetterExp = /[A-Z]/;
  const numberExp = /\d/;

  if (!password.match(lowerLetterExp))
    throw new Error("Password must contain a lowercase letter");

  if (!password.match(upperLetterExp))
    throw new Error("Password must contain an uppercase letter");

  if (!password.match(numberExp))
    throw new Error("Password must contain a number");
}
