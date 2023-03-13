<template>
	<view>
		<view class="header d-flex between">
			<view class="title">{{title}}</view>
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
				title: "",
			}
		},
		computed: {
		    ...mapGetters(['user'])
		},
		mounted() {
			this.title = getTitle()
			uni.setNavigationBarTitle({
				title: this.title
			})
		},
		methods: {
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
		color: #fff;
		height: 44px;
		padding: 0 20px;
		
		.username{
			padding: 0 10px;
			font-size: 16px;
			height: 44px;
		}
		.logout{
			color: #1890ff;
			font-size: 14px;
			cursor: pointer;
			height: 44px;
		}
	}
</style>