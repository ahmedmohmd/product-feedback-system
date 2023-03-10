import bcrypt from "bcrypt";
const SALT: number = 10;

const encrypt = (plainText: string) => {
  return bcrypt.hash(plainText, SALT);
};

const check = (inputText: string, hashedText: string) => {
  return bcrypt.compare(inputText, hashedText);
};

export default {
  encrypt,
  check,
};
