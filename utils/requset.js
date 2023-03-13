import config from '@/config.js'
import { getToken } from '@/utils/auth'

export default class Request {
	http(param) {
		// 请求参数
		var url = param.url,
			method = param.method,
			header = {
				'content-type': 'application/json',
				'channel': config.channel,//渠道
				'Authorization':"JWT " + getToken(),
				
				...param.header,
			},
			data = param.data || {}

		//拼接完整请求地址
		var requestUrl = config.baseUrl + url
		
		if (method) {
			method = method.toUpperCase(); //小写改为大写
		}
		
		// 返回promise
		return new Promise((resolve, reject) => {
			// 请求
			uni.request({
				url: requestUrl,
				data: data,
				method: method,
				header: header,
				success: (res) => {
					//判断令牌是否失效
					if(res.data.code == 10010){
						uni.showToast({
							title: "令牌已失效",
							icon: 'error'
						})
						uni.reLaunch({
							url: '/pages/common/login/login'
						})
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
				},
				//请求完成
				complete() {
					resolve()
				}
			})
		})
	}
}
