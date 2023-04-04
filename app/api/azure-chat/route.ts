import { NextRequest } from "next/server";
import { requestOpenai } from "../common";
import _ from "lodash";

export async function POST(req: NextRequest) {
  try {
    console.debug("this is azure chat");
    const body = await req.json();
    // console.debug(body);
    const newReq = new NextRequest(req.nextUrl, {
      body: JSON.stringify(_.merge(body, { stream: false })),
      headers: req.headers,
      method: "post",
    });
    const res = await requestOpenai(newReq);
    const result = await res.json();
    const msg = _.get(result, ["choices", 0, "message", "content"]);
    if (msg) {
      console.log(msg);
      return new Response(msg);
    } else {
      console.warn("[not msg],just result:", result);
      return new Response(JSON.stringify(result));
    }
  } catch (error) {
    console.error("[Chat Stream]", error);
  }
}

export const config = {
  runtime: "edge",
};
