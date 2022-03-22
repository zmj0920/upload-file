import KoaRouter from "koa-router";

export enum MethodType {
  All = "all",
  Get = "get",
  Put = "put",
  Post = "post",
  Del = "del",
  Delete = "delete",
  Patch = "patch",
  Head = "head",
  Options = "options",
}

export interface DecoratedRoutersMapKey {
  target: any;
  method: MethodType;
  path: string;
  priority: number;
  meta: any;
}

export interface RouterConfig extends KoaRouter.IRouterOptions {
  dir: string;
}

export interface RouteConfig {
    method: MethodType;
    path: string;
  }
  

export interface MethodOptions {
  name: string;
  target: any;
  controllers: any;
  config?: RouteConfig;
  priority?: number;
  meta: any;
}

export interface ClassMethodMap {
  [key: string]: MethodOptions[];
}

