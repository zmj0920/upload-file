import { IRouterContext } from "koa-router";
import fs from "fs";
import { deleteFileAsPromise, uploadChunk } from "../service/upload";
import { CHUNK_SIZE, chunksPath, filesPath } from "../utils";
import { Controller, Route } from "../router";
import { concat } from "../utils/concat-files";

@Controller("/upload")
export class Index {
  @Route.post("/chunk")
  async getChunksMeta(ctx: IRouterContext, next: KoaNext) {
    const { fileSize, fileMD5, fileName } = ctx.request.body;
    const chunkSize = CHUNK_SIZE;
    const chunks = Math.ceil(fileSize / chunkSize);
    const fileKey = fileMD5;
    const files = fs.readdirSync(filesPath);
    const body = {
      chunkSize,
      chunks,
      fileKey,
      fileSize: parseInt(fileSize),
      fileName,
      status: 1,
    };
    if (files.some((i) => i.split("_")[0] === fileMD5)) {
      body.status = 0;
    } else {
      body.status = 1;
    }

    ctx.body = body;
    await next();
  }

  @Route.post("/chunk/:fileKey")
  async upload(ctx: IRouterContext, next: KoaNext) {
    const { chunk, chunks } = ctx.request.query;
    if (chunk && chunks) {
      return uploadChunk(ctx, next);
    } else {
      ctx.body = "bad request";
      ctx.status = 400;
      return next();
    }
  }

  @Route.post("/merge")
  async merge(ctx: IRouterContext, next: KoaNext) {
    const { fileKey, fileName, chunks } = ctx.request.body;
    const path: string[] = [];
    for (let i = 1; i <= chunks; i++) {
      path.push(`${chunksPath}/${fileKey}_${i}`);
    }
    try {
      concat(path, `${filesPath}/${fileKey}_${fileName}`, () => {
        console.log("Merge Success!");
        for (const i of path) {
          deleteFileAsPromise(i);
        }
      });
    } catch (e: any) {
      ctx.status = 500;
      ctx.body = e.message ? e.message : e;
      return await next(e);
    }
    ctx.body = "ok";
    await next();
  }
}
