import fs from "fs";
import { IRouterContext } from "koa-router";
import rawBody from "raw-body";
import { chunksPath } from "../utils";

export async function uploadChunk(ctx: IRouterContext, next: KoaNext) {
  const { fileKey } = ctx.params;
  const { chunk } = ctx.request.query;
  // const raw: any = await new Promise((resolve, reject) => {
  //   rawBody(
  //     ctx.req,
  //     {
  //       length: ctx.req.headers["content-length"],
  //     },
  //     (err: any, body: any) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(body);
  //     }
  //   );
  // });
  try {
    await new Promise<void>((resolve, reject) => {
      const fileName = `${fileKey}_${chunk}`;
      if (!fs.existsSync(chunksPath)) {
        fs.mkdirSync(chunksPath);
      }
      ctx.req.pipe(fs.createWriteStream(`${chunksPath}/${fileName}`));
      // fs.writeFile(`${chunksPath}/${fileName}`, raw, (err) => {
      //   if (err) {
      //     reject(err);
      //   }
      //   resolve();
      // });
    });
  } catch (e: any) {
    ctx.body = e.message ? e.message : e;
    ctx.status = 500;
    await next(e);
  }
  ctx.body = "ok";
  await next();
}

export function deleteFileAsPromise(path: string) {
  return new Promise<void>((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
