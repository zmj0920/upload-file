import fs from "fs";
import async from "async";

// 读取文件
function read(path: string[], cb: any) {
  async.mapSeries(path, readFile, cb);

  function readFile(path: string, c: any) {
    fs.readFile(path, c);
  }
}

// 文件写入
function write(destination: string, buffers: Buffer[], cb: any) {
  fs.writeFile(destination, Buffer.concat(buffers), cb);
}

export function concat(path: string[], destination: string, cb: any) {
  // 多个函数依次执行
  async.waterfall(
    [async.apply(read, path), async.apply(write, destination)],
    cb
  );
}
