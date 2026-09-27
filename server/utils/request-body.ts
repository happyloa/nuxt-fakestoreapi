import { createError, type H3Event } from "h3";

export const MAX_API_BODY_BYTES = 32_768;

/** Read JSON without letting a chunked request bypass the body-size limit. */
export async function readBoundedJsonBody(event: H3Event): Promise<unknown> {
  const request = event.node.req;
  const rawBody = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;

    const cleanup = () => {
      request.off("data", onData);
      request.off("end", onEnd);
      request.off("error", onError);
    };
    const onData = (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_API_BODY_BYTES) {
        cleanup();
        request.pause();
        reject(createError({ statusCode: 413, statusMessage: "Request body is too large" }));
        return;
      }
      chunks.push(chunk);
    };
    const onEnd = () => {
      cleanup();
      resolve(Buffer.concat(chunks));
    };
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    request.on("data", onData);
    request.once("end", onEnd);
    request.once("error", onError);
  });

  try {
    return JSON.parse(rawBody.toString("utf8")) as unknown;
  } catch {
    throw createError({ statusCode: 400, statusMessage: "Invalid JSON input" });
  }
}
