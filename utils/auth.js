import config from '@/config.js'

const TokenKey = 'token'
const UserKey = 'user'
const SettingKey = 'setting'
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

//网站设置
export function getSetting() {
	return uni.getStorageSync(SettingKey)
}

export function setSetting(setting) {
	return uni.setStorageSync(SettingKey, setting)
}

export function removeSetting() {
	return uni.removeStorageSync(SettingKey)
}
//获取网站名称
export function getTitle() {
	let setting = getSetting()
	if(setting){
		return setting.websiteName + config.appName
	}else{
		return config.appName
	}
}
