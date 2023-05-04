import { NextRequest } from "next/server";

const OPENAI_URL = "api.openai.com";
const ORG_CHAT_PATH = "v1/chat/completions";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;

const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID ?? "v1";
const API_VERSION = process.env.API_VERSION;
const CHAT_BASE_PATH = process.env.CHAT_BASE_PATH ?? "chat/completions";

const genAzureChatPath = (azureSetting: any): string => {
  const { deploymentId, apiVersion } = azureSetting || {};
  const chatPath = `${deploymentId || DEPLOYMENT_ID}/${CHAT_BASE_PATH}`;
  const ver = apiVersion || API_VERSION;
  return ver ? `${chatPath}?api-version=${ver}` : chatPath;
};

export async function requestOpenai(req: NextRequest) {
  const apiKey = req.headers.get("token");
  const proxyPath = req.headers.get("path");

  const azureSettingText = req.headers.get("azureSetting") || "null";
  const azureSetting = JSON.parse(azureSettingText);
  const openaiPath =
    proxyPath === ORG_CHAT_PATH ? genAzureChatPath(azureSetting) : proxyPath;

  let baseUrl = BASE_URL;

  if (!baseUrl.startsWith("http")) {
    baseUrl = `${PROTOCOL}://${baseUrl}`;
  }

  console.log("[Proxy] ", openaiPath);
  // console.log("[Base Url]", baseUrl);

  // if (process.env.OPENAI_ORG_ID) {
  //   console.log("[Org ID]", process.env.OPENAI_ORG_ID);
  // }
  const url = `${baseUrl}/${openaiPath}`;
  const headers = {
    "Content-Type": "application/json",
    "api-key": `${apiKey}`,
  };
  console.log("[url] ", url);
  console.log("[headers] ", headers);
  return fetch(url, {
    headers,
    cache: "no-store",
    method: req.method,
    body: req.body,
  });
}
