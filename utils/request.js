const baseURL = 'https://p83xirby.lc-cn-n1-shared.com'

const $http = (url, method = 'GET', data = {}) => {
	return new Promise((resolve,reject) => {
		uni.request({
			url: baseURL + url,
			method,
			header: {
				"X-LC-Id": 'p83XIRbYh9Lr4VVQ8Fq0mvlr-gzGzoHsz',
				"X-LC-Key": '9XHqGUCMu7Riujhjjqk3wNds',
				"Content-Type": 'application/json'
			},
			data,
			success(res) {
				resolve(res.data)
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

const $get = (url, data = {}) => {
	return $http(url, 'GET', data)
}

const $post = (url, data = {}) => {
	return $http(url, 'POST', data)
}

const $put = (url, data = {}) => {
	return $http(url, 'PUT', data)
}

export {
	$http,
	$get,
	$post,
	$put
}

