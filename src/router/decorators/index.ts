import Router from "../router";
import { normalizePath, SymbolRoutePrefix } from "../../utils";
import {
  ClassMethodMap,
  MethodOptions,
  MethodType,
  RouteConfig,
} from "../interface";
const CLASS_METHODS: ClassMethodMap = {};

function updateMethodOptions(target: any, name: string, options: any) {
  const className = target.name || target.constructor.name;
  if (!Array.isArray(CLASS_METHODS[className])) {
    CLASS_METHODS[className] = [];
  }

  const method = CLASS_METHODS[className].find(
    (methodOptions) => methodOptions.name === name
  );

  for (const key in options) {
    if (method && typeof options[key] !== "undefined") {
      method[key as keyof MethodOptions] = options[key];
    }
  }

  if (!method) {
    CLASS_METHODS[className].push({
      name,
      target,
      controllers: target[name],
      meta: {},
      ...options,
    });
  }
}

const route =
  (config: RouteConfig): Function =>
  (target: any, name: string) => {
    config.path = normalizePath(config.path!);
    updateMethodOptions(target, name, { config });
  };

const getRoute =
  (method: MethodType) =>
  (path = "/") =>
    route({ method, path });

export const Route = {
  get: getRoute(MethodType.Get),
  post: getRoute(MethodType.Post),
  put: getRoute(MethodType.Put),
  del: getRoute(MethodType.Delete),
  patch: getRoute(MethodType.Patch),
  all: getRoute(MethodType.All),
};

export const Controller =
  (path = "") =>
  (target: any) => {
    if (!Array.isArray(CLASS_METHODS[target.name])) return;
    for (const classMethod of CLASS_METHODS[target.name]) {
      target[SymbolRoutePrefix] = path;
      Router._DecoratedRouters.set(
        {
          target,
          priority: classMethod.priority || 0,
          meta: classMethod.meta,
          ...classMethod.config!,
        },
        classMethod.controllers
      );
    }
  };
