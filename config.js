export default {
	channel: 'web_admin',//应用渠道
	noLoginPage: ['/pages/index/noLogin'],//非登录页面
	// #ifdef H5
	baseUrl: '/api', //基础接口地址
	// #endif
	// #ifdef APP-PLUS
	baseUrl: 'http://xx/api'
	// #endif
}