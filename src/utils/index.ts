import { join } from "path";

export const PORT = 5000;
export const CHUNK_SIZE = 10048576;

export const chunksPath = join(process.cwd(), "chunks");
export const filesPath = join(process.cwd(), "files");

export const toArray = (arr: any) => {
  return Array.isArray(arr) ? arr : [arr];
};

export const normalizePath = (path: string) => {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  return path;
};

export const setMeta =
  (meta = {}) =>
  async (ctx: any, next: Function) => {
    ctx.meta = meta;
    await next();
  };

export const SymbolRoutePrefix = Symbol("routePrefix");
