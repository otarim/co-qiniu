'use strict'

// http://developer.qiniu.com/docs/v6/sdk/nodejs-sdk.html

var qiniu = require('qiniu'),
	coRequest = require('co-request'),
	_ = require('lodash'),
	thenifyAll = require('thenify-all')

var qiniuExtra = new qiniu.io.PutExtra()

//extra.params = params;
//extra.mimeType = mimeType;
//extra.crc32 = crc32;
//extra.checkCrc = checkCrc;

var client = thenifyAll(new qiniu.rs.Client(), {}, [
	'stat', 'copy', 'move', 'remove'
])

qiniu.io = thenifyAll(qiniu.io, {}, [
	'putFile', 'put'
])

qiniu.rsf = thenifyAll(qiniu.rsf, {}, [
	'listPrefix'
])

var _getToken = function(bucket) {
	return new qiniu.rs.PutPolicy(bucket).token()
}

var _sign = function(baseUrl) {
	var policy = new qiniu.rs.GetPolicy()
	return policy.makeRequest(baseUrl)
}

var _getInfo = function(bucket, key, extra, process) {
	extra = extra || {}
	var url = qiniu.rs.makeBaseUrl(bucket, key)
	url = process().makeRequest(url)

	if (extra.isPrivate) {
		return _sign(url)
	}
	return url
}

// 配置认证
exports.config = function(config) {
	_.assign(qiniu.conf, config)
}

// 上传
exports.upload = function*(bucket, key, file, extra) {
	// require filePath or buffer
	var token = _getToken(bucket)
	extra = _.assign({}, qiniuExtra, extra || {})
	if (Buffer.isBuffer(file)) {
		return yield qiniu.io.put(token, key, file, extra)
	} else {
		return yield qiniu.io.putFile(token, key, file, extra)
	}
}

// 文件信息，删除文件
_.forEach(['stat', 'remove'], function(fn) {
	exports[fn] = function*(bucket, key) {
		return yield client[fn](bucket, key)
	}
})

// 复制移动
_.forEach(['copy', 'move'], function(fn) {
	exports[fn] = function*(bucketSrc, keySrc, bucketDest, keyDest) {
		return yield client[fn](bucketSrc, keySrc, bucketDest, keyDest)
	}
})

// 文件清单
exports.list = function*(config) {
	config = config || {}
	var bucket = config.bucket,
		prefix = config.prefix,
		marker = config.marker,
		limit = config.limit
		// 如果有前缀，可以按前缀（prefix）进行过滤；第一次调用时置marker为null，之后的调用填上服务器返回的marker(如果有)，则列出刚刚为列完的文件
	return yield qiniu.rsf.listPrefix(bucket, prefix, marker, limit)
}

// 获取文件访问路径
exports.getUrl = function(bucketDomain, key, isPrivate) {
	var baseUrl = qiniu.rs.makeBaseUrl(bucketDomain, key)
	if (isPrivate) {
		return _sign(baseUrl)
	}
	return baseUrl
}

// 获取缩略图
exports.getThumb = function(bucketDomain, key, extra) {
	extra = extra || {}
	return _getInfo(bucketDomain, key, extra, function() {
		var iv = new qiniu.fop.ImageView()
		iv.width = extra.size || 100
		return iv
	})
}

// 获取文件信息
exports.getInfo = function*(bucketDomain, key, extra) {
	var infoUrl = _getInfo(bucketDomain, key, extra, function() {
		return new qiniu.fop.ImageInfo()
	})
	var req = yield coRequest(infoUrl)
	return req.body
}

// 获取文件Exif
exports.getExif = function*(bucketDomain, key, extra) {
	var exifUrl = _getInfo(bucketDomain, key, extra, function() {
		return new qiniu.fop.Exif()
	})
	var req = yield coRequest(exifUrl)
	return req.body
}