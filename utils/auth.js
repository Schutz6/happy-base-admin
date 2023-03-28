import config from '@/config.js'

const TokenKey = 'token'
const UserKey = 'user'
const MenusKey = 'menus'
const ParamsKey = 'params'
const TitleKey = 'title'


//登录令牌
export function getToken() {
	return uni.getStorageSync(TokenKey)
}

export function setToken(token) {
	return uni.setStorageSync(TokenKey, token)
}

export function removeToken() {
	return uni.removeStorageSync(TokenKey)
}

//用户信息
export function getUser() {
	return uni.getStorageSync(UserKey)
}

export function setUser(user) {
	return uni.setStorageSync(UserKey, user)
}

export function removeUser() {
	return uni.removeStorageSync(UserKey)
}

//菜单信息
export function getMenus() {
	return uni.getStorageSync(MenusKey)
}

export function setMenus(menus) {
	return uni.setStorageSync(MenusKey, menus)
}

export function removeMenus() {
	return uni.removeStorageSync(MenusKey)
}

//参数信息
export function getParams() {
	return uni.getStorageSync(ParamsKey)
}

export function setParams(params) {
	return uni.setStorageSync(ParamsKey, params)
}

export function removeParams() {
	return uni.removeStorageSync(ParamsKey)
}
//获取网站名称
export function getTitle() {
	let params = getParams()
	if(params && params.siteName){
		return params.siteName
	}else{
		return config.appName
	}
}
