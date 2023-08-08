import config from '@/config.js'
import { getToken } from '@/utils/auth'

export default class Request {
	async asyncHttp(param) {
		// 请求参数
		var url = param.url,
			method = param.method,
			header = {
				'content-type': 'application/json',
				'Channel': config.channel,//渠道
				'Authorization':"JWT " + getToken(),
				
				...param.header,
			},
			uplaodHeader = {
				'Channel': config.channel,//渠道
				'Authorization':"JWT " + getToken(),
				
				...param.header,
			},
			data = param.data || {}
		
		//过滤请求参数
		for(let key in data){
			if(data[key] === ''){
				delete data[key]
			}
			if(key === "sort"){
				data["sort"] = parseInt(data["sort"])
			}
		}
		
		//拼接完整请求地址
		var requestUrl = config.baseUrl + url
		
		if (method) {
			method = method.toUpperCase(); //小写改为大写
		}
		var [err, res] = await uni.request({
			url: requestUrl,
			data: data,
			method: method,
			header: header,
			sslVerify: false
		})
		//判断令牌是否失效
		if(res.data.code == 10010){
			uni.reLaunch({
				url: '/pages/common/login/login'
			})
		}else{
			return res.data
		}
	}
	
	http(param) {
		// 请求参数
		var url = param.url,
			method = param.method,
			header = {
				'content-type': 'application/json',
				'Channel': config.channel,//渠道
				'Authorization':"JWT " + getToken(),
				
				...param.header,
			},
			filePath = param.filePath,
			uplaodHeader = {
				'Channel': config.channel,//渠道
				'Authorization':"JWT " + getToken(),
				
				...param.header,
			},
			data = param.data || {}
			
		//过滤请求参数
		for(let key in data){
			if(data[key] === ''){
				delete data[key]
			}
			if(key === "sort"){
				data["sort"] = parseInt(data["sort"])
			}
		}

		//拼接完整请求地址
		var requestUrl = config.baseUrl + url
		
		if (method) {
			method = method.toUpperCase(); //小写改为大写
		}
		
		// 返回promise
		return new Promise((resolve, reject) => {
			if(filePath){
				//上传文件
				uni.uploadFile({
					url: requestUrl,
					filePath: filePath,
					name: 'file',
					formData: data,
					header: uplaodHeader,
					success: (uploadFileRes) => {
						let res = JSON.parse(uploadFileRes.data)
						//判断令牌是否失效
						if(res.code == 10010){
							// #ifdef H5
							setTimeout(()=>{
								//刷新网站
								if (window.parent == window) {
									//在主界面
									uni.reLaunch({
										url: '/pages/common/login/login'
									})
								}else{
									//在iframe页面
									parent.location.reload()
								}
							}, 600)
							// #endif
						}else{
							// 将结果抛出
							resolve(res)
						}
					},
					fail: () => {
						uni.showToast({
							title: "请求错误",
							icon: 'error'
						})
						resolve()
					}
				})
			}else{
				// 请求接口
				uni.request({
					url: requestUrl,
					data: data,
					method: method,
					header: header,
					sslVerify: false,
					success: (res) => {
						//判断令牌是否失效
						if(res.data.code == 10010){
							// #ifdef H5
							setTimeout(()=>{
								//刷新网站
								if (window.parent == window) {
									//在主界面
									uni.reLaunch({
										url: '/pages/common/login/login'
									})
								}else{
									//在iframe页面
									parent.location.reload()
								}
							}, 600)
							// #endif
						}else{
							// 将结果抛出
							resolve(res.data)
						}
					},
					//请求失败
					fail: (e) => {
						uni.showToast({
							title: "请求错误",
							icon: 'error'
						})
						resolve()
					}
				})
			}
		})
	}
}
