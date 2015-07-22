# co-qiniu

A Qiniu sdk for node.js, which is for co-like interface.

##usage

    var qn = require('co-qiniu')
    qn.config({
        ACCESS_KEY: '<Your Access Key>',
        SECRET_KEY: '<Your Secret Key>'
    })

##api

**config**

配置认证
	
	config({
        ACCESS_KEY: '<Your Access Key>',
        SECRET_KEY: '<Your Secret Key>'
    })
	
	
**upload**

支持本地文件以及`buffer`上传,Json[]

	function*(bucket, key, file, extra)
	
**stat**

获取文件信息,Json[]

	function*(bucket, key)

**remove**

删除,Json[]

	function*(bucket, key)

**copy**

复制,Json[]

	function*(bucketSrc, keySrc, bucketDest, keyDest)

**move**

移动,Json[]

	function*(bucketSrc, keySrc, bucketDest, keyDest)

**list**

文件清单,Json[]

	function*(config)
	
**getUrl**

获取文件访问路径,String

	function(bucketDomain, key, isPrivate)
	
**getThumb**

获取缩略图, String

	function(bucketDomain, key, extra)
	
**getInfo**

获取文件信息, Json[]

	function*(bucketDomain, key, extra)

**getExif**

获取文件Exif, Json[]

	function*(bucketDomain, key, extra)
	
参数列表参考七牛sdk文档 [http://developer.qiniu.com/docs/v6/sdk/nodejs-sdk.html](http://developer.qiniu.com/docs/v6/sdk/nodejs-sdk.html)
	

 
