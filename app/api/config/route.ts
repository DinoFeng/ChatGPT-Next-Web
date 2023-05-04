import { NextRequest, NextResponse } from "next/server";

import { getServerSideConfig } from "../../config/server";

const serverConfig = getServerSideConfig();

// Danger! Don not write any secret value here!
// 警告！不要在这里写入任何敏感信息！
const DANGER_CONFIG = {
  needCode: serverConfig.needCode,
  isAdvanced: serverConfig.isAdvanced,
  defaultAccessCode: serverConfig.defaultAccessCode,
};

declare global {
  type DangerConfig = typeof DANGER_CONFIG;
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    needCode: serverConfig.needCode,
    isAdvanced: serverConfig.isAdvanced,
    defaultAccessCode: serverConfig.defaultAccessCode,
  });
}

export const runtime = "edge";
