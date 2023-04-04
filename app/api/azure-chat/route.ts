import { NextRequest } from "next/server";
import { requestOpenai } from "../common";
import _ from "lodash";

export async function POST(req: NextRequest) {
  try {
    console.debug("this is azure chat");
    const res = await requestOpenai(req);
    const bodyText = await res.text();
    const body = JSON.parse(bodyText);
    const msg = _.get(body, ["choices", 0, "message", "content"]);
    console.log(msg);
    return new Response(msg);
  } catch (error) {
    console.error("[Chat Stream]", error);
  }
}

export const config = {
  runtime: "edge",
};
