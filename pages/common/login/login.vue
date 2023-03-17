<template>
	<view class="container overflow-hidden width-max height-max">
		<view class="height-max">
			<view class="login-box">
				<view class="d-flex-center login-title">用户登录</view>
				<uni-forms ref="form" :modelValue="loginForm" :rules="loginRules">
					<uni-forms-item name="username">
						<uni-easyinput type="text" trim="both" v-model="loginForm.username" placeholder="账号" />
					</uni-forms-item>
					<uni-forms-item name="password">
						<uni-easyinput type="password" trim="both" v-model="loginForm.password" @confirm="handleLogin" placeholder="密码" />
					</uni-forms-item>
				</uni-forms>
				<button type="primary" :loading="loading" @click="handleLogin" style="font-size: 14px;">登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { setToken, removeToken, getTitle } from '@/utils/auth'
	export default {
		data() {
			return {
				loading: false,
				loginForm: {
					username: '',
					password: ''
				},
				loginRules: {
					username: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					password: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					}
				},
				
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: getTitle()
			})
			let username = uni.getStorageSync("UserName")
			if(username){
				//初始化账号
				this.loginForm.username = username
			}
		},
		methods: {
			//登录
			handleLogin() {
				this.$refs.form.validate().then(res => {
					if (!this.loading) {
						//保存账号
						uni.setStorageSync("UserName", this.loginForm.username)
						this.loading = true
						uni.showLoading({
							title: '正在登录'
						})
						this.$api.post("/login/", this.loginForm).then(res => {
							this.loading = false
							uni.hideLoading()
							if (res.code == 20000) {
								//令牌token
								setToken(res.data.token)
								//获取用户信息
								this.$store.dispatch('getUserInfo').then(res => {
									//获取菜单数据
									this.$store.dispatch('getMenus').then(res => {
										//跳转首页
										uni.reLaunch({
											url: '/pages/common/home/home'
										});
									})
								})
							} else if (res.code == 10005) {
								uni.showToast({
									title: "账号错误",
									icon: 'error'
								})
							} else if (res.code == 10006) {
								uni.showToast({
									title: "密码错误",
									icon: 'error'
								})
							} else if (res.code == 100061) {
								uni.showToast({
									title: "账号已锁定",
									icon: 'error'
								})
							} else {
								uni.showToast({
									title: "登录失败",
									icon: 'error'
								})
							}
						})
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.login-box {
		position: relative;
		top: 100px;
		width: 300px;
		border-radius: 10px;
		background-color: #fff;
		box-shadow: 0 0 20px #efefef;
		margin: 0 auto;
		padding: 30px 40px 80px 40px;
	}
	.login-title{
		font-weight: bold;
		font-size: 22px;
		padding-bottom: 30px;
	}
</style>
