import Request from '@/utils/requset.js'
let request = new Request().http
let asyncRequest = new Request().asyncHttp

class Api{
	/**
	 * Get同步请求
	 * @param data 带参数
	 */
	async getAsync(url, data, header={}) {  
		return await asyncRequest({
			url: url,
			method: "GET",
			data: data,
			header: header
		})
	}
	
	/**
	 * Get请求
	 * @param data 带参数
	 */
	get(url, data, header={}) {  
		return request({
			url: url,
			method: "GET",
			data: data,
			header: header
		})
	}
	
	/**
	 * Post同步请求
	 * @param data 带参数
	 */
	async postAsync(url, data, header={}) {  
		return await asyncRequest({
			url: url,
			method: "POST",
			data: data,
			header: header
		})
	}

	/**
	 * Post请求
	 * @param data 带参数
	 */
	post(url, data, header={}) {  
		return request({
			url: url,
			method: "POST",
			data: data,
			header: header
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