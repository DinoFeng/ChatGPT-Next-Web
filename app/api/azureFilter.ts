import { NextRequest, NextResponse } from "next/server";

const OPENAI_CHAT_PATH = "v1/chat/completions";
// const API_AZURE_CHAT_PATH = "/api/azure-chat";
// const API_CHAT_STREAM_PATH = "/api/chat-stream";

const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID ?? "v1";
const API_VERSION = process.env.API_VERSION;
const CHAT_BASE_PATH = process.env.CHAT_BASE_PATH ?? "chat/completions";

const genAzureChatPath = (azureSetting: any): string => {
  const { deploymentId, apiVersion } = azureSetting;
  const chatPath = `${deploymentId || DEPLOYMENT_ID}/${CHAT_BASE_PATH}`;
  const ver = apiVersion || API_VERSION;
  return ver ? `${chatPath}?api-version=${ver}` : chatPath;
};

export function useAzureSetting(req: NextRequest): boolean {
  const azureSettingText = req.headers.get("azureSetting") || "null";
  const azureSetting = JSON.parse(azureSettingText);
  const { useAzure } = azureSetting;
  return useAzure;
}

export default function checkAndOverWriteHeadersPath(req: NextRequest) {
  const aiPath = req.headers.get("path");
  const azureSettingText = req.headers.get("azureSetting") || "null";
  const azureSetting = JSON.parse(azureSettingText);
  const { useAzure } = azureSetting;
  console.log({ aiPath, useAzure, accessPath: req.nextUrl.pathname });
  // if (useAzure && req.nextUrl.pathname === API_CHAT_STREAM_PATH) {
  //   req.nextUrl.pathname = API_AZURE_CHAT_PATH;
  //   return NextResponse.redirect(req.nextUrl);
  // }
  if (useAzure && aiPath === OPENAI_CHAT_PATH) {
    req.headers.set("path", genAzureChatPath(azureSetting));
  }
  // return NextResponse.next({
  //   request: {
  //     headers: req.headers,
  //   },
  // });
}
