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

  if (!lowerLetterExp.test(password))
    throw new Error("Password must contain a lowercase letter");

  if (!upperLetterExp.test(password))
    throw new Error("Password must contain an uppercase letter");

  if (!numberExp.test(password))
    throw new Error("Password must contain a number");
}
