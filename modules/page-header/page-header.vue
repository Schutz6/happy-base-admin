<template>
	<view>
		<view class="header d-flex between">
			<view class="d-flex">
				<uni-icons v-if="isMobile" @click="showMenus" type="bars" size="24" color="#fff"></uni-icons>
				<view class="title">{{title}}</view>
			</view>
			<view class="d-flex" v-if="user">
				<view class="d-flex-center username">{{user.name}}</view>
				<view class="d-flex-center logout" @click="showLogout">退出</view>
			</view>
		</view>
		
		<uni-popup ref="logoutDialog" type="dialog">
			<uni-popup-dialog type="info" cancelText="取消" confirmText="确定" title="提示" content="是否退出登录？" @confirm="logout"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { getTitle } from '@/utils/auth'
	export default {
		data() {
			return {
				isPC: false, //是否电脑端
				isMobile: false, //是否手机端
				title: "",
			}
		},
		computed: {
		    ...mapGetters(['user'])
		},
		mounted() {
			// #ifdef H5
			if (navigator.userAgent.indexOf('Mobile') > -1) {
				this.isMobile = true
			} else {
				this.isPC = true
			}
			// #endif
			this.title = getTitle()
			uni.setNavigationBarTitle({
				title: this.title
			})
		},
		methods: {
			//显示菜单
			showMenus(){
				uni.$emit("showMenus", {})
			},
			//显示退出登录
			showLogout(){
				this.$refs.logoutDialog.open()
			},
			//退出登录
			logout(){
				this.$api.get("/logout/").then(res => {
					uni.reLaunch({
						url: '/pages/common/login/login'
					})
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.header{
		background-color: #2b2f3a;
		box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.08);
		color: #fff;
		height: 44px;
		padding: 0 20px;
		
		.title{
			font-size: 16px;
			font-weight: bold;
		}
		
		.username{
			padding: 0 10px;
			font-size: 14px;
		}
		.logout{
			color: #2980b9;
			font-size: 14px;
			cursor: pointer;
		}
	}
</style>