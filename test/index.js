var qn = require('../index.js'),
	co = require('co'),
	assert = require('assert')
qn.config({
	ACCESS_KEY: '',
	SECRET_KEY: ''
})

describe('test stat', function() {
	it('result hash equal FgRyjlWGqo7ZaeFAImRhWrufJs3F', function() {
		return co(function*() {
			var result = yield qn.stat('otarim', '37948-new-beginning.jpg')
			assert.equal(result[0].hash, 'FgRyjlWGqo7ZaeFAImRhWrufJs3F')
		})
	})
})