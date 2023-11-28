import fs from "fs";
import mime from 'mime-types';

/**
 * Reads a file from the specified path and returns a composed response object.
 * @param {string} path - The path of the file to be read.
 * @returns A composed response context object with the file data and relevant headers.
 */
export const readFile = async (path) => {
  const symlinkedFile = fs.realpathSync(path);
  const file = fs.readFileSync(symlinkedFile);
  const fileType = mime.lookup(symlinkedFile);
  const headers = {
    "Content-Length": file.byteLength.toString(),
    "Content-Type": fileType ? fileType : "application/json"
  }
  return {file, headers}
};