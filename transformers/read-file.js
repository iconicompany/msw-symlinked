import fs from "fs";
import mime from 'mime-types';
import { compose, context } from "msw";

/**
 * Reads a file from the specified path and returns a composed response object.
 * @param {string} path - The path of the file to be read.
 * @returns A composed response context object with the file data and relevant headers.
 */
export const readFile = (path) => {
  const file = fs.readFileSync(path);
  const fileType = mime.lookup(path);
  return compose(
      context.set(
          {
            "Content-Length": file.byteLength.toString(),
            "Content-Type": fileType ? fileType : "application/json"
          }
      ),
      context.body(file)
  );
};