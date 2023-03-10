import crypto from "crypto";

const generate = (length: number) => {
  return new Promise<string>((resolve, reject) => {
    crypto.randomBytes(length, (error, buffer) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(buffer.toString("hex"));
    });
  });
};

export default generate;
