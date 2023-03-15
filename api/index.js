import Request from '@/utils/requset.js'
let request = new Request().http

class Api{
	/**
	 * Get请求
	 * @param data 带参数
	 */
	get(url, data) {  
		return request({
			url: url,
			method: "GET",
			data: data
		})
	}

	/**
	 * Post请求
	 * @param data 带参数
	 */
	post(url, data) {  
		return request({
			url: url,
			method: "POST",
			data: data
		})
	}

} 

export default new Api()