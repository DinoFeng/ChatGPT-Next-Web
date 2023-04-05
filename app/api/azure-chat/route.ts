// import { NextRequest } from "next/server";
// import { requestOpenai } from "../common";
// import _ from "lodash";

// export async function POST(req: NextRequest) {
//   try {
//     console.debug("this is azure chat");
//     const body = await req.json();
//     // console.debug(body);
//     const newReq = new NextRequest(req.nextUrl, {
//       body: JSON.stringify(_.merge(body, { stream: false })),
//       headers: req.headers,
//       method: "post",
//     });
//     const res = await requestOpenai(newReq);
//     const result = await res.json();
//     const msg = _.get(result, ["choices", 0, "message", "content"]);
//     if (msg) {
//       console.log(msg);
//       return new Response(msg);
//     } else {
//       console.warn("[not msg],just result:", result);
//       return new Response(JSON.stringify(result));
//     }
//   } catch (error) {
//     console.error("[Chat Stream]", error);
//   }
// }

// export const config = {
//   runtime: "edge",
// };
import { createParser } from "eventsource-parser";
import { NextRequest } from "next/server";
import { requestOpenai } from "../common";

async function createStream(req: NextRequest) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await requestOpenai(req);

  const contentType = res.headers.get("Content-Type") ?? "";
  console.log({ contentType });
  if (!contentType.includes("stream")) {
    const content = await (
      await res.text()
    ).replace(/provided:.*. You/, "provided: ***. You");
    console.log("[Stream] error ", content);
    return "```json\n" + content + "```";
  }

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: any) {
        if (event.type === "event") {
          const data = event.data;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (["[DONE]\n", "[DONE]"].includes(data)) {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            console.log({ text });
            if (text) {
              const queue = encoder.encode(text);
              controller.enqueue(queue);
            } else {
              console.log({ json });
              const stop = json.choices[0].finish_reason;
              if (stop === "stop") {
                controller.close();
                return;
              }
            }
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });
  return stream;
}

export async function POST(req: NextRequest) {
  try {
    const stream = await createStream(req);
    return new Response(stream);
  } catch (error) {
    console.error("[Chat Stream]", error);
  }
}

export const config = {
  runtime: "edge",
};
