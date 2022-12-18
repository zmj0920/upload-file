
前端项目：https://github.com/zmj0920/upload-file-app
## 解决大文件上传问题？

> 实现功能

* 1.分片上传文件异步同时发送给后端
* 2.实现暂停上传继续上传
* 3.重复文件直接秒传

### 1. 校验文件是否存在，不存在返回切片信息
> /upload/chunk

* 传递参数
```
fileMD5: 50bdc35edb03a38d91b1b071afb20a3c
fileSize: 9761280
lastUpdated: 2021-04-23T06:44:09.823Z
fileName: hb-test-img-1111111.raw
```
* 返回参数
```
status: 0,  状态 0文件存在， 1 不存在
chunkSize,  切片单个文件大小值
chunks,     总切片个数
fileKey,    文件md5值
fileSize,   文件总大小
fileName,   文件名称
```

### 2. 上传分片文件接口


> /chunk/:fileKey?chunk=1&chunks=10

```
fileKey 文件md5值
chunk   正在发送的片数数据
chunks  总切片片数
```
### 3. 合并文件接口，当前端发送完毕调用接口通知后端进行合并数据

> /chunk/merge

```
传递参数
fileKey  文件 md5 值
fileName 文件名称
chunks   总切割片数
```


FileReader + spark-md5 计算文件的 md5 信息

上传文件前，前端进行文件读取生成一个唯一的 md5 值


demo
https://github.com/sunhaikuo/uploadDemo
https://github.com/vvo/concat-files
https://github.com/Brooooooklyn/learning-rxjs
https://github.com/skmdev/koa-decorator-ts