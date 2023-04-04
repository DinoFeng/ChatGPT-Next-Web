import { NextRequest } from "next/server";

const OPENAI_URL = "api.openai.com";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;

export async function requestOpenai(req: NextRequest) {
  const apiKey = req.headers.get("token");
  const openaiPath = req.headers.get("path");

  const url = `${PROTOCOL}://${BASE_URL}/${openaiPath}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "api-key": `${apiKey}`,
  };
  // console.log("[Proxy] ", openaiPath);
  console.log("[url] ", url);
  console.log("[headers] ", headers);

  return fetch(url, {
    headers,
    method: req.method,
    body: req.body,
  });
}
