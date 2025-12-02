export function createUser(username: string, password: string): string {
  validateUsername(username);
  validatePassword(password);
  return "";
}

export function loginUser(username: string, password: string): string {
  validateUsername(username);
  validatePassword(password);
  return "";
}

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