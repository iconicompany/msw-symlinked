import fs from "fs";
import { compose, context, createResponseComposition } from "msw";

import { readFile } from "../transformers/read-file";

/**
 * Stub a response using a file-based stub with optional variants.
 * @param {string} stub - The file-based stub to use for the response.
 * @param {Object} variants - Optional variants for the response.
 * @returns {import("msw").MaybePromise<import("msw").MockedResponse>} A promise resolving to the stubbed response.
 * @description The `stub` parameter should be a file path representing the stub file to use for the response.
 * The file should follow the naming convention: "name.{status}.{variant}".
 * - The "{status}" represents the HTTP status code to set in the response.
 * - The "{variant}" represents an optional variant name for different response variations.
 *
 * For example, a valid stub file name could be "agents.200.SUCCESS" for a JSON response with a status code of 200.
 * The optional variants object allows you to define different response variations based on the "{variant}" part of the file name.
 */
export const stubResponse = (stub, variants = {}) => {
  return createResponseComposition(null, [readFile(stub), (res) => {
    const symlinkedPath = fs.realpathSync(stub);
    const [status = 200, variant] = symlinkedPath.split(".").slice(-2);
    return variant in variants ? compose(context.status(Number(status)), ...variants[variant])(res) : res;
  }])();
};