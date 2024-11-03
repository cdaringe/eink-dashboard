import * as crypto from "node:crypto";
import * as fs from "node:fs";

export const checksum = (
  filePath: string,
  algorithm: string = "sha256",
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(filePath);

    stream.on("data", (data) => {
      hash.update(data);
    });

    stream.on("end", () => {
      const checksum = hash.digest("hex");
      resolve(checksum);
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};

export const fileToInt = (filename: string) =>
  checksum(filename).then((it) => parseInt(it.substr(-12), 16));
