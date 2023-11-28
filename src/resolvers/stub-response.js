import fs from "fs";

import { readFile } from "../transformers/read-file.js";
import {HttpResponse} from "msw";

/**
 * Stub a response using a file-based stub with optional variants.
 * @param {string} stub - The file-based stub to use for the response.
 * @param {Object} variants - Optional variants for the response.
 * @returns {import("msw").MaybePromise<import("msw").MockedResponse>} A promise resolving to the stubbed response.
 * @description The `stub` parameter should be a file path representing the stub file to use for the response.
 * The file should follow the naming convention: "name.{status}.{variant}(optional).{type}".
 * - The "{status}" represents the HTTP status code to set in the response.
 * - (Optional) The "{variant}" represents an optional variant name for different response variations.
 *
 * For example, a valid stub file name could be "agents.200.SUCCESS.json" for a JSON response with a status code of 200.
 * The optional variants object allows you to define different response variations based on the "{variant}" part of the file name.
 */
export const stubResponse = async (stub, variants = {}) => {
  const { file, headers } = await readFile(stub);
  const symlinkedStub = fs.realpathSync(stub).split('/').pop();
  const pathElements = symlinkedStub.split('.');
  let status = 200, variant;
  if (pathElements.length === 3) {
    [status] = symlinkedStub.split(".").slice(-2);
  } else if (pathElements.length === 4) {
    [status, variant] = symlinkedStub.split(".").slice(-3);
  } else {
    throw new Error(`Unsupported stub path format : ${stub}`)
  }

  const responseOptions = {
    status: Number(status),
    headers
  }

  if (variant in variants) {
    responseOptions.headers = { ...responseOptions.headers, ...variants[variant].headers }
  }

  return new HttpResponse(file, responseOptions);
};