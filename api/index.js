import Request from '@/utils/requset.js'
let request = new Request().http
let asyncRequest = new Request().asyncHttp

class Api{
	/**
	 * Get同步请求
	 * @param data 带参数
	 */
	async getAsync(url, data) {  
		return await asyncRequest({
			url: url,
			method: "GET",
			data: data
		})
	}
	
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
	
	/**
	 * 上传文件
	 * @param filePath 文件地址
	 */
	uploadFile(url, filePath){
		return request({
			url: url,
			filePath: filePath
		})
	}

} 

export default new Api()