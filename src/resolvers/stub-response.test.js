import fs from "fs";
import {stubResponse} from "./stub-response";
import {afterEach, describe, expect, it, jest} from '@jest/globals'
import path from "path";

describe("stubResponse", () => {
  it("should stub a response using a file-based stub", async () => {
    jest.spyOn(fs, 'realpathSync')

    const stub = "./test/resources/unsupported.format.200.VARIANT.json";
    await expect(async () => await stubResponse(stub)).rejects.toThrow();
  });
  it("should stub a response using a file-based stub", async () => {
    jest.spyOn(fs, 'realpathSync')

    const stub = "./test/resources/goodresponse";
    const result = await stubResponse(stub);

    expect(fs.realpathSync).toHaveBeenCalledWith(stub);
    expect(fs.realpathSync).toReturnWith(path.resolve('./test/resources/goodresponse.201.xml'))

    expect(result.status).toBe(201);
    expect(await new Response(result.body).text()).toBe('<test></test>')
    expect(result.headers.get('content-type')).toBe('application/xml')
  });

  it("should stub a response using a file-based stub using custom variant", async () => {
    jest.spyOn(fs, 'realpathSync')
    const stub = "./test/resources/badresponse";
    const variants = {
      ERROR: {
        headers: {
          test: "test"
        }
      },
    };
    const result = await stubResponse(stub, variants);

    expect(fs.realpathSync).toHaveBeenCalledWith(stub);
    expect(fs.realpathSync).toReturnWith(path.resolve('./test/resources/badresponse.500.ERROR.json'))

    expect(result.status).toBe(500);
    expect(await new Response(result.body).json()).toEqual({"error":"test"})
    expect(result.headers.get('test')).toBe('test')
    expect(result.headers.get('content-type')).toBe('application/json')
  });
});

afterEach(() => {
  jest.clearAllMocks();
})