import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";

import { PORT } from "./utils";
import { Router } from "./router";

const app = new Koa();

const router = new Router({
  dir: `${__dirname}/controllers`,
});

app.use(
  cors({
    origin: "*",
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
    maxAge: 5,
    credentials: true,
    allowMethods: ["GET", "POST", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);
console.log(`app is listening on ${PORT}`);
